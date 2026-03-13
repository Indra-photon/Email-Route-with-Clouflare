import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Integration } from "@/app/api/models/IntegrationModel";

/**
 * GET /api/slack/file-proxy?fileUrl=...&channelId=...
 *
 * Proxies a private Slack file through your server using the bot token,
 * so the visitor's browser can load it without needing Slack auth.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("fileUrl");
    const channelId = searchParams.get("channelId");

    if (!fileUrl || !channelId) {
        return NextResponse.json({ error: "Missing fileUrl or channelId" }, { status: 400 });
    }

    try {
        await dbConnect();

        const integration = await Integration.findOne({
            slackChannelId: channelId,
            authMethod: "oauth",
        }).lean();

        const botToken = integration?.slackAccessToken;

        if (!botToken) {
            console.error("❌ No bot token found for channelId:", channelId);
            return NextResponse.json({ error: "No bot token found for channel" }, { status: 403 });
        }

        console.log(`🔄 Proxying Slack file: ${fileUrl}`);

        const res = await fetch(fileUrl, {
            headers: {
                Authorization: `Bearer ${botToken}`,
                // Some Slack URLs need this to return the raw file instead of redirect
                "User-Agent": "Mozilla/5.0",
            },
            redirect: "follow",
        });

        console.log(`📡 Slack response status: ${res.status}, content-type: ${res.headers.get("content-type")}`);

        if (!res.ok) {
            console.error(`❌ Slack file fetch failed with status ${res.status}`);
            return NextResponse.json(
                { error: `Slack returned ${res.status}` },
                { status: res.status }
            );
        }

        const contentType = res.headers.get("content-type") || "application/octet-stream";

        // If Slack returned HTML, it means auth failed or the URL expired
        if (contentType.includes("text/html")) {
            console.error("❌ Slack returned HTML instead of file — token may be invalid or URL expired");
            return NextResponse.json(
                { error: "Slack auth failed — file may have expired" },
                { status: 403 }
            );
        }

        const buffer = await res.arrayBuffer();

        if (buffer.byteLength === 0) {
            console.error("❌ Slack returned empty file body");
            return NextResponse.json({ error: "Empty file from Slack" }, { status: 502 });
        }

        console.log(`✅ Proxying ${buffer.byteLength} bytes as ${contentType}`);

        return new Response(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600",
                // Allow cross-origin loads (needed when widget is on external site)
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error("❌ Slack file proxy error:", error);
        return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Integration } from "@/app/api/models/IntegrationModel";

/**
 * GET /api/slack/file-proxy?fileUrl=...&channelId=...
 *
 * Proxies a private Slack file through your server using the bot token,
 * so the visitor's browser can load it without needing Slack auth.
 * The file is streamed with a 1-hour public cache header.
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
            return NextResponse.json({ error: "No bot token found for channel" }, { status: 403 });
        }

        const res = await fetch(fileUrl, {
            headers: { Authorization: `Bearer ${botToken}` },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Slack returned ${res.status}` },
                { status: res.status }
            );
        }

        const buffer = await res.arrayBuffer();
        const contentType = res.headers.get("content-type") || "application/octet-stream";

        return new Response(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("❌ Slack file proxy error:", error);
        return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
    }
}

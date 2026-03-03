import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { Domain } from "@/app/api/models/DomainModel";
import crypto from "crypto";

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const widgets = await ChatWidget.find({ workspaceId: workspace._id })
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        const protocol = request.headers.get("x-forwarded-proto") || "http";
        const host = request.headers.get("host") || "localhost:3000";
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

        return NextResponse.json(
            widgets.map((w) => ({
                id: w._id.toString(),
                activationKey: w.activationKey,
                domain: w.domain,
                integrationId: w.integrationId.toString(),
                welcomeMessage: w.welcomeMessage,
                accentColor: w.accentColor,
                status: w.status,
                createdAt: w.createdAt,
                embedScript: `<script>window.CHAT_KEY = '${w.activationKey}';</script>\n<script async src="${baseUrl}/chat/widget.js"></script>`,
            }))
        );
    } catch (error) {
        console.error("GET /api/chat/widgets error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await request.json();
        const { domain, integrationId, welcomeMessage, accentColor } = body as {
            domain?: string;
            integrationId?: string;
            welcomeMessage?: string;
            accentColor?: string;
        };

        if (!domain?.trim()) {
            return NextResponse.json({ error: "Domain is required" }, { status: 400 });
        }
        if (!integrationId?.trim()) {
            return NextResponse.json({ error: "Integration is required" }, { status: 400 });
        }

        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        // Verify domain belongs to this workspace
        const domainDoc = await Domain.findOne({
            workspaceId: workspace._id,
            domain: domain.trim(),
        }).lean();
        if (!domainDoc) {
            return NextResponse.json(
                { error: "Domain not found in your workspace" },
                { status: 404 }
            );
        }

        // Verify integration belongs to this workspace
        const integrationDoc = await Integration.findOne({
            _id: integrationId,
            workspaceId: workspace._id,
        }).lean();
        if (!integrationDoc) {
            return NextResponse.json(
                { error: "Integration not found in your workspace" },
                { status: 404 }
            );
        }

        // Generate unique activation key
        const activationKey = "cw_" + crypto.randomBytes(12).toString("hex");

        const widget = await ChatWidget.create({
            workspaceId: workspace._id,
            activationKey,
            domain: domain.trim(),
            integrationId,
            welcomeMessage: welcomeMessage?.trim() || "Hi! How can we help you today?",
            accentColor: accentColor?.trim() || "#0ea5e9",
        });

        const protocol = request.headers.get("x-forwarded-proto") || "http";
        const host = request.headers.get("host") || "localhost:3000";
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

        return NextResponse.json(
            {
                id: widget._id.toString(),
                activationKey: widget.activationKey,
                domain: widget.domain,
                integrationId: widget.integrationId.toString(),
                welcomeMessage: widget.welcomeMessage,
                accentColor: widget.accentColor,
                status: widget.status,
                createdAt: widget.createdAt,
                embedScript: `<script>window.CHAT_KEY = '${widget.activationKey}';</script>\n<script async src="${baseUrl}/chat/widget.js"></script>`,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/chat/widgets error:", error);
        return NextResponse.json({ error: "Failed to create widget" }, { status: 500 });
    }
}

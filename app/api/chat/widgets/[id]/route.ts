import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const widget = await ChatWidget.findOne({
            _id: id,
            workspaceId: workspace._id,
        }).lean();

        if (!widget) {
            return NextResponse.json({ error: "Widget not found" }, { status: 404 });
        }

        const protocol = request.headers.get("x-forwarded-proto") || "http";
        const host = request.headers.get("host") || "localhost:3000";
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

        return NextResponse.json({
            id: widget._id.toString(),
            activationKey: widget.activationKey,
            domain: widget.domain,
            integrationId: widget.integrationId.toString(),
            welcomeMessage: widget.welcomeMessage,
            accentColor: widget.accentColor,
            status: widget.status,
            createdAt: widget.createdAt,
            embedScript: `<script>window.CHAT_KEY = '${widget.activationKey}';</script>\n<script async src="${baseUrl}/chat/widget.js"></script>`,
        });
    } catch (error) {
        console.error("GET /api/chat/widgets/[id] error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const deleted = await ChatWidget.findOneAndDelete({
            _id: id,
            workspaceId: workspace._id,
        });

        if (!deleted) {
            return NextResponse.json({ error: "Widget not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/chat/widgets/[id] error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

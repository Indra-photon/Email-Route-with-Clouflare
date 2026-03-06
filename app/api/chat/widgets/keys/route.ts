import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";

// GET /api/chat/widgets/keys
// Returns all active widget activation keys for the current workspace.
// Used by AgentPresenceProvider to register agent presence for all widgets.
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const widgets = await ChatWidget.find({
            workspaceId: workspace._id,
            status: "active",
        })
            .select("activationKey")
            .lean();

        const keys = widgets
            .map((w) => w.activationKey)
            .filter(Boolean);

        return NextResponse.json({ keys });
    } catch (error) {
        console.error("GET /api/chat/widgets/keys error:", error);
        return NextResponse.json({ error: "Failed to fetch keys" }, { status: 500 });
    }
}

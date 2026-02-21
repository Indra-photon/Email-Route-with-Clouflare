import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Integration } from "@/app/api/models/IntegrationModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

type RouteParams = { params: Promise<{ id: string }> };

// DELETE /api/integrations/[id]
export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const deleted = await Integration.findOneAndDelete({
            _id: id,
            workspaceId: workspace._id,
        });

        if (!deleted) {
            return NextResponse.json({ error: "Integration not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Integration deleted" });
    } catch (error) {
        console.error("Delete integration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

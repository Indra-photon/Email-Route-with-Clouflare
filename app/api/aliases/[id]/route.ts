import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { Alias } from "@/app/api/models/AliasModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

type RouteParams = { params: Promise<{ id: string }> };

// DELETE /api/aliases/[id] — delete an alias
export async function DELETE(
    _request: Request,
    { params }: RouteParams
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const alias = await Alias.findOneAndDelete({
            _id: id,
            workspaceId: workspace._id,
        });

        if (!alias) {
            return NextResponse.json({ error: "Alias not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Alias deleted" });
    } catch (error) {
        console.error("Error deleting alias", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/aliases/[id] — update alias integration or status
export async function PATCH(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const { integrationId, status } = body as {
            integrationId?: string | null;
            status?: "active" | "inactive";
        };

        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const alias = await Alias.findOne({ _id: id, workspaceId: workspace._id });
        if (!alias) {
            return NextResponse.json({ error: "Alias not found" }, { status: 404 });
        }

        // Update integration
        if (integrationId !== undefined) {
            if (integrationId === null || integrationId === "") {
                alias.integrationId = null;
            } else {
                const integration = await Integration.findOne({
                    _id: integrationId,
                    workspaceId: workspace._id,
                }).lean();
                if (!integration) {
                    return NextResponse.json({ error: "Integration not found" }, { status: 404 });
                }
                alias.integrationId = integration._id as any;
            }
        }

        // Update status (enable / disable)
        if (status && ["active", "inactive"].includes(status)) {
            alias.status = status;
        }

        await alias.save();

        // Populate to return full data
        const updated = await Alias.findById(alias._id)
            .populate("domainId")
            .populate("integrationId")
            .lean();

        const a = updated as any;

        return NextResponse.json({
            id: a._id.toString(),
            localPart: a.localPart,
            email: a.email,
            status: a.status,
            domain: a.domainId?.domain ?? "",
            integrationId: a.integrationId?._id?.toString() ?? null,
            integrationName: a.integrationId?.name ?? null,
            integrationType: a.integrationId?.type ?? null,
            createdAt: a.createdAt,
        });
    } catch (error) {
        console.error("Error updating alias", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

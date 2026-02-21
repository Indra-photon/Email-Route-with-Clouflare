import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import dbConnect from "@/lib/dbConnect";
import ReceivingRequest from "@/app/api/models/ReceivingRequestModel";

type RouteParams = { params: Promise<{ id: string }> };

// GET single receiving request by ID
export async function GET(
    _request: NextRequest,
    { params }: RouteParams
) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const { id } = await params;
        await dbConnect();

        const request = await ReceivingRequest.findById(id)
            .populate("domainId")
            .populate("workspaceId")
            .lean();

        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        const r = request as any;
        const formatted = {
            id: r._id.toString(),
            domain: r.domainId?.domain || "N/A",
            domainId: r.domainId?._id?.toString() || null,
            requestedBy: r.requestedBy,
            workspace: r.workspaceId?.name || "Unknown Workspace",
            workspaceId: r.workspaceId?._id?.toString() || null,
            status: r.status,
            requestedAt: r.requestedAt,
            reviewedAt: r.reviewedAt || null,
            reviewedBy: r.reviewedBy || null,
            rejectionReason: r.rejectionReason || null,
            mxRecords: r.mxRecords || [],
            notes: r.notes || null,
            domainInfo: {
                verifiedForSending: r.domainId?.verifiedForSending || false,
                receivingEnabled: r.domainId?.receivingEnabled || false,
            },
        };

        return NextResponse.json({ request: formatted }, { status: 200 });
    } catch (error) {
        console.error("Error fetching receiving request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE a receiving request
export async function DELETE(
    _request: NextRequest,
    { params }: RouteParams
) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const { id } = await params;
        await dbConnect();

        const deleted = await ReceivingRequest.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        return NextResponse.json(
            { success: true, message: "Request deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting receiving request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import dbConnect from "@/lib/dbConnect";
import ReceivingRequest from "@/app/api/models/ReceivingRequestModel";
import { Domain } from "@/app/api/models/DomainModel";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(
    _request: NextRequest,
    { params }: RouteParams
) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const { id } = await params;
        await dbConnect();

        const receivingRequest = await ReceivingRequest.findById(id);

        if (!receivingRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (receivingRequest.status === "pending") {
            return NextResponse.json(
                { error: "Request is already pending" },
                { status: 400 }
            );
        }

        // Reset the request back to pending
        receivingRequest.status = "pending";
        receivingRequest.reviewedAt = undefined;
        receivingRequest.reviewedBy = undefined;
        receivingRequest.rejectionReason = undefined;
        receivingRequest.mxRecords = [];
        receivingRequest.notes = undefined;
        await receivingRequest.save();

        // If domain had receiving enabled via this request — disable it
        const domain = await Domain.findById(receivingRequest.domainId);
        if (domain && domain.receivingEnabled) {
            domain.receivingEnabled = false;
            domain.receivingEnabledAt = null;
            domain.receivingMxRecords = [];
            await domain.save();
        }

        return NextResponse.json(
            { success: true, message: "Request re-opened and set back to pending" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error re-opening receiving request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import dbConnect from "@/lib/dbConnect";
import { Domain } from "@/app/api/models/DomainModel";
import ReceivingRequest from "@/app/api/models/ReceivingRequestModel";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(
    _request: NextRequest,
    { params }: RouteParams
) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const { id } = await params;
        await dbConnect();

        const domain = await Domain.findById(id);

        if (!domain) {
            return NextResponse.json({ error: "Domain not found" }, { status: 404 });
        }

        // Cascade delete: remove all receiving requests for this domain
        const deletedRequests = await ReceivingRequest.deleteMany({ domainId: domain._id });

        // Delete the domain itself
        await Domain.findByIdAndDelete(id);

        return NextResponse.json(
            {
                success: true,
                message: `Domain "${domain.domain}" deleted successfully`,
                cascadeDeleted: {
                    receivingRequests: deletedRequests.deletedCount,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting domain:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

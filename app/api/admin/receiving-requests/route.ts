import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import dbConnect from "@/lib/dbConnect";
import ReceivingRequest from "@/app/api/models/ReceivingRequestModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authError = await requireAdmin();
    if (authError) return authError;

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status"); // 'pending', 'approved', 'rejected', or null for all

    // Connect to database
    await dbConnect();

    // Build query
    const query: any = {};
    if (statusFilter && ["pending", "approved", "rejected"].includes(statusFilter)) {
      query.status = statusFilter;
    }

    // Fetch requests with populated domain and workspace
    const requests = await ReceivingRequest.find(query)
      .sort({ requestedAt: -1 })
      .populate("domainId")
      .populate("workspaceId")
      .lean();

    // Format response
    const formattedRequests = requests.map((request: any) => ({
      id: request._id.toString(),
      domain: request.domainId?.domain || "N/A",
      domainId: request.domainId?._id?.toString() || null,
      requestedBy: request.requestedBy,
      workspace: request.workspaceId?.name || "Unknown Workspace",
      workspaceId: request.workspaceId?._id?.toString() || null,
      status: request.status,
      requestedAt: request.requestedAt,
      reviewedAt: request.reviewedAt || null,
      reviewedBy: request.reviewedBy || null,
      rejectionReason: request.rejectionReason || null,
      mxRecords: request.mxRecords || [],
      notes: request.notes || null,
      domainInfo: {
        verifiedForSending: request.domainId?.verifiedForSending || false,
        receivingEnabled: request.domainId?.receivingEnabled || false,
      },
    }));

    return NextResponse.json(
      {
        requests: formattedRequests,
        total: formattedRequests.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin receiving requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Domain } from "@/app/api/models/DomainModel";
import ReceivingRequest from "@/app/api/models/ReceivingRequestModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get workspace
    const workspace = await getOrCreateWorkspaceForCurrentUser();
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Get domainId from params
    const { domainId } = await params;

    if (!domainId) {
      return NextResponse.json(
        { error: "domainId is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Verify domain belongs to user's workspace
    const domain = await Domain.findOne({
      _id: domainId,
      workspaceId: workspace._id,
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found or access denied" },
        { status: 404 }
      );
    }

    // Find receiving request for this domain
    const receivingRequest = await ReceivingRequest.findOne({
      domainId: domain._id,
    }).sort({ requestedAt: -1 }); // Get most recent request

    // If no request exists
    if (!receivingRequest) {
      return NextResponse.json(
        {
          status: "not_requested",
          message: "No receiving request found for this domain",
        },
        { status: 200 }
      );
    }

    // Build response based on status
    const response: any = {
      status: receivingRequest.status,
      requestedAt: receivingRequest.requestedAt,
    };

    // Add reviewed date if exists
    if (receivingRequest.reviewedAt) {
      response.reviewedAt = receivingRequest.reviewedAt;
    }

    // Add MX records if approved
    if (receivingRequest.status === "approved" && receivingRequest.mxRecords) {
      response.mxRecords = receivingRequest.mxRecords;
    }

    // Add rejection reason if rejected
    if (receivingRequest.status === "rejected" && receivingRequest.rejectionReason) {
      response.rejectionReason = receivingRequest.rejectionReason;
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching receiving request status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

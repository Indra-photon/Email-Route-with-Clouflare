import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Domain } from "@/app/api/models/DomainModel";
import ReceivingRequest from "@/app/api/models/ReceivingRequestModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";
import ReceivingRequestReceivedEmail from "@/lib/email-templates/receiving-request-received";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get current user details
    const user = await currentUser();
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    // Get workspace
    const workspace = await getOrCreateWorkspaceForCurrentUser();
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { domainId } = body;

    // Validate domainId
    if (!domainId) {
      return NextResponse.json(
        { error: "domainId is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if domain exists and belongs to user's workspace
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

    // Check if domain is verified for sending
    if (!domain.verifiedForSending) {
      return NextResponse.json(
        { error: "Domain must be verified for sending first" },
        { status: 400 }
      );
    }

    // Check if receiving is already enabled
    if (domain.receivingEnabled) {
      return NextResponse.json(
        { error: "Receiving is already enabled for this domain" },
        { status: 400 }
      );
    }

    // Check if request already exists
    const existingRequest = await ReceivingRequest.findOne({
      domainId: domain._id,
      status: { $in: ["pending", "approved"] },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          error: "A request already exists for this domain",
          request: {
            id: existingRequest._id.toString(),
            status: existingRequest.status,
            requestedAt: existingRequest.requestedAt,
          },
        },
        { status: 400 }
      );
    }

    // Create new receiving request
    const receivingRequest = await ReceivingRequest.create({
      domainId: domain._id,
      workspaceId: workspace._id,
      requestedBy: userEmail,
      status: "pending",
      requestedAt: new Date(),
    });

    // Update domain with receivingRequestId
    domain.receivingRequestId = receivingRequest._id;
    await domain.save();

    // Send email notification to user
    try {
      const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/domains/${domain._id}/verify`;
      const userName = user.firstName || user.emailAddresses[0].emailAddress.split("@")[0];

      await resend.emails.send({
        from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
        to: userEmail,
        subject: `Your Receiving Request for ${domain.domain} is Being Reviewed`,
        react: ReceivingRequestReceivedEmail({
          userName,
          domain: domain.domain,
          requestId: receivingRequest._id.toString().slice(-6),
          requestedAt: receivingRequest.requestedAt.toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          }),
          dashboardUrl,
        }),
      });

      console.log(`User notification email sent to ${userEmail}`);
    } catch (emailError) {
      console.error("Failed to send user notification email:", emailError);
      // Don't fail the request if email fails
    }

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
      if (adminEmail) {
        await resend.emails.send({
          from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
          to: adminEmail,
          subject: `🔔 New Receiving Request: ${domain.domain}`,
          html: `
            <h2>New Receiving Request Received</h2>
            <p><strong>Domain:</strong> ${domain.domain}</p>
            <p><strong>Requested by:</strong> ${userEmail}</p>
            <p><strong>Workspace:</strong> ${workspace._id}</p>
            <p><strong>Requested:</strong> ${receivingRequest.requestedAt.toLocaleString()}</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/receiving-requests">Review now</a></p>
          `,
        });

        console.log(`Admin notification email sent to ${adminEmail}`);
      }
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the request if email fails
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        request: {
          id: receivingRequest._id.toString(),
          status: receivingRequest.status,
          requestedAt: receivingRequest.requestedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating receiving request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

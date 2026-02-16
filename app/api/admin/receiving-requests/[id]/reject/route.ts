import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, checkAdminAuth } from "@/lib/admin-auth";
import dbConnect from "@/lib/dbConnect";
import ReceivingRequest from "@/app/api/models/ReceivingRequestModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const authError = await requireAdmin();
    if (authError) return authError;

    const authCheck = await checkAdminAuth();
    const adminEmail = authCheck.user?.emailAddresses?.[0]?.emailAddress || "Admin";

    // Get request ID from params
    const { id } = await params;

    // Parse request body
    const body = await request.json();
    const { reason } = body;

    // Validate rejection reason
    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the receiving request
    const receivingRequest = await ReceivingRequest.findById(id);

    if (!receivingRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Check if already reviewed
    if (receivingRequest.status !== "pending") {
      return NextResponse.json(
        { error: `Request already ${receivingRequest.status}` },
        { status: 400 }
      );
    }

    // Get domain for email
    const domain = await Domain.findById(receivingRequest.domainId);

    // Update receiving request
    receivingRequest.status = "rejected";
    receivingRequest.reviewedAt = new Date();
    receivingRequest.reviewedBy = adminEmail;
    receivingRequest.rejectionReason = reason;
    await receivingRequest.save();

    // Send email notification to user
    try {
      const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/domains/${domain?._id}/verify`;

      await resend.emails.send({
        from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
        to: receivingRequest.requestedBy,
        subject: `Receiving Request for ${domain?.domain} - Update Needed`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc2626;">Receiving Request Update</h2>

            <p>Hi there,</p>

            <p>We've reviewed your request for email receiving on:</p>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Domain:</strong> ${domain?.domain}</p>
              <p style="margin: 5px 0;"><strong>Request ID:</strong> #${id.slice(-6)}</p>
            </div>

            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #991b1b;"><strong>Status:</strong> Additional information needed</p>
              <p style="margin: 10px 0 0 0; color: #991b1b;"><strong>Reason:</strong></p>
              <p style="margin: 5px 0 0 0; color: #7f1d1d;">${reason}</p>
            </div>

            <p>Please reply to this email to discuss next steps, or contact our support team for assistance.</p>

            <div style="margin: 30px 0;">
              <a href="${dashboardUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Dashboard
              </a>
            </div>

            <hr style="border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="font-size: 14px; color: #6b7280;">
              Reviewed: ${new Date().toLocaleString()}<br>
              Reviewed by: ${adminEmail}
            </p>

            <p style="font-size: 14px; color: #6b7280;">
              Questions? Reply to this email and we'll be happy to help.
            </p>

            <p style="font-size: 14px; color: #6b7280;">
              Best,<br>
              The Team
            </p>
          </div>
        `,
      });

      console.log(`Rejection email sent to ${receivingRequest.requestedBy}`);
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Request rejected and user notified",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting receiving request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

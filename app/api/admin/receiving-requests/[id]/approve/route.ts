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
    const { mxRecords, notes } = body;

    // Validate MX records
    if (!mxRecords || !Array.isArray(mxRecords) || mxRecords.length === 0) {
      return NextResponse.json(
        { error: "MX records are required" },
        { status: 400 }
      );
    }

    // Validate MX record format
    for (const record of mxRecords) {
      if (!record.value || !record.priority) {
        return NextResponse.json(
          { error: "Each MX record must have a value and priority" },
          { status: 400 }
        );
      }
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

    // Update receiving request
    receivingRequest.status = "approved";
    receivingRequest.reviewedAt = new Date();
    receivingRequest.reviewedBy = adminEmail;
    receivingRequest.mxRecords = mxRecords;
    receivingRequest.notes = notes || null;
    await receivingRequest.save();

    // Update domain
    const domain = await Domain.findById(receivingRequest.domainId);

    if (domain) {
      domain.receivingEnabled = true;
      domain.receivingEnabledAt = new Date();
      domain.receivingMxRecords = mxRecords;
      await domain.save();
    }

    // Send email notification to user
    try {
      const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/domains/${domain?._id}/verify`;

      // Build MX records table HTML
      const mxRecordsHtml = mxRecords
        .map(
          (record) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${record.type}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${record.name}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${record.value}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${record.priority}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${record.ttl}</td>
        </tr>
      `
        )
        .join("");

      await resend.emails.send({
        from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
        to: receivingRequest.requestedBy,
        subject: `✅ Receiving Enabled for ${domain?.domain}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #16a34a;">Great news! Email receiving has been enabled</h2>

            <p>Hi there,</p>

            <p>Email receiving has been enabled for your domain:</p>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Domain:</strong> ${domain?.domain}</p>
            </div>

            <h3 style="color: #2563eb;">MX Records to Add</h3>
            <p>Add these MX records at your DNS provider to start receiving emails:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <thead style="background-color: #f3f4f6;">
                <tr>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Type</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Name</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Value</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Priority</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">TTL</th>
                </tr>
              </thead>
              <tbody>
                ${mxRecordsHtml}
              </tbody>
            </table>

            <h3>Next Steps:</h3>
            <ol style="line-height: 1.8;">
              <li>Login to your DNS provider (GoDaddy, Cloudflare, etc.)</li>
              <li>Add the MX records shown above</li>
              <li>Wait 10-30 minutes for DNS propagation</li>
              <li>Test by sending an email to your domain</li>
            </ol>

            <div style="margin: 30px 0;">
              <a href="${dashboardUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Dashboard
              </a>
            </div>

            <hr style="border-top: 1px solid #e5e7eb; margin: 30px 0;">

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

      console.log(`Approval email sent to ${receivingRequest.requestedBy}`);
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Request approved and user notified",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving receiving request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

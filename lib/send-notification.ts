import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface MxRecord {
  type: string;
  name: string;
  value: string;
  priority: number;
  ttl: string;
}

/**
 * Send email to user when they submit a receiving request
 */
export async function sendRequestReceivedEmail({
  userEmail,
  userName,
  domain,
  requestId,
  requestedAt,
  dashboardUrl,
}: {
  userEmail: string;
  userName: string;
  domain: string;
  requestId: string;
  requestedAt: Date;
  dashboardUrl: string;
}) {
  try {
    const formattedDate = requestedAt.toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });

    await resend.emails.send({
      from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
      to: userEmail,
      subject: `Your Receiving Request for ${domain} is Being Reviewed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Your Receiving Request for ${domain} is Being Reviewed</h2>
          <p>Hi ${userName},</p>
          <p>We've received your request to enable email receiving for:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Domain:</strong> ${domain}</p>
            <p style="margin: 5px 0;"><strong>Request ID:</strong> #${requestId}</p>
            <p style="margin: 5px 0;"><strong>Requested:</strong> ${formattedDate}</p>
          </div>
          <p>Our team will review your request and enable receiving within 1-2 hours during business hours.</p>
          <p>You'll receive another email with MX records once your request is approved.</p>
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View in Dashboard
            </a>
          </div>
          <hr style="border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 14px; color: #6b7280;">Questions? Reply to this email and we'll be happy to help.</p>
          <p style="font-size: 14px; color: #6b7280;">Best,<br>The Team</p>
        </div>
      `,
    });

    console.log(`Request received email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send request received email:", error);
    return { success: false, error };
  }
}

/**
 * Send email to admin when a new request is submitted
 */
export async function sendAdminNotification({
  domain,
  requestedBy,
  workspace,
  requestedAt,
  reviewUrl,
}: {
  domain: string;
  requestedBy: string;
  workspace: string;
  requestedAt: Date;
  reviewUrl: string;
}) {
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (!adminEmail) {
      console.log("No admin email configured, skipping admin notification");
      return { success: false, error: "No admin email configured" };
    }

    const formattedDate = requestedAt.toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });

    await resend.emails.send({
      from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
      to: adminEmail,
      subject: `🔔 New Receiving Request: ${domain}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #7c3aed;">🔔 New Receiving Request: ${domain}</h2>
          <p>A new receiving request has been submitted.</p>
          <div style="background-color: #faf5ff; border: 1px solid #c084fc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #6b21a8;">Request Details</h3>
            <p style="margin: 5px 0;"><strong>Domain:</strong> ${domain}</p>
            <p style="margin: 5px 0;"><strong>Requested by:</strong> ${requestedBy}</p>
            <p style="margin: 5px 0;"><strong>Workspace:</strong> ${workspace}</p>
            <p style="margin: 5px 0;"><strong>Requested:</strong> ${formattedDate}</p>
          </div>
          <div style="margin: 30px 0;">
            <a href="${reviewUrl}" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Request Now
            </a>
          </div>
          <hr style="border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 14px; color: #6b7280;">This is an automated notification from the Email Router admin system.</p>
        </div>
      `,
    });

    console.log(`Admin notification sent to ${adminEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return { success: false, error };
  }
}

/**
 * Send email to user when their request is approved
 */
export async function sendApprovedEmail({
  userEmail,
  userName,
  domain,
  mxRecords,
  dashboardUrl,
}: {
  userEmail: string;
  userName: string;
  domain: string;
  mxRecords: MxRecord[];
  dashboardUrl: string;
}) {
  try {
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
      to: userEmail,
      subject: `✅ Receiving Enabled for ${domain}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #16a34a;">✅ Receiving Enabled for ${domain}</h2>
          <p>Hi ${userName},</p>
          <p>Great news! Email receiving has been enabled for your domain:</p>
          <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #166534;"><strong>Domain:</strong> ${domain}</p>
          </div>
          <h3 style="color: #2563eb; margin-top: 30px;">MX Records to Add</h3>
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
          <h3 style="margin-top: 30px;">Next Steps:</h3>
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
          <p style="font-size: 14px; color: #6b7280;">Questions? Reply to this email and we'll be happy to help.</p>
          <p style="font-size: 14px; color: #6b7280;">Best,<br>The Team</p>
        </div>
      `,
    });

    console.log(`Approval email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send approval email:", error);
    return { success: false, error };
  }
}

/**
 * Send email to user when their request is rejected
 */
export async function sendRejectedEmail({
  userEmail,
  userName,
  domain,
  requestId,
  rejectionReason,
  reviewedAt,
  reviewedBy,
  dashboardUrl,
}: {
  userEmail: string;
  userName: string;
  domain: string;
  requestId: string;
  rejectionReason: string;
  reviewedAt: Date;
  reviewedBy: string;
  dashboardUrl: string;
}) {
  try {
    const formattedDate = reviewedAt.toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });

    await resend.emails.send({
      from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
      to: userEmail,
      subject: `Receiving Request for ${domain} - Update Needed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #dc2626;">Receiving Request for ${domain} - Update Needed</h2>
          <p>Hi ${userName},</p>
          <p>We've reviewed your request for email receiving on:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Domain:</strong> ${domain}</p>
            <p style="margin: 5px 0;"><strong>Request ID:</strong> #${requestId}</p>
          </div>
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b;"><strong>Status:</strong> Additional information needed</p>
            <p style="margin: 10px 0 0 0; color: #991b1b;"><strong>Reason:</strong></p>
            <p style="margin: 5px 0 0 0; color: #7f1d1d;">${rejectionReason}</p>
          </div>
          <p>Please reply to this email to discuss next steps, or contact our support team for assistance.</p>
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View in Dashboard
            </a>
          </div>
          <hr style="border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; font-size: 14px; color: #6b7280;">
            <p style="margin: 5px 0;"><strong>Reviewed:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Reviewed by:</strong> ${reviewedBy}</p>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">Questions? Reply to this email and we'll be happy to help.</p>
          <p style="font-size: 14px; color: #6b7280;">Best,<br>The Team</p>
        </div>
      `,
    });

    console.log(`Rejection email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    return { success: false, error };
  }
}

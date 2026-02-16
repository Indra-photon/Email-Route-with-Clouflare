import { Resend } from "resend";
import ReceivingRequestReceivedEmail from "@/lib/email-templates/receiving-request-received";
import ReceivingApprovedEmail from "@/lib/email-templates/receiving-approved";
import ReceivingRejectedEmail from "@/lib/email-templates/receiving-rejected";
import AdminNewRequestEmail from "@/lib/email-templates/admin-new-request";

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
    await resend.emails.send({
      from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
      to: userEmail,
      subject: `Your Receiving Request for ${domain} is Being Reviewed`,
      react: ReceivingRequestReceivedEmail({
        userName,
        domain,
        requestId,
        requestedAt: requestedAt.toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        }),
        dashboardUrl,
      }),
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

    await resend.emails.send({
      from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
      to: adminEmail,
      subject: `🔔 New Receiving Request: ${domain}`,
      react: AdminNewRequestEmail({
        domain,
        requestedBy,
        workspace,
        requestedAt: requestedAt.toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        }),
        reviewUrl,
      }),
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
    await resend.emails.send({
      from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
      to: userEmail,
      subject: `✅ Receiving Enabled for ${domain}`,
      react: ReceivingApprovedEmail({
        userName,
        domain,
        mxRecords,
        dashboardUrl,
      }),
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
    await resend.emails.send({
      from: process.env.NOTIFICATION_FROM_EMAIL || "notifications@yourdomain.com",
      to: userEmail,
      subject: `Receiving Request for ${domain} - Update Needed`,
      react: ReceivingRejectedEmail({
        userName,
        domain,
        requestId,
        rejectionReason,
        reviewedAt: reviewedAt.toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        }),
        reviewedBy,
        dashboardUrl,
      }),
    });

    console.log(`Rejection email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    return { success: false, error };
  }
}

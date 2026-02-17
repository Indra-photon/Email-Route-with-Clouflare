// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import { Alias } from "@/app/api/models/AliasModel";
// import { Domain } from "@/app/api/models/DomainModel";
// import { Integration } from "@/app/api/models/IntegrationModel";

// export async function POST(request: Request) {
//   try {
//     // 1. Parse Resend webhook payload
//     const payload = await request.json();
    
//     console.log("📧 Received email webhook from Resend:", {
//       type: payload.type,
//       to: payload.data?.to,
//       from: payload.data?.from,
//       subject: payload.data?.subject,
//     });

//     // 2. Verify it's an email.received event
//     if (payload.type !== "email.received") {
//       console.log("⚠️ Ignoring non-email event:", payload.type);
//       return NextResponse.json({ message: "Event ignored" });
//     }

//     const emailData = payload.data;
    
//     // 3. Extract recipient email
//     const recipientEmail = Array.isArray(emailData.to) 
//       ? emailData.to[0] 
//       : emailData.to;

//     if (!recipientEmail) {
//       console.error("❌ No recipient email found");
//       return NextResponse.json({ error: "No recipient" }, { status: 400 });
//     }

//     // 4. Parse email address (support@acme.com → support + acme.com)
//     const emailLower = recipientEmail.toLowerCase().trim();
//     const atIndex = emailLower.indexOf("@");
    
//     if (atIndex === -1) {
//       console.error("❌ Invalid email format:", emailLower);
//       return NextResponse.json({ error: "Invalid email" }, { status: 400 });
//     }

//     const localPart = emailLower.slice(0, atIndex);
//     const domainPart = emailLower.slice(atIndex + 1);

//     console.log("🔍 Looking up alias:", { localPart, domain: domainPart, email: emailLower });

//     // 5. Look up alias in MongoDB (NO POPULATE)
//     await dbConnect();
    
//     const alias = await Alias.findOne({ 
//       localPart: localPart,
//       email: emailLower 
//     }).lean().exec();

//     if (!alias) {
//       console.warn("⚠️ No alias found for:", emailLower);
//       return NextResponse.json({ message: "Alias not found" }, { status: 200 });
//     }

//     console.log("✅ Found alias:", alias.email);

//     // 6. Manually fetch integration (instead of populate)
//     if (!alias.integrationId) {
//       console.warn("⚠️ No integration configured for alias:", alias.email);
//       return NextResponse.json({ message: "No integration" }, { status: 200 });
//     }

//     const integration = await Integration.findById(alias.integrationId).lean().exec();
    
//     if (!integration || !integration.webhookUrl) {
//       console.warn("⚠️ Integration not found or has no webhook:", alias.email);
//       return NextResponse.json({ message: "No integration" }, { status: 200 });
//     }

//     // 7. Format message for Slack/Discord
//     const fromEmail = emailData.from || "Unknown";
//     const subject = emailData.subject || "(no subject)";
    
//     // Try multiple possible body fields from Resend
//     const textBody = 
//       emailData.text || 
//       emailData.html || 
//       emailData.parsedData?.textBody || 
//       emailData.parsedData?.htmlBody ||
//       emailData.body?.text ||
//       emailData.body?.html ||
//       "";
      
//     const snippet = textBody.slice(0, 500);

//     // Debug log
//     console.log("📝 Email body extraction:", {
//       hasText: !!emailData.text,
//       hasHtml: !!emailData.html,
//       bodyLength: snippet.length,
//       bodyPreview: snippet.slice(0, 100),
//     });

//     const messagePayload = integration.type === "slack" 
//       ? {
//           text: `📧 New email to *${emailLower}*\n*From:* ${fromEmail}\n*Subject:* ${subject}\n\n${snippet}`
//         }
//       : {
//           content: `📧 **New email to ${emailLower}**\n**From:** ${fromEmail}\n**Subject:** ${subject}\n\n${snippet}`
//         };

//     console.log("📤 Posting to", integration.type, "webhook");

//     // 8. Post to Slack/Discord
//     const webhookResponse = await fetch(integration.webhookUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(messagePayload),
//     });

//     if (!webhookResponse.ok) {
//       const errorText = await webhookResponse.text();
//       console.error("❌ Webhook post failed:", {
//         status: webhookResponse.status,
//         error: errorText,
//       });
//       return NextResponse.json(
//         { error: "Webhook failed" }, 
//         { status: 500 }
//       );
//     }

//     console.log("✨ Successfully posted to", integration.type);

//     return NextResponse.json({ 
//       success: true,
//       message: "Email routed to integration"
//     });

//   } catch (error) {
//     console.error("❌ Error processing webhook:", error);
//     return NextResponse.json(
//       { error: "Internal error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Alias } from "@/app/api/models/AliasModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 1. Parse Resend webhook payload
    const payload = await request.json();
    
    console.log("📧 Received email webhook from Resend:", {
      type: payload.type,
      to: payload.data?.to,
      from: payload.data?.from,
      subject: payload.data?.subject,
    });

    // 2. Verify it's an email.received event
    if (payload.type !== "email.received") {
      console.log("⚠️ Ignoring non-email event:", payload.type);
      return NextResponse.json({ message: "Event ignored" });
    }

    const emailData = payload.data;
    
    // 3. Extract recipient email
    const recipientEmail = Array.isArray(emailData.to) 
      ? emailData.to[0] 
      : emailData.to;

    if (!recipientEmail) {
      console.error("❌ No recipient email found");
      return NextResponse.json({ error: "No recipient" }, { status: 400 });
    }

    // 4. Parse email address (support@acme.com → support + acme.com)
    const emailLower = recipientEmail.toLowerCase().trim();
    const atIndex = emailLower.indexOf("@");
    
    if (atIndex === -1) {
      console.error("❌ Invalid email format:", emailLower);
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const localPart = emailLower.slice(0, atIndex);
    const domainPart = emailLower.slice(atIndex + 1);

    console.log("🔍 Looking up alias:", { localPart, domain: domainPart, email: emailLower });

    // 5. Look up alias in MongoDB
    await dbConnect();
    
    const alias = await Alias.findOne({ 
      localPart: localPart,
      email: emailLower 
    }).lean().exec();

    if (!alias) {
      console.warn("⚠️ No alias found for:", emailLower);
      return NextResponse.json({ message: "Alias not found" }, { status: 200 });
    }

    console.log("✅ Found alias:", alias.email);

    // 6. Manually fetch integration
    if (!alias.integrationId) {
      console.warn("⚠️ No integration configured for alias:", alias.email);
      return NextResponse.json({ message: "No integration" }, { status: 200 });
    }

    const integration = await Integration.findById(alias.integrationId).lean().exec();
    
    if (!integration || !integration.webhookUrl) {
      console.warn("⚠️ Integration not found or has no webhook:", alias.email);
      return NextResponse.json({ message: "No integration" }, { status: 200 });
    }

    // 7. Fetch full email content from Resend API
    let textBody = "";
    let htmlBody = "";
    
    try {
      console.log("📥 Fetching email content from Resend API...");
      const { data: fullEmail } = await resend.emails.receiving.get(emailData.email_id);
      
      textBody = fullEmail?.text || "";
      htmlBody = fullEmail?.html || "";
      
      console.log("✅ Email content retrieved:", {
        hasText: !!textBody,
        hasHtml: !!htmlBody,
        textLength: textBody.length,
      });
    } catch (fetchError) {
      console.error("❌ Error fetching email content from Resend:", fetchError);
      // Continue without body - better to send notification without body than fail
    }

    // 8. Format message data
    const fromEmail = emailData.from || "Unknown";
    const subject = emailData.subject || "(no subject)";
    const snippet = textBody.slice(0, 500) || htmlBody.slice(0, 500) || "(No body content)";

    // 9. Save email to database
    const emailThread = await EmailThread.create({
      workspaceId: alias.workspaceId,
      aliasId: alias._id,
      originalEmailId: emailData.email_id,
      messageId: emailData.message_id || `<${emailData.email_id}@resend.app>`,
      inReplyTo: null,
      references: [],
      from: fromEmail,
      to: emailLower,
      subject,
      textBody,
      htmlBody,
      direction: "inbound",
      status: "open",
      statusUpdatedAt: new Date(),
      receivedAt: new Date(emailData.created_at || Date.now()),
    });
    console.log("💾 Email saved to database:", emailThread._id);

    // 10. Generate reply link
    const replyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reply/${emailThread._id}`;

    // 10.5. Check if ticket is claimed (for consistency, though new emails won't be claimed)
    let claimStatus = "";
    if (emailThread.assignedTo && emailThread.assignedToEmail) {
      claimStatus = integration.type === "slack"
        ? `👤 *Claimed by:* ${emailThread.assignedToEmail}\n`
        : `👤 **Claimed by:** ${emailThread.assignedToEmail}\n`;
    }

    // 10.6. Add status line
    const statusEmojis = {
      open: '🆕',
      in_progress: '🔄',
      waiting: '⏸️',
      resolved: '✅'
    } as const;
    const statusLabels = {
      open: 'Open',
      in_progress: 'In Progress',
      waiting: 'Waiting',
      resolved: 'Resolved'
    } as const;

    type StatusType = keyof typeof statusEmojis;
    const currentStatus = (emailThread.status || 'open') as StatusType;
    const statusEmoji = statusEmojis[currentStatus] || '🆕';
    const statusLabel = statusLabels[currentStatus] || 'Open';

    const statusLine = integration.type === "slack"
      ? `${statusEmoji} *Status:* ${statusLabel}\n`
      : `${statusEmoji} **Status:** ${statusLabel}\n`;

    // 11. Format Discord/Slack message with reply link and claim status
    const messagePayload = integration.type === "slack"
      ? {
          text: `📧 New email to *${emailLower}*\n${claimStatus}${statusLine}*From:* ${fromEmail}\n*Subject:* ${subject}\n\n${snippet}\n\n🔗 [Click here to reply](${replyUrl})`,
        }
      : {
          content: `📧 **New email to ${emailLower}**
${claimStatus}${statusLine}**From:** ${fromEmail}
**Subject:** ${subject}

${snippet}

🔗 [Click here to reply](${replyUrl})`,
        };

    console.log("📤 Posting to", integration.type, "webhook");

    // 12. Post to Slack/Discord
    const webhookResponse = await fetch(integration.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("❌ Webhook post failed:", {
        status: webhookResponse.status,
        error: errorText,
      });
      return NextResponse.json(
        { error: "Webhook failed" }, 
        { status: 500 }
      );
    }

    console.log("✨ Successfully posted to", integration.type, "with reply link");

    return NextResponse.json({ 
      success: true,
      message: "Email routed to integration"
    });

  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
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

    if (!integration) {
      console.warn("⚠️ Integration not found for alias:", alias.email);
      return NextResponse.json({ message: "No integration" }, { status: 200 });
    }

    // OAuth integrations use slackAccessToken instead of webhookUrl
    const isOAuth = integration.authMethod === "oauth";
    if (!isOAuth && !integration.webhookUrl) {
      console.warn("⚠️ Integration has no webhook URL:", alias.email);
      return NextResponse.json({ message: "No integration" }, { status: 200 });
    }

    // 7. Fetch full email content from Resend API
    let textBody = "";
    let htmlBody = "";
    type ResendAttachmentMeta = { id: string; filename: string; content_type: string; download_url: string; size?: number };
    let attachmentMetas: ResendAttachmentMeta[] = [];

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

    // 7.5. Fetch attachment metadata from Resend receiving attachments API
    try {
      const attachRes = await fetch(
        `https://api.resend.com/emails/receiving/${emailData.email_id}/attachments`,
        { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } }
      );
      if (attachRes.ok) {
        const attachJson = await attachRes.json();
        attachmentMetas = attachJson.data || attachJson || [];
        console.log("📎 Found", attachmentMetas.length, "attachment(s) in email");
      }
    } catch (attachError) {
      console.warn("⚠️ Could not fetch attachment metadata:", attachError);
    }

    // 8. Format message data
    const fromEmail = emailData.from || "Unknown";
    const subject = emailData.subject || "(no subject)";
    const snippet = textBody.slice(0, 500) || htmlBody.slice(0, 500) || "(No body content)";
    const attachmentNote = attachmentMetas.length > 0
      ? `\n📎 _${attachmentMetas.length} attachment(s): ${attachmentMetas.map(a => a.filename).join(", ")}_`
      : "";

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
      attachments: attachmentMetas.map((a) => ({
        id: a.id,
        filename: a.filename,
        content_type: a.content_type,
        download_url: a.download_url,
        size: a.size,
      })),
      direction: "inbound",
      status: "open",
      statusUpdatedAt: new Date(),
      receivedAt: new Date(emailData.created_at || Date.now()),
    });
    console.log("💾 Email saved to database:", emailThread._id);

    // 10. Generate reply link
    const replyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reply/${emailThread._id}`;

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
    const claimField = emailThread.assignedTo && emailThread.assignedToEmail
      ? { type: "mrkdwn", text: `*Claimed by:*\n${emailThread.assignedToEmail}` }
      : null;

      console.log("🔍 emailThread._id:", emailThread._id, typeof emailThread._id);
console.log("🔍 emailThread._id.toString():", emailThread._id.toString());
console.log("🔍 replyUrl:", replyUrl);
console.log("🔍 snippet length:", snippet?.length);
console.log("🔍 attachmentNote:", attachmentNote);

    const messagePayload = integration.type === "slack"
      ? {
        text: `📧 New email to \`${emailLower}\` — From: ${fromEmail} | Subject: ${subject}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `📧 *New email to \`${emailLower}\`*`,
            },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*From:*\n${fromEmail}` },
              { type: "mrkdwn", text: `*Subject:*\n${subject}` },
              { type: "mrkdwn", text: `*Status:*\n${statusEmoji} ${statusLabel}` },
              ...(claimField ? [claimField] : []),
            ],
          },
          ...(snippet
            ? [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `>${snippet.replace(/\n/g, "\n>")}${attachmentNote}`,
                },
              },
            ]
            : attachmentNote ? [{ type: "section", text: { type: "mrkdwn", text: attachmentNote } }] : []),
          { type: "divider" },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Reply to Email →", emoji: true },
                url: replyUrl,
                style: "primary",
              },
              {
                type: "button",
                text: { type: "plain_text", text: "🆕 Open", emoji: true },
                action_id: "set_status_open",
                value: `open__${emailThread._id.toString()}`,
              },
              {
                type: "button",
                text: { type: "plain_text", text: "🔄 In Progress", emoji: true },
                action_id: "set_status_in_progress",
                value: `in_progress__${emailThread._id.toString()}`,
              },
              {
                type: "button",
                text: { type: "plain_text", text: "✅ Resolved", emoji: true },
                action_id: "set_status_resolved",
                value: `resolved__${emailThread._id.toString()}`,
              },
            ],
          },
        ],
      }
      : {
        content: `📧 **New email to ${emailLower}**
${claimStatus}${statusLine}**From:** ${fromEmail}
**Subject:** ${subject}

${snippet}

🔗 [Click here to reply](${replyUrl})`,
      };

    console.log("📤 Posting to", integration.type, "webhook");

    // 12. Post to Slack (OAuth bot token) or Discord/Slack (webhook URL)
    if (
      integration.type === "slack" &&
      integration.authMethod === "oauth" &&
      integration.slackAccessToken &&
      integration.slackChannelId
    ) {
      // ── Slack App (OAuth) — use chat.postMessage ────────────────────────
      // This returns a message `ts` that we store so thread replies are matched.
      console.log("📦 Message payload blocks:", JSON.stringify(messagePayload, null, 2));
      
      const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${integration.slackAccessToken}`,
        },
        body: JSON.stringify({
          channel: integration.slackChannelId,
          ...messagePayload,
        }),
      });

      const slackData = await slackRes.json();
      console.log("🔁 Slack response:", JSON.stringify(slackData, null, 2));

      if (!slackData.ok) {
        console.error("❌ Slack chat.postMessage failed:", slackData.error);
        return NextResponse.json({ error: "Slack post failed" }, { status: 500 });
      }

      // Save the message ts + channel so we can match thread replies back to this email
      emailThread.slackMessageTs = slackData.ts as string;
      emailThread.slackChannelId = slackData.channel as string;
      await emailThread.save();

      console.log("✨ Posted to Slack (OAuth) — ts:", slackData.ts);

      // ── Upload email attachments to the Slack thread ──────────────────
      if (attachmentMetas.length > 0 && integration.slackAccessToken) {
        for (const meta of attachmentMetas) {
          try {
            // 1. Download the file content via the download_url Resend provides.
            // NOTE: Do NOT construct /attachments/{id} — that returns JSON metadata,
            // not binary content. meta.download_url is the actual file download URL.
            const fileRes = await fetch(meta.download_url, {
              headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
            });
            if (!fileRes.ok) { console.warn("⚠️ Could not download attachment:", meta.filename, fileRes.status); continue; }
            const fileBuffer = Buffer.from(await fileRes.arrayBuffer());
            const fileSize = fileBuffer.length;

            // 2. Get an upload URL from Slack
            const urlRes = await fetch("https://slack.com/api/files.getUploadURLExternal", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${integration.slackAccessToken}`,
              },
              body: new URLSearchParams({
                filename: meta.filename,
                length: String(fileSize),
              }),
            });
            const urlData = await urlRes.json();
            if (!urlData.ok) { console.warn("⚠️ Slack getUploadURLExternal failed:", urlData.error); continue; }

            // 3. Upload the file content to the upload URL
            const uploadRes = await fetch(urlData.upload_url, {
              method: "POST",
              headers: { "Content-Type": meta.content_type || "application/octet-stream" },
              body: fileBuffer,
            });
            if (!uploadRes.ok) { console.warn("⚠️ Slack file upload failed:", meta.filename); continue; }

            // 4. Complete the upload and share in the thread
            const completeRes = await fetch("https://slack.com/api/files.completeUploadExternal", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${integration.slackAccessToken}`,
              },
              body: JSON.stringify({
                files: [{ id: urlData.file_id }],
                channel_id: integration.slackChannelId,
                thread_ts: slackData.ts,
              }),
            });
            const completeData = await completeRes.json();
            if (completeData.ok) {
              console.log("📎 Uploaded attachment to Slack thread:", meta.filename);
            } else {
              console.warn("⚠️ Slack completeUploadExternal failed:", completeData.error);
            }
          } catch (uploadErr) {
            console.warn("⚠️ Error uploading attachment:", meta.filename, uploadErr);
          }
        }
      }
    } else {
      // ── Discord or legacy Slack webhook ────────────────────────────────
      const webhookResponse = await fetch(integration.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error("❌ Webhook post failed:", {
          status: webhookResponse.status,
          error: errorText,
        });
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
      }

      console.log("✨ Successfully posted to", integration.type, "with reply link");
    }

    console.log("📊 Logging email thread creation event for analytics...", messagePayload);
    
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
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Alias } from "@/app/api/models/AliasModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ResendAttachmentMeta = {
  id: string;
  filename: string;
  content_type: string;
  download_url: string;
  size?: number;
  content?: string;
};

async function fetchAttachmentBufferFromResend(
  emailId: string,
  meta: ResendAttachmentMeta
): Promise<Buffer | null> {
  try {
    if (meta.content) {
      const buf = Buffer.from(meta.content, "base64");
      if (buf.length > 0) return buf;
    }

    if (meta.download_url) {
      const fileRes = await fetch(meta.download_url, {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      });
      if (fileRes.ok) {
        const buf = Buffer.from(await fileRes.arrayBuffer());
        if (buf.length > 0) return buf;
      }
    }

    if (meta.id) {
      const candidates = [
        `https://api.resend.com/emails/receiving/${emailId}/attachments/${meta.id}`,
        `https://api.resend.com/emails/receiving/${emailId}/attachments/${meta.id}/download`,
      ];

      for (const url of candidates) {
        console.log(`📎 Trying Resend attachment endpoint: ${url}`);

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          console.warn(`⚠️ Resend attachment endpoint returned ${res.status} for ${meta.filename}`);
          console.warn("⚠️ Response body:", errText.slice(0, 300));
          continue;
        }

        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const json = await res.json().catch(() => null) as any;

          if (json?.content) {
            const buf = Buffer.from(json.content, "base64");
            if (buf.length > 0) return buf;
          }

          if (json?.download_url) {
            const dlRes = await fetch(json.download_url, {
              headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
            });
            if (dlRes.ok) {
              const buf = Buffer.from(await dlRes.arrayBuffer());
              if (buf.length > 0) return buf;
            }
          }
        } else {
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length > 0) return buf;
        }
      }
    }
  } catch (err) {
    console.warn("⚠️ Error fetching attachment bytes from Resend:", meta.filename, err);
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    console.log("📧 Received email webhook from Resend:", {
      type: payload.type,
      to: payload.data?.to,
      from: payload.data?.from,
      subject: payload.data?.subject,
    });

    if (payload.type !== "email.received") {
      console.log("⚠️ Ignoring non-email event:", payload.type);
      return NextResponse.json({ message: "Event ignored" });
    }

    const emailData = payload.data;

    const recipientEmail = Array.isArray(emailData.to)
      ? emailData.to[0]
      : emailData.to;

    if (!recipientEmail) {
      console.error("❌ No recipient email found");
      return NextResponse.json({ error: "No recipient" }, { status: 400 });
    }

    const emailLower = recipientEmail.toLowerCase().trim();
    const atIndex = emailLower.indexOf("@");

    if (atIndex === -1) {
      console.error("❌ Invalid email format:", emailLower);
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const localPart = emailLower.slice(0, atIndex);

    console.log("🔍 Looking up alias:", { localPart, email: emailLower });

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

    if (!alias.integrationId) {
      console.warn("⚠️ No integration configured for alias:", alias.email);
      return NextResponse.json({ message: "No integration" }, { status: 200 });
    }

    const integration = await Integration.findById(alias.integrationId).lean().exec();

    if (!integration) {
      console.warn("⚠️ Integration not found for alias:", alias.email);
      return NextResponse.json({ message: "No integration" }, { status: 200 });
    }

    const isOAuth = integration.authMethod === "oauth";
    if (!isOAuth && !integration.webhookUrl) {
      console.warn("⚠️ Integration has no webhook URL:", alias.email);
      return NextResponse.json({ message: "No integration" }, { status: 200 });
    }

    let textBody = "";
    let htmlBody = "";
    let attachmentMetas: ResendAttachmentMeta[] = [];

    try {
      console.log("📥 Fetching email content from Resend API...");
      const { data: fullEmail } = await resend.emails.receiving.get(emailData.email_id);

      textBody = fullEmail?.text || "";
      htmlBody = fullEmail?.html || "";

      const rawAttachments: any[] = (fullEmail as any)?.attachments || [];
      console.log("📎 Raw attachments from fullEmail:", JSON.stringify(rawAttachments.map((a: any) => ({
        filename: a.filename || a.name,
        content_type: a.content_type || a.type || a.mimeType,
        hasContent: !!a.content,
        hasDownloadUrl: !!a.download_url,
        keys: Object.keys(a),
      })), null, 2));

      attachmentMetas = rawAttachments.map((a: any) => ({
        id: a.id || `att_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        filename: a.filename || a.name || "attachment",
        content_type: a.content_type || a.type || a.mimeType || "application/octet-stream",
        download_url: a.download_url || "",
        size: a.size,
        content: a.content,
      }));

      console.log("✅ Email content retrieved:", {
        hasText: !!textBody,
        hasHtml: !!htmlBody,
        textLength: textBody.length,
        attachmentCount: attachmentMetas.length,
      });
    } catch (fetchError) {
      console.error("❌ Error fetching email content from Resend:", fetchError);
    }

    if (attachmentMetas.length === 0) {
      try {
        const attachRes = await fetch(
          `https://api.resend.com/emails/receiving/${emailData.email_id}/attachments`,
          { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } }
        );
        if (attachRes.ok) {
          const attachJson = await attachRes.json();
          const raw = attachJson.data || attachJson || [];
          console.log("📎 Fallback attachment API response:", JSON.stringify(raw, null, 2));
          attachmentMetas = raw;
        }
      } catch (attachError) {
        console.warn("⚠️ Could not fetch attachment metadata:", attachError);
      }
    }

    const fromRaw = (emailData.from || "Unknown") as string;
    const fromNameMatch = fromRaw.match(/^(.+?)\s*</);
    const fromName = fromNameMatch ? fromNameMatch[1].trim() : "";
    const fromEmail = fromRaw;
    const subject = emailData.subject || "(no subject)";
    const snippet = textBody.slice(0, 500) || htmlBody.slice(0, 500) || "(No body content)";
    const attachmentNote = attachmentMetas.length > 0
      ? `\n📎 _${attachmentMetas.length} attachment(s): ${attachmentMetas.map(a => a.filename).join(", ")}_`
      : "";

    const emailThread = await EmailThread.create({
      workspaceId: alias.workspaceId,
      aliasId: alias._id,
      originalEmailId: emailData.email_id,
      messageId: emailData.message_id || `<${emailData.email_id}@resend.app>`,
      inReplyTo: null,
      references: [],
      from: fromEmail,
      fromName,
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

    const replyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reply/${emailThread._id}`;

    let claimStatus = "";
    if (emailThread.assignedTo && emailThread.assignedToEmail) {
      claimStatus = integration.type === "slack"
        ? `👤 *Claimed by:* ${emailThread.assignedToEmail}\n`
        : `👤 **Claimed by:** ${emailThread.assignedToEmail}\n`;
    }

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

    const claimField = emailThread.assignedTo && emailThread.assignedToEmail
      ? { type: "mrkdwn", text: `*Claimed by:*\n${emailThread.assignedToEmail}` }
      : null;

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
              {
                type: "button",
                text: { type: "plain_text", text: "💬 Canned Responses", emoji: true },
                action_id: "canned_response_button",
                value: emailThread._id.toString(),
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

    if (
      integration.type === "slack" &&
      integration.authMethod === "oauth" &&
      integration.slackAccessToken &&
      integration.slackChannelId
    ) {
      console.log("📦 Message payload blocks:", JSON.stringify(messagePayload, null, 2));

      // ── Upload attachments FIRST, then post message with images inline ──
      const uploadedFiles: { filename: string; file_id: string; content_type: string }[] = [];

      if (attachmentMetas.length > 0) {
        for (const meta of attachmentMetas) {
          try {
            const fileBuffer = await fetchAttachmentBufferFromResend(emailData.email_id, meta);
            if (!fileBuffer || fileBuffer.length === 0) {
              console.warn("⚠️ No bytes for attachment:", meta.filename);
              continue;
            }

            const fileSize = fileBuffer.length;

            // Step 1: Get upload URL
            const urlRes = await fetch("https://slack.com/api/files.getUploadURLExternal", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                Authorization: `Bearer ${integration.slackAccessToken}`,
              },
              body: new URLSearchParams({
                filename: meta.filename,
                length: String(fileSize),
              }),
            });
            const urlData = await urlRes.json();
            if (!urlData.ok) { console.warn("⚠️ Slack getUploadURLExternal failed:", urlData.error); continue; }

            // Step 2: Upload bytes
            const uploadRes = await fetch(urlData.upload_url, {
              method: "POST",
              headers: { "Content-Type": meta.content_type || "application/octet-stream" },
              body: new Uint8Array(fileBuffer),
            });
            if (!uploadRes.ok) { console.warn("⚠️ Slack file upload failed:", meta.filename); continue; }

            // Step 3: Complete upload without channel (gets file_id only)
            const completeRes = await fetch("https://slack.com/api/files.completeUploadExternal", {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${integration.slackAccessToken}`,
              },
              body: JSON.stringify({
                files: [{ id: urlData.file_id }],
              }),
            });
            const completeData = await completeRes.json();
            if (!completeData.ok) { console.warn("⚠️ Slack completeUpload failed:", completeData.error); continue; }

            // Store file_id for use in image block
            uploadedFiles.push({
              filename: meta.filename,
              file_id: urlData.file_id,
              content_type: meta.content_type,
            });
            console.log(`📎 ✅ Uploaded to Slack, file_id: ${urlData.file_id} for: ${meta.filename}`);

          } catch (uploadErr) {
            console.warn("⚠️ Error uploading attachment:", meta.filename, uploadErr);
          }
        }
      }

      // ── Build image blocks using slack_file + file_id ──
      const imageBlocks = uploadedFiles
        .filter(f => f.content_type.startsWith("image/"))
        .map(f => ({
          type: "image",
          slack_file: {
            id: f.file_id,
          },
          alt_text: f.filename,
        }));

      const nonImageFiles = uploadedFiles.filter(f => !f.content_type.startsWith("image/"));
      const nonImageNote = nonImageFiles.length > 0
        ? `\n📎 _${nonImageFiles.map(f => f.filename).join(", ")}_`
        : "";

      const finalPayload = {
        ...messagePayload,
        blocks: [
          ...(messagePayload as any).blocks,
          ...imageBlocks,
          ...(nonImageNote ? [{ type: "section", text: { type: "mrkdwn", text: nonImageNote } }] : []),
        ],
      };

      // ── Post the main message WITH images inline ──
      const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${integration.slackAccessToken}`,
        },
        body: JSON.stringify({
          channel: integration.slackChannelId,
          ...finalPayload,
        }),
      });

      const slackData = await slackRes.json();
      console.log("🔁 Slack response:", JSON.stringify(slackData, null, 2));

      if (!slackData.ok) {
        console.error("❌ Slack chat.postMessage failed:", slackData.error);
        return NextResponse.json({ error: "Slack post failed" }, { status: 500 });
      }

      emailThread.slackMessageTs = slackData.ts as string;
      emailThread.slackChannelId = slackData.channel as string;
      await emailThread.save();

      console.log("✨ Posted to Slack (OAuth) — ts:", slackData.ts);

    } else {
      // ── Discord or legacy Slack webhook ──
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
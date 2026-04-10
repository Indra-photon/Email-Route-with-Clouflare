import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Alias } from "@/app/api/models/AliasModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { Domain } from "@/app/api/models/DomainModel";
import { checkTicketLimit } from "@/lib/checkPlanLimits";
import { getSubscriptionGuard } from "@/lib/checkSubscriptionStatus";

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

    // ── Log full emailData structure to find available fields ────────────────
    console.log("📨 emailData keys:", JSON.stringify({
      keys: Object.keys(emailData || {}),
      email_id: emailData?.email_id,
      message_id: emailData?.message_id,
      in_reply_to: emailData?.in_reply_to,
      references: emailData?.references,
      headersType: typeof emailData?.headers,
      headersIsArray: Array.isArray(emailData?.headers),
      headersPreview: emailData?.headers ? JSON.stringify(emailData.headers).slice(0, 300) : null,
    }));

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
      email: emailLower,
      status: "active",
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

    // ── Subscription guard: block inbound if plan expired or ticket limit reached ──
    const { isExpired } = await getSubscriptionGuard(alias.workspaceId);
    const limitError = await checkTicketLimit(alias.workspaceId);

    if (isExpired || limitError) {
      const reason = isExpired ? "plan expired" : limitError;
      const appUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://yourapp.com";
      const visitorEmail = emailData.from as string;
      const visitorSubject = emailData.subject as string;

      console.warn(`⛔ Inbound email blocked for workspace ${alias.workspaceId}: ${reason}`);

      // 1️⃣ Mark ALL workspace aliases as inactive so future emails silently miss
      await Alias.updateMany(
        { workspaceId: alias.workspaceId },
        { $set: { status: "inactive" } }
      );
      console.log("🔕 All aliases set to inactive for workspace:", alias.workspaceId.toString());

      // 2️⃣ Notify the workspace owner on Slack
      try {
        const notifyIntegration = await Integration.findOne({
          workspaceId: alias.workspaceId,
          type: "slack",
          authMethod: "oauth",
        }).lean();

        if (notifyIntegration?.slackAccessToken && notifyIntegration?.slackChannelId) {
          const upgradeUrl = `${appUrl}/dashboard/billing`;
          await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${notifyIntegration.slackAccessToken}`,
            },
            body: JSON.stringify({
              channel: notifyIntegration.slackChannelId,
              text: `⚠️ Missed email — inbound limit reached`,
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: [
                      `⚠️ *Missed inbound email — limit reached!*`,
                      `Someone tried to email \`${emailLower}\` but it was *not delivered* because your monthly inbound limit has been reached. All your aliases are now *paused*.`,
                      ``,
                      `*From:* ${visitorEmail}`,
                      `*Subject:* ${visitorSubject}`,
                      ``,
                      `Upgrade your plan to re-activate your aliases and receive emails again.`,
                    ].join("\n"),
                  },
                },
                { type: "divider" },
                {
                  type: "actions",
                  elements: [
                    {
                      type: "button",
                      text: { type: "plain_text", text: "🚀 Upgrade Plan", emoji: true },
                      url: upgradeUrl,
                      style: "primary",
                    },
                    {
                      type: "button",
                      text: { type: "plain_text", text: "💳 View Pricing", emoji: true },
                      url: `${appUrl}/pricing`,
                    },
                  ],
                },
              ],
            }),
          });
          console.log("🔔 Slack limit-exceeded alert sent to workspace:", alias.workspaceId.toString());
        }
      } catch (slackErr) {
        console.warn("⚠️ Could not send Slack limit alert:", slackErr);
      }

      // Return 200 so Resend doesn’t retry the webhook
      return NextResponse.json({ message: "Limit reached" }, { status: 200 });
    }
    // ── End subscription guard ──

    let textBody = "";
    let htmlBody = "";
    let attachmentMetas: ResendAttachmentMeta[] = [];
    let inReplyTo: string | null = null;
    let references: string[] = [];

    try {
      console.log("📥 Fetching email content from Resend API...");
      const emailRes = await fetch(
        `https://api.resend.com/emails/receiving/${emailData.email_id}`,
        { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } }
      );

      if (!emailRes.ok) {
        console.warn("⚠️ Resend receiving API returned", emailRes.status);
      } else {
        const fullEmail = await emailRes.json();
        console.log("📨 Full email response:", JSON.stringify({
          keys: Object.keys(fullEmail || {}),
          headersType: typeof fullEmail?.headers,
          headersIsArray: Array.isArray(fullEmail?.headers),
          in_reply_to: fullEmail?.in_reply_to,
          references: fullEmail?.references,
          headers_in_reply_to: (fullEmail?.headers as any)?.["in-reply-to"] || null,
          headers_references: (fullEmail?.headers as any)?.["references"] || null,
          headersPreview: fullEmail?.headers ? JSON.stringify(fullEmail.headers).slice(0, 500) : null,
        }));

        textBody = fullEmail?.text || "";
        htmlBody = fullEmail?.html || "";

        // ── Extract threading headers ──────────────────────────────────────
        // fullEmail.headers is an object {"in-reply-to":"...", "references":"...", ...}
        const getHeader = (name: string): string | null => {
          const h = fullEmail?.headers;
          if (!h) return null;
          if (Array.isArray(h)) {
            const found = (h as any[]).find((x: any) => x.name?.toLowerCase() === name.toLowerCase());
            return found?.value?.trim() || null;
          }
          if (typeof h === "object") {
            for (const key of Object.keys(h)) {
              if (key.toLowerCase() === name.toLowerCase()) return (h as any)[key]?.trim() || null;
            }
          }
          return null;
        };

        // emailData.headers from the webhook payload may also be an object
        const getEmailDataHeader = (name: string): string | null => {
          const h = emailData?.headers;
          if (h && typeof h === "object" && !Array.isArray(h)) {
            for (const key of Object.keys(h)) {
              if (key.toLowerCase() === name.toLowerCase()) return (h as any)[key] || null;
            }
          }
          if (Array.isArray(h)) {
            const found = (h as any[]).find((x: any) => x.name?.toLowerCase() === name.toLowerCase());
            return found?.value?.trim() || null;
          }
          return null;
        };

        inReplyTo =
          fullEmail?.in_reply_to ||
          getHeader("in-reply-to") ||
          emailData?.in_reply_to ||
          getEmailDataHeader("in-reply-to") ||
          null;

        references = (() => {
          const raw =
            fullEmail?.references ||
            getHeader("references") ||
            emailData?.references ||
            getEmailDataHeader("references") ||
            "";
          if (Array.isArray(raw)) return raw as string[];
          if (typeof raw === "string" && raw.trim()) {
            // Resend returns references as a JSON-encoded array string: '["<id1>","<id2>"]'
            if (raw.trim().startsWith("[")) {
              try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed as string[];
              } catch {}
            }
            // Fallback: standard RFC 2822 space-separated format
            return raw.split(/\s+/).filter(Boolean);
          }
          return [];
        })();

        if (inReplyTo) console.log("🔗 In-Reply-To detected:", inReplyTo);

        const rawAttachments: any[] = fullEmail?.attachments || [];
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
      }
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

    // ── Look up parent thread for reply threading ────────────────────────
    let parentThread: any = null;
    if (inReplyTo) {
      const refsToCheck = [inReplyTo, ...references].filter(Boolean);
      console.log("🔗 In-Reply-To:", inReplyTo, "| references:", references);

      parentThread = await EmailThread.findOne({
        messageId: { $in: refsToCheck },
        slackMessageTs: { $exists: true, $ne: null },
        // no direction filter — match both inbound and outbound
      }).sort({ createdAt: 1 }).lean();

      if (parentThread) {
        console.log("🧵 Found parent thread:", parentThread._id, "slackTs:", parentThread.slackMessageTs);
      } else {
        console.log("⚠️ No parent thread found — will post as new message");
      }
    }

    const emailThread = await EmailThread.create({
      workspaceId: alias.workspaceId,
      aliasId: alias._id,
      originalEmailId: emailData.email_id,
      messageId: emailData.message_id || `<${emailData.email_id}@resend.app>`,
      inReplyTo: inReplyTo,
      references: references,
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

    // ── Increment inbound ticket counter on the workspace's subscription ──
    await Subscription.updateOne(
      { workspaceId: alias.workspaceId },
      { $inc: { ticketCountInbound: 1 } }
    );


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
      ? (() => {
          const isReply = !!parentThread?.slackMessageTs;
          const headerText = isReply
            ? `↩️ *Reply from ${fromEmail}*`
            : `📧 *New email to \`${emailLower}\`*`;
          const fallbackText = isReply
            ? `↩️ Reply from ${fromEmail} — ${subject}`
            : `📧 New email to \`${emailLower}\` — From: ${fromEmail} | Subject: ${subject}`;

          const blocks: any[] = [
            {
              type: "section",
              text: { type: "mrkdwn", text: headerText },
            },
          ];

          if (!isReply) {
            blocks.push({
              type: "section",
              fields: [
                { type: "mrkdwn", text: `*From:*\n${fromEmail}` },
                { type: "mrkdwn", text: `*Subject:*\n${subject}` },
                { type: "mrkdwn", text: `*Status:*\n${statusEmoji} ${statusLabel}` },
                ...(claimField ? [claimField] : []),
              ],
            });
          }

          if (snippet) {
            blocks.push({
              type: "section",
              text: {
                type: "mrkdwn",
                text: `>${snippet.replace(/\n/g, "\n>")}${attachmentNote}`,
              },
            });
          } else if (attachmentNote) {
            blocks.push({ type: "section", text: { type: "mrkdwn", text: attachmentNote } });
          }

          blocks.push({ type: "divider" });
          blocks.push({
            type: "actions",
            elements: [
              {
                type: "static_select",
                action_id: "set_status_dropdown",
                placeholder: { type: "plain_text", text: "🔖 Set Status", emoji: true },
                initial_option: {
                  text: { type: "plain_text", text: `${statusEmoji} ${statusLabel}`, emoji: true },
                  value: `${currentStatus}__${emailThread._id.toString()}`,
                },
                options: [
                  { text: { type: "plain_text", text: "🆕 Open", emoji: true }, value: `open__${emailThread._id.toString()}` },
                  { text: { type: "plain_text", text: "🔄 In Progress", emoji: true }, value: `in_progress__${emailThread._id.toString()}` },
                  { text: { type: "plain_text", text: "✅ Resolved", emoji: true }, value: `resolved__${emailThread._id.toString()}` },
                ],
              },
              {
                type: "button",
                text: { type: "plain_text", text: "💬 Canned Responses", emoji: true },
                action_id: "canned_response_button",
                value: emailThread._id.toString(),
              },
              {
                type: "button",
                text: { type: "plain_text", text: "📋 Templates", emoji: true },
                action_id: "template_button",
                value: emailThread._id.toString(),
              },
              {
                type: "button",
                text: { type: "plain_text", text: "✉️ Reply from SyncSupport", emoji: true },
                action_id: "reply_from_syncsupport",
                value: emailThread._id.toString(),
                style: "primary",
              },
            ],
          });

          return { text: fallbackText, blocks, ...(isReply ? { thread_ts: parentThread.slackMessageTs } : {}) };
        })()
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

      // ── Fetch domain customization settings ──
      let customBotName: string | null = null;
      let customBotAvatar: string | null = null;
      
      try {
        const domain = await Domain.findById(alias.domainId).lean().exec();
        if (domain) {
          customBotName = domain.botName || null;
          customBotAvatar = domain.botAvatar || null;
          console.log("🎨 Domain customization:", { 
            domain: domain.domain, 
            botName: customBotName, 
            botAvatar: customBotAvatar 
          });
        }
      } catch (err) {
        console.warn("⚠️ Failed to fetch domain customization, using defaults:", err);
      }

      // ── Post main message first ──
      const postMessageBody: any = {
        channel: integration.slackChannelId,
        ...messagePayload,
      };
      
      // Add custom bot name and avatar if set
      if (customBotName) {
        postMessageBody.username = customBotName;
      }
      if (customBotAvatar) {
        postMessageBody.icon_url = customBotAvatar;
      }

      const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${integration.slackAccessToken}`,
        },
        body: JSON.stringify(postMessageBody),
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

      // ── Upload attachments as thread replies ──
      if (attachmentMetas.length > 0 && integration.slackAccessToken) {
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

            // Step 3: Complete upload and share in thread
            const completeRes = await fetch("https://slack.com/api/files.completeUploadExternal", {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${integration.slackAccessToken}`,
              },
              body: JSON.stringify({
                files: [{ id: urlData.file_id }],
                channel_id: integration.slackChannelId,
                thread_ts: slackData.ts, // attach to the email message thread
              }),
            });
            const completeData = await completeRes.json();
            if (completeData.ok) {
              console.log("📎 ✅ Uploaded attachment to Slack thread:", meta.filename);
            } else {
              console.warn("⚠️ Slack completeUploadExternal failed:", completeData.error);
            }
          } catch (uploadErr) {
            console.warn("⚠️ Error uploading attachment:", meta.filename, uploadErr);
          }
        }
      }

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
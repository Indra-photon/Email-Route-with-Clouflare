import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { Alias } from "@/app/api/models/AliasModel";
import { Domain } from "@/app/api/models/DomainModel";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";
import { Resend } from "resend";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import { getSubscriptionGuard } from "@/lib/checkSubscriptionStatus";
import { checkTicketLimit } from "@/lib/checkPlanLimits";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Handle Email Thread Reply ────────────────────────────────────────────────
async function handleEmailThreadReply(
  emailThread: any,
  replyText: string,
  slackFiles: Array<Record<string, unknown>>,
  channelId: string,
  eventId?: string,
  replyTs?: string,
  slackUserId?: string
) {
  try {
    // ── Subscription guard — check BEFORE any DB write or Resend call ────────
    const { isExpired } = await getSubscriptionGuard(emailThread.workspaceId);
    const limitError = await checkTicketLimit(emailThread.workspaceId);

    if (isExpired || limitError) {
      // Fetch botToken to send an ephemeral Slack message
      const blockingIntegration = await Integration.findOne({
        slackChannelId: channelId,
        authMethod: "oauth",
      }).lean();
      const botToken = blockingIntegration?.slackAccessToken;

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://yourapp.com";
      const reason = isExpired
        ? `⚠️ Your reply was *not sent* — your plan has expired. Renew now: ${appUrl}/pricing`
        : `⚠️ Your reply was *not sent* — ${limitError}. Upgrade your plan: ${appUrl}/pricing`;

      if (botToken && slackUserId) {
        await fetch("https://slack.com/api/chat.postEphemeral", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${botToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: channelId,
            thread_ts: replyTs,
            user: slackUserId,
            text: reason,
          }),
        });
      }

      // Always return 200 to Slack — non-200 causes Slack to retry 3 more times
      console.warn(`⛔ Reply blocked for workspace ${emailThread.workspaceId}: ${isExpired ? "plan expired" : limitError}`);
      return NextResponse.json({ ok: true });
    }
    // ── End subscription guard ───────────────────────────────────────────────
    const references = [emailThread.messageId, ...(emailThread.references || [])].filter(Boolean);
    const referencesHeader = references.join(" ");

    const alias = await Alias.findById(emailThread.aliasId).lean();
    const domain = alias ? await Domain.findOne({ _id: alias.domainId }).lean() : null;

    const fallbackEmail = process.env.REPLY_FROM_EMAIL || "onboarding@resend.dev";
    const fallbackName = process.env.REPLY_FROM_NAME || "Email Router";

    let fromAddress: string;
    if (domain?.verifiedForSending) {
      fromAddress = emailThread.to;
    } else {
      fromAddress = fallbackName ? `${fallbackName} <${fallbackEmail}>` : fallbackEmail;
    }

    // ── Download Slack files ───────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attachments: any[] = [];

    if (slackFiles.length > 0) {
      const integration = await Integration.findOne({
        slackChannelId: channelId,
        authMethod: "oauth",
      }).lean();
      const botToken = integration?.slackAccessToken;

      if (botToken) {
        for (const file of slackFiles) {
          const fileId = file.id as string | undefined;
          const filename = (file.name || file.title || "attachment") as string;

          try {
            let downloadUrl = (file.url_private_download || file.url_private) as string | undefined;

            if (fileId) {
              const infoRes = await fetch(`https://slack.com/api/files.info?file=${fileId}`, {
                headers: { Authorization: `Bearer ${botToken}` },
              });
              const infoData = await infoRes.json();
              if (infoData.ok && infoData.file?.url_private) {
                downloadUrl = infoData.file.url_private;
              }
            }

            if (!downloadUrl) {
              console.warn("⚠️ No download URL for file:", filename);
              continue;
            }

            const fileRes = await fetch(downloadUrl, {
              headers: { Authorization: `Bearer ${botToken}` },
            });

            if (!fileRes.ok) {
              console.warn(`⚠️ Slack file download failed (${fileRes.status}): ${filename}`);
              continue;
            }

            const arrayBuf = await fileRes.arrayBuffer();
            if (arrayBuf.byteLength === 0) {
              console.warn(`⚠️ Empty file skipped: ${filename}`);
              continue;
            }

            attachments.push({ filename, content: Buffer.from(arrayBuf).toString("base64") });
            console.log(`📎 Attachment ready: ${filename} (${arrayBuf.byteLength} bytes)`);
          } catch (e) {
            console.warn("⚠️ Could not process Slack file:", filename, e);
          }
        }
      } else {
        console.warn("⚠️ No OAuth bot token found for channel:", channelId);
      }
    }

    // ── Save outbound reply to DB (before sending — acts as a dedup lock) ────
    const replySubjectFinal = emailThread.subject.startsWith("Re:")
      ? emailThread.subject
      : `Re: ${emailThread.subject}`;

    let outboundThread: any;
    try {
      outboundThread = await EmailThread.create({
        workspaceId: emailThread.workspaceId,
        aliasId: emailThread.aliasId,
        originalEmailId: eventId || crypto.randomUUID(), // placeholder; updated after send
        messageId: `<reply-${Date.now()}@email-router>`,
        inReplyTo: emailThread.messageId,
        references: [emailThread.messageId, ...(emailThread.references || [])].filter(Boolean),
        from: fromAddress,
        fromName: "",
        to: emailThread.from,
        subject: replySubjectFinal,
        textBody: replyText || "(see attachment)",
        htmlBody: "",
        attachments: attachments.map((a) => ({
          id: crypto.randomUUID(),
          filename: a.filename,
          content_type: "application/octet-stream",
        })),
        direction: "outbound",
        status: "open",
        statusUpdatedAt: new Date(),
        slackMessageTs: replyTs || null,
        slackChannelId: channelId,
        slackEventId: eventId || null,
        receivedAt: new Date(),
        repliedAt: null,
      });
      console.log("💾 ✅ Outbound email thread saved:", outboundThread._id);
    } catch (createErr: any) {
      if (createErr?.code === 11000) {
        // Duplicate key — Slack retry, email already being handled
        console.log("⚡ Duplicate outbound record blocked (Slack retry) for event:", eventId);
        return NextResponse.json({ ok: true });
      }
      console.error("❌ Failed to save outbound EmailThread:", createErr);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // ── Send via Resend ────────────────────────────────────────────────────
    const emailPayload = {
      from: fromAddress,
      to: emailThread.from,
      subject: replySubjectFinal,
      text: replyText || "(see attachment)",
      headers: {
        "In-Reply-To": emailThread.messageId,
        ...(referencesHeader ? { References: referencesHeader } : {}),
      },
      ...(attachments.length > 0 ? { attachments } : {}),
    };

    const { data: sentData, error } = await resend.emails.send(emailPayload);
    let sentEmailId = sentData?.id;

    if (error) {
      console.warn("⚠️ Resend rejected with attachments, retrying text-only:", error);
      const fallbackText = `${replyText}\n\n[Note: ${attachments.length} attachment(s) could not be forwarded]`;
      const { data: fallbackData, error: fallbackError } = await resend.emails.send({
        ...emailPayload,
        text: fallbackText,
        attachments: [],
      });
      if (fallbackError) {
        console.error("❌ Resend fallback also failed:", fallbackError);
        return NextResponse.json({ ok: false }, { status: 500 });
      }
      sentEmailId = fallbackData?.id;
    }

    // Update outbound record with the real Resend email ID
    if (sentEmailId) {
      outboundThread.originalEmailId = sentEmailId;
      await outboundThread.save();
    }

    emailThread.slackEventId = eventId ?? null;
    emailThread.status = "open";
    emailThread.statusUpdatedAt = new Date();
    emailThread.repliedAt = new Date();
    await emailThread.save();

    console.log(`✅ Slack→Email reply sent for thread ${emailThread._id}`);
  } catch (err) {
    console.error("❌ Error processing Slack reply event:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// ── Handle Live Chat Reply ───────────────────────────────────────────────────
async function handleLiveChatReply(
  conversation: any,
  replyText: string,
  slackFiles: Array<Record<string, unknown>>,
  channelId: string,
  eventId?: string,
  replyTs?: string
) {
  try {
    // ── Download Slack files and re-upload to Cloudinary ──────────────────
    let mediaUrl = "";
    let mediaType: "text" | "image" | "pdf" = "text";
    let mediaFilename = "";

    console.log(`🔄 handleLiveChatReply — text: "${replyText.slice(0, 50)}", files: ${slackFiles.length}, eventId: ${eventId}`);
    if (slackFiles.length > 0) {
      console.log("📂 Slack files:", JSON.stringify(slackFiles.map(f => ({
        id: f.id, name: f.name, mimetype: f.mimetype, filetype: f.filetype,
        has_url_private: !!f.url_private, has_url_private_download: !!f.url_private_download, mode: f.mode,
      }))));
    }

    if (slackFiles.length > 0) {
      const integration = await Integration.findOne({
        slackChannelId: channelId,
        authMethod: "oauth",
      }).lean();
      const botToken = integration?.slackAccessToken;

      if (botToken) {
        // Process the first file (chat messages show one attachment at a time)
        const file = slackFiles[0];
        const fileId = file.id as string | undefined;
        const filename = (file.name || file.title || "attachment") as string;
        const mimetype = (file.mimetype || "") as string;

        try {
          let downloadUrl = (file.url_private_download || file.url_private) as string | undefined;

          if (fileId) {
            const infoRes = await fetch(`https://slack.com/api/files.info?file=${fileId}`, {
              headers: { Authorization: `Bearer ${botToken}` },
            });
            const infoData = await infoRes.json();
            if (infoData.ok && infoData.file?.url_private) {
              downloadUrl = infoData.file.url_private;
            }
          }

          if (downloadUrl) {
            const fileRes = await fetch(downloadUrl, {
              headers: { Authorization: `Bearer ${botToken}` },
            });

            if (fileRes.ok) {
              const contentType = fileRes.headers.get("content-type") || "";
              console.log(`📡 File download: ${fileRes.status}, content-type: ${contentType}, size: ${fileRes.headers.get("content-length")}`);

              if (contentType.includes("text/html")) {
                console.error("❌ Slack returned HTML — auth failed");
              } else {
                const arrayBuf = await fileRes.arrayBuffer();
                if (arrayBuf.byteLength > 0) {
                  const buffer = Buffer.from(arrayBuf);
                  const isPdf = mimetype === "application/pdf" || filename.toLowerCase().endsWith(".pdf");
                  const isImage = mimetype.startsWith("image/") || /\.(jpe?g|png|gif|webp)$/i.test(filename);

                  if (isPdf || isImage) {
                    // Re-upload to R2 so the URL is permanent and public
                    const contentTypeHeader = isPdf ? "application/pdf" : (mimetype || "image/jpeg");
                    mediaUrl = await uploadToR2(buffer, filename, contentTypeHeader);
                    mediaType = isPdf ? "pdf" : "image";
                    mediaFilename = filename;
                    console.log(`📎 ✅ Slack→R2 done: ${filename} → ${mediaUrl}`);
                  }
                }
              }
            } else {
              console.error(`❌ Slack file download failed: status ${fileRes.status}`);
            }
            }
          } catch (e) {
            console.warn("⚠️ Could not process Slack file for live chat:", e);
          }
        }
      }

    // ── Save agent message to DB ──────────────────────────────────────────
    // Skip if both body and mediaUrl are empty (e.g. upload failed)
    const bodyText = mediaUrl ? (replyText.trim() || mediaFilename) : replyText.trim();
    if (!bodyText && !mediaUrl) {
      console.warn(`⚠️ Skipping empty message — replyText: "${replyText}", mediaUrl: "${mediaUrl}", files: ${slackFiles.length}`);
      return NextResponse.json({ ok: true });
    }

    let chatMessage: any;
    try {
      chatMessage = await ChatMessage.create({
        conversationId: conversation._id,
        widgetId: conversation.widgetId,
        sender: "agent",
        body: bodyText,
        type: mediaType,
        mediaUrl,
        slackEventId: eventId || null,
        slackMessageTs: replyTs || null,
      });
    } catch (createErr: any) {
      if (createErr?.code === 11000) {
        console.log("⚡ Duplicate live chat message blocked (Slack retry) for event:", eventId);
        return NextResponse.json({ ok: true });
      }
      console.error("❌ Failed to save ChatMessage:", createErr);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Push to Socket.IO server so visitor receives it in real-time
    try {
      const pushSecret = process.env.RENDER_PUSH_SECRET;
      const renderUrl = process.env.NEXT_PUBLIC_RENDER_CHAT_SERVER_URL;
      
      if (renderUrl && pushSecret) {
        await fetch(`${renderUrl}/push`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-push-secret": pushSecret,
          },
          body: JSON.stringify({
            conversationId: conversation._id.toString(),
            message: {
              id: chatMessage._id.toString(),
              sender: "agent",
              body: chatMessage.body,
              type: chatMessage.type,
              mediaUrl: chatMessage.mediaUrl,
              createdAt: chatMessage.createdAt,
            },
          }),
        });
      }
    } catch (pushErr) {
      console.error("❌ Failed to push Slack reply to chat server:", pushErr);
    }

    console.log(`✅ Slack→LiveChat reply sent for conversation ${conversation._id}`);
  } catch (err) {
    console.error("❌ Error processing Slack live chat reply:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

async function verifySlackSignature(request: Request, rawBody: string): Promise<boolean> {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) return false;

  const timestamp = request.headers.get("x-slack-request-timestamp");
  const signature = request.headers.get("x-slack-signature");
  if (!timestamp || !signature) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) return false;

  const baseString = `v0:${timestamp}:${rawBody}`;
  const computed = "v0=" + crypto.createHmac("sha256", signingSecret).update(baseString).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  const valid = await verifySlackSignature(request, rawBody);
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.type === "url_verification") {
    return NextResponse.json({ challenge: payload.challenge });
  }

  if (payload.type !== "event_callback") return NextResponse.json({ ok: true });

  const event = payload.event as Record<string, unknown>;

  // ── Handle Slack message deletions ────────────────────────────────────────
  if (event.type === "message" && event.subtype === "message_deleted") {
    const deletedTs = event.deleted_ts as string | undefined;
    const channelId = event.channel as string | undefined;

    if (deletedTs && channelId) {
      await dbConnect();
      const msgToDelete = await ChatMessage.findOne({ slackMessageTs: deletedTs }).lean();
      if (msgToDelete) {
        if (msgToDelete.mediaUrl) {
          try {
            await deleteFromR2(msgToDelete.mediaUrl);
            console.log("☁️ Deleted R2 asset for Slack message:", msgToDelete.mediaUrl);
          } catch (e) {
            console.warn("⚠️ R2 delete failed for deleted Slack message:", e);
          }
        }
        await ChatMessage.deleteOne({ _id: msgToDelete._id });
        console.log("🗑️ Slack message deleted from DB:", msgToDelete._id);
      }
    }
    return NextResponse.json({ ok: true });
  }

  if (
    event.type !== "message" ||
    event.subtype === "bot_message" ||
    event.subtype === "thread_broadcast" ||
    event.subtype === "message_changed" ||
    event.subtype === "message_deleted" ||
    event.bot_id !== undefined ||
    !event.thread_ts ||
    event.thread_ts === event.ts
  ) {
    return NextResponse.json({ ok: true });
  }

  const threadTs = event.thread_ts as string;
  const replyTs = event.ts as string;
  const channelId = event.channel as string;
  const replyText = ((event.text as string) || "").trim();

  const slackFiles: Array<Record<string, unknown>> = [
    ...((event.files as Array<Record<string, unknown>> | undefined) || []),
    ...(event.file ? [event.file as Record<string, unknown>] : []),
  ];

  if (!replyText && slackFiles.length === 0) return NextResponse.json({ ok: true });

  await dbConnect();

  // ── Deduplication ─────────────────────────────────────────────────────────
  // Slack retries the event if we don't respond within 3 seconds, which causes
  // duplicate messages. Check both EmailThread and ChatMessage for the event_id.
  const eventId = payload.event_id as string | undefined;
  if (eventId) {
    const alreadyInEmail = await EmailThread.exists({ slackEventId: eventId });
    if (alreadyInEmail) {
      console.log("⚡ Duplicate Slack event (email) — skipping:", eventId);
      return NextResponse.json({ ok: true });
    }
    const alreadyInChat = await ChatMessage.exists({ slackEventId: eventId });
    if (alreadyInChat) {
      console.log("⚡ Duplicate Slack event (chat) — skipping:", eventId);
      return NextResponse.json({ ok: true });
    }
  }

  // Try to match an email thread first
  const emailThread = await EmailThread.findOne({
    slackMessageTs: threadTs,
    slackChannelId: channelId,
    direction: "inbound",
  });

  // If email thread found, handle email reply (existing logic)
  if (emailThread) {
    return await handleEmailThreadReply(emailThread, replyText, slackFiles, channelId, eventId, replyTs);
  }

  // Try to match a live chat conversation
  const chatConversation = await ChatConversation.findOne({
    slackThreadTs: threadTs,
    slackChannelId: channelId,
  });

  if (chatConversation) {
    return await handleLiveChatReply(chatConversation, replyText, slackFiles, channelId, eventId, replyTs);
  }

  // No match found - ignore
  return NextResponse.json({ ok: true });
}

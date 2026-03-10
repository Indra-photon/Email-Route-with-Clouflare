import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { Alias } from "@/app/api/models/AliasModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Slack signature verification ────────────────────────────────────────────
// https://api.slack.com/authentication/verifying-requests-from-slack
async function verifySlackSignature(request: Request, rawBody: string): Promise<boolean> {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) {
    console.error("SLACK_SIGNING_SECRET not configured");
    return false;
  }

  const timestamp = request.headers.get("x-slack-request-timestamp");
  const signature = request.headers.get("x-slack-signature");

  if (!timestamp || !signature) return false;

  // Reject requests older than 5 minutes to prevent replay attacks
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) return false;

  const baseString = `v0:${timestamp}:${rawBody}`;
  const computed = "v0=" + crypto
    .createHmac("sha256", signingSecret)
    .update(baseString)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch {
    return false;
  }
}

// POST /api/integrations/slack/events
// Receives all Slack events (message.channels) for every workspace that has
// installed the app. When a team member replies to an email-notification thread,
// we find the original EmailThread and send the reply back via Resend.
export async function POST(request: Request) {
  // Read raw body BEFORE any parsing — needed for signature verification
  const rawBody = await request.text();

  // Verify the request really came from Slack
  const valid = await verifySlackSignature(request, rawBody);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ── URL verification challenge (one-time, when you first set the Events URL) ─
  if (payload.type === "url_verification") {
    return NextResponse.json({ challenge: payload.challenge });
  }

  // ── Only handle message events ─────────────────────────────────────────────
  if (payload.type !== "event_callback") {
    return NextResponse.json({ ok: true });
  }

  const event = payload.event as Record<string, unknown>;

  // Only process plain text thread replies, not bot messages or channel broadcasts
  if (
    event.type !== "message" ||
    event.subtype === "bot_message" ||
    event.subtype === "thread_broadcast" || // "Also send to #channel" duplicate
    event.subtype === "message_changed" ||  // file-processing updates — already handled on first event
    event.subtype === "message_deleted" ||
    event.bot_id !== undefined ||
    !event.thread_ts ||            // must be inside a thread
    event.thread_ts === event.ts   // ignore the root message itself
  ) {
    return NextResponse.json({ ok: true });
  }

  const threadTs = event.thread_ts as string;
  const channelId = event.channel as string;
  const replyText = ((event.text as string) || "").trim();
  // Support both `files` (array, modern API) and `file` (singular, older events)
  const slackFiles: Array<Record<string, unknown>> = [
    ...((event.files as Array<Record<string, unknown>> | undefined) || []),
    ...(event.file ? [event.file as Record<string, unknown>] : []),
  ];

  // Must have either text or file attachments
  if (!replyText && slackFiles.length === 0) return NextResponse.json({ ok: true });

  await dbConnect();

  // Find the email thread that this Slack thread belongs to
  const emailThread = await EmailThread.findOne({
    slackMessageTs: threadTs,
    slackChannelId: channelId,
    direction: "inbound",
  });

  if (!emailThread) {
    // Not one of our email notifications — ignore
    return NextResponse.json({ ok: true });
  }

  // ── Build the reply email ──────────────────────────────────────────────────
  try {
    const replySubject = emailThread.subject.startsWith("Re:")
      ? emailThread.subject
      : `Re: ${emailThread.subject}`;

    const references = [emailThread.messageId, ...(emailThread.references || [])].filter(Boolean);
    const referencesHeader = references.join(" ");

    // Determine the "from" address (same logic as /api/emails/reply)
    const alias = await Alias.findById(emailThread.aliasId).lean();
    const domain = alias
      ? await Domain.findOne({ _id: alias.domainId }).lean()
      : null;

    const fallbackEmail = process.env.REPLY_FROM_EMAIL || "onboarding@resend.dev";
    const fallbackName = process.env.REPLY_FROM_NAME || "Email Router";

    let fromAddress: string;
    if (domain?.verifiedForSending) {
      fromAddress = emailThread.to; // e.g. support@git-cv.com
    } else {
      fromAddress = fallbackName
        ? `${fallbackName} <${fallbackEmail}>`
        : fallbackEmail;
    }

    // ── Download any files attached in the Slack reply ─────────────────────
    // Use base64 string + content_type so Gmail renders images correctly.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attachments: any[] = [];

    if (slackFiles.length > 0) {
      // Find the bot token for this channel's integration
      const integration = await Integration.findOne({
        slackChannelId: channelId,
        authMethod: "oauth",
      }).lean();
      const botToken = integration?.slackAccessToken;

      if (botToken) {
        for (const file of slackFiles) {
          const downloadUrl = (file.url_private_download || file.url_private) as string | undefined;
          const filename = (file.name || file.title || "attachment") as string;
          const mimeType = (file.mimetype as string | undefined) || "application/octet-stream";
          if (!downloadUrl) continue;
          try {
            const fileRes = await fetch(downloadUrl, {
              headers: { Authorization: `Bearer ${botToken}` },
            });
            if (fileRes.ok) {
              const base64Content = Buffer.from(await fileRes.arrayBuffer()).toString("base64");
              attachments.push({
                filename,
                content: base64Content,
                ...(mimeType ? { content_type: mimeType } : {}),
              });
            } else {
              console.warn(`⚠️ Slack file download returned ${fileRes.status} for: ${filename}`);
            }
          } catch (e) {
            console.warn("⚠️ Could not download Slack file:", filename, e);
          }
        }
      } else {
        console.warn("⚠️ No OAuth bot token found for channel:", channelId);
      }
    }

    // ── Send email via Resend ─────────────────────────────────────────────
    // Try with attachments first; if Resend rejects, fall back to text-only
    const baseEmailPayload = {
      from: fromAddress,
      to: emailThread.from,
      subject: replySubject,
      text: replyText || "(see attachment)",
      headers: {
        "In-Reply-To": emailThread.messageId,
        ...(referencesHeader ? { References: referencesHeader } : {}),
      },
    };

    let sendError: unknown = null;

    if (attachments.length > 0) {
      const { error } = await resend.emails.send({ ...baseEmailPayload, attachments });
      if (error) {
        console.warn("⚠️ Resend rejected email with attachments, retrying text-only:", error);
        // Fallback: send text only, mention attachments couldn't be forwarded
        const fallbackText = `${replyText}\n\n[Note: ${attachments.length} attachment(s) could not be forwarded]`;
        const { error: fallbackError } = await resend.emails.send({ ...baseEmailPayload, text: fallbackText });
        sendError = fallbackError;
      }
    } else {
      const { error } = await resend.emails.send(baseEmailPayload);
      sendError = error;
    }

    if (sendError) {
      console.error("❌ Resend error sending Slack reply:", sendError);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // Mark the thread as open (reply sent, awaiting customer's next message)
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

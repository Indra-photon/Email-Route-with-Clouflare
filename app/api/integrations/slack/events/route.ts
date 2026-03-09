import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
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

  // Only process plain text thread replies, not bot messages
  if (
    event.type !== "message" ||
    event.subtype === "bot_message" ||
    event.bot_id !== undefined ||
    !event.thread_ts ||            // must be inside a thread
    event.thread_ts === event.ts   // ignore the root message itself
  ) {
    return NextResponse.json({ ok: true });
  }

  const threadTs  = event.thread_ts as string;
  const channelId = event.channel   as string;
  const replyText = ((event.text as string) || "").trim();

  if (!replyText) return NextResponse.json({ ok: true });

  await dbConnect();

  // Find the email thread that this Slack thread belongs to
  const emailThread = await EmailThread.findOne({
    slackMessageTs:  threadTs,
    slackChannelId:  channelId,
    direction:       "inbound",
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
    const fallbackName  = process.env.REPLY_FROM_NAME  || "Email Router";

    let fromAddress: string;
    if (domain?.verifiedForSending) {
      fromAddress = emailThread.to; // e.g. support@git-cv.com
    } else {
      fromAddress = fallbackName
        ? `${fallbackName} <${fallbackEmail}>`
        : fallbackEmail;
    }

    const { error: sendError } = await resend.emails.send({
      from:    fromAddress,
      to:      emailThread.from,
      subject: replySubject,
      text:    replyText,
      headers: {
        "In-Reply-To": emailThread.messageId,
        ...(referencesHeader ? { References: referencesHeader } : {}),
      },
    });

    if (sendError) {
      console.error("❌ Resend error sending Slack reply:", sendError);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // Mark the thread as waiting (reply sent, awaiting customer response)
    emailThread.status          = "waiting";
    emailThread.statusUpdatedAt = new Date();
    emailThread.repliedAt       = new Date();
    await emailThread.save();

    console.log(`✅ Slack→Email reply sent for thread ${emailThread._id}`);
  } catch (err) {
    console.error("❌ Error processing Slack reply event:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

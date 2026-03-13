import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";

export async function POST(request: Request) {
  const rawBody = await request.text();

  // 1. Verify Slack signing secret
  const timestamp = request.headers.get("x-slack-request-timestamp") || "";
  const slackSignature = request.headers.get("x-slack-signature") || "";
  const signingSecret = process.env.SLACK_SIGNING_SECRET!;

  const sigBaseString = `v0:${timestamp}:${rawBody}`;
  const mySignature = "v0=" + crypto
    .createHmac("sha256", signingSecret)
    .update(sigBaseString)
    .digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(mySignature), Buffer.from(slackSignature))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 2. Parse payload (Slack sends URL-encoded form data)
  const params = new URLSearchParams(rawBody);
  const payload = JSON.parse(params.get("payload") || "{}");

  // 3. Only handle block_actions with set_status
  if (payload.type !== "block_actions") {
    return NextResponse.json({ ok: true });
  }

  const action = payload.actions?.[0];
  if (!action || action.action_id !== "set_status") {
    return NextResponse.json({ ok: true });
  }

  // 4. Parse value: "open__<threadId>"
  const [status, threadId] = action.value.split("__");
  if (!status || !threadId) {
    return NextResponse.json({ error: "Invalid value" }, { status: 400 });
  }

  const validStatuses = ["open", "in_progress", "resolved"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // 5. Update DB
  await dbConnect();
  await EmailThread.findByIdAndUpdate(threadId, {
    status,
    statusUpdatedAt: new Date(),
    ...(status === "resolved" ? { resolvedAt: new Date(), resolvedBy: payload.user?.id } : {}),
    ...(status !== "resolved" ? { resolvedAt: null, resolvedBy: null } : {}),
  });

  return NextResponse.json({ ok: true });
}
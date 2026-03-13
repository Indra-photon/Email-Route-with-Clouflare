// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import dbConnect from "@/lib/dbConnect";
// import { EmailThread } from "@/app/api/models/EmailThreadModel";

// export async function POST(request: Request) {
//   const rawBody = await request.text();

//   // 1. Verify Slack signing secret
//   const timestamp = request.headers.get("x-slack-request-timestamp") || "";
//   const slackSignature = request.headers.get("x-slack-signature") || "";
//   const signingSecret = process.env.SLACK_SIGNING_SECRET!;

//   const sigBaseString = `v0:${timestamp}:${rawBody}`;
//   const mySignature = "v0=" + crypto
//     .createHmac("sha256", signingSecret)
//     .update(sigBaseString)
//     .digest("hex");

//   if (!crypto.timingSafeEqual(Buffer.from(mySignature), Buffer.from(slackSignature))) {
//     return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//   }

//   // 2. Parse payload (Slack sends URL-encoded form data)
//   const params = new URLSearchParams(rawBody);
//   const payload = JSON.parse(params.get("payload") || "{}");

//   // 3. Only handle block_actions with set_status
//   if (payload.type !== "block_actions") {
//     return NextResponse.json({ ok: true });
//   }

//   const action = payload.actions?.[0];
//   if (!action || !action.action_id.startsWith("set_status")) {
//     return NextResponse.json({ ok: true });
//   }

//   // 4. Parse value: "open__<threadId>"
//   const [status, threadId] = action.value.split("__");
//   if (!status || !threadId) {
//     return NextResponse.json({ error: "Invalid value" }, { status: 400 });
//   }

//   const validStatuses = ["open", "in_progress", "resolved"];
//   if (!validStatuses.includes(status)) {
//     return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//   }

//   // 5. Update DB
//   await dbConnect();
//   await EmailThread.findByIdAndUpdate(threadId, {
//     status,
//     statusUpdatedAt: new Date(),
//     ...(status === "resolved" ? { resolvedAt: new Date(), resolvedBy: payload.user?.id } : {}),
//     ...(status !== "resolved" ? { resolvedAt: null, resolvedBy: null } : {}),
//   });

//   return NextResponse.json({ ok: true });
// }

import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { CannedResponse } from "@/app/api/models/CannedResponseModel";
import { Integration } from "@/app/api/models/IntegrationModel";

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

  // 2. Parse payload
  const params = new URLSearchParams(rawBody);
  const payload = JSON.parse(params.get("payload") || "{}");

  // ── Block actions ──────────────────────────────────────────────────────────
  if (payload.type === "block_actions") {
    const action = payload.actions?.[0];
    if (!action) return NextResponse.json({ ok: true });

    const actionId = action.action_id as string;

    // ── Existing: status buttons ─────────────────────────────────────────
    if (actionId.startsWith("set_status")) {
      const [status, threadId] = action.value.split("__");
      if (!status || !threadId) return NextResponse.json({ error: "Invalid value" }, { status: 400 });

      const validStatuses = ["open", "in_progress", "resolved"];
      if (!validStatuses.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

      await dbConnect();
      await EmailThread.findByIdAndUpdate(threadId, {
        status,
        statusUpdatedAt: new Date(),
        ...(status === "resolved" ? { resolvedAt: new Date(), resolvedBy: payload.user?.id } : {}),
        ...(status !== "resolved" ? { resolvedAt: null, resolvedBy: null } : {}),
      });

      return NextResponse.json({ ok: true });
    }

    // ── New: canned response button ──────────────────────────────────────
    if (actionId === "canned_response_button") {
      const threadId = action.value;
      const triggerId = payload.trigger_id;

      await dbConnect();

      const thread = await EmailThread.findById(threadId).lean();
      if (!thread) return NextResponse.json({ ok: true });

      const integration = await Integration.findOne({
        slackChannelId: thread.slackChannelId,
        authMethod: "oauth",
      }).lean();

      if (!integration?.slackAccessToken) return NextResponse.json({ ok: true });

      const responses = await CannedResponse.find({ aliasId: thread.aliasId }).lean();

      const options = responses.length > 0
        ? responses.map((r) => ({
            text: { type: "plain_text", text: r.title.slice(0, 75) },
            value: r._id.toString(),
          }))
        : null;

      await fetch("https://slack.com/api/views.open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${integration.slackAccessToken}`,
        },
        body: JSON.stringify({
          trigger_id: triggerId,
          view: {
            type: "modal",
            callback_id: "canned_response_picker",
            private_metadata: threadId,
            title: { type: "plain_text", text: "Canned Responses" },
            ...(options ? { submit: { type: "plain_text", text: "Use This Response" } } : {}),
            close: { type: "plain_text", text: "Cancel" },
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: options
                    ? "Select a canned response to pre-fill your reply:"
                    : "No canned responses found for this alias. Add some from the dashboard.",
                },
              },
              ...(options
                ? [
                    {
                      type: "input",
                      block_id: "canned_select",
                      label: { type: "plain_text", text: "Choose response" },
                      element: {
                        type: "static_select",
                        action_id: "selected_canned",
                        placeholder: { type: "plain_text", text: "Select a template..." },
                        options,
                      },
                    },
                  ]
                : []),
            ],
          },
        }),
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  }

  // ── View submissions ───────────────────────────────────────────────────────
  if (payload.type === "view_submission") {
    const callbackId = payload.view.callback_id;

    // ── Canned response picker submitted ────────────────────────────────
    if (callbackId === "canned_response_picker") {
      const threadId = payload.view.private_metadata;
      const selectedId =
        payload.view.state.values?.canned_select?.selected_canned?.selected_option?.value;

      if (!selectedId) return NextResponse.json({ response_action: "clear" });

      await dbConnect();

      const [thread, cannedResponse] = await Promise.all([
        EmailThread.findById(threadId).lean(),
        CannedResponse.findById(selectedId).lean(),
      ]);

      if (!thread || !cannedResponse) return NextResponse.json({ response_action: "clear" });

      const integration = await Integration.findOne({
        slackChannelId: thread.slackChannelId,
        authMethod: "oauth",
      }).lean();

      if (!integration?.slackAccessToken) return NextResponse.json({ response_action: "clear" });

      // Substitute template variables
      const body = cannedResponse.body
        .replace(/\{customer_name\}/g, thread.fromName || thread.from)
        .replace(/\{agent_name\}/g, payload.user?.name || "")
        .replace(/\{support_email\}/g, thread.to || "");

      // Open reply modal with body pre-filled
      await fetch("https://slack.com/api/views.push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${integration.slackAccessToken}`,
        },
        body: JSON.stringify({
          trigger_id: payload.trigger_id,
          view: {
            type: "modal",
            callback_id: "reply_modal",
            private_metadata: threadId,
            title: { type: "plain_text", text: "Reply to Email" },
            submit: { type: "plain_text", text: "Send Reply" },
            close: { type: "plain_text", text: "Cancel" },
            blocks: [
              {
                type: "input",
                block_id: "reply_text",
                label: { type: "plain_text", text: "Your Reply" },
                element: {
                  type: "plain_text_input",
                  action_id: "reply_input",
                  multiline: true,
                  initial_value: body,
                },
              },
            ],
          },
        }),
      });

      return NextResponse.json({ response_action: "clear" });
    }

    // ── Reply modal submitted ──────────────────────────────────────────
    if (callbackId === "reply_modal") {
      const threadId = payload.view.private_metadata;
      const replyText = payload.view.state.values?.reply_text?.reply_input?.value;
      const slackUserId = payload.user?.id;
      const slackUserName = payload.user?.name;

      if (!replyText?.trim()) return NextResponse.json({ response_action: "clear" });
      console.log("🚀 Firing reply for threadId:", threadId, "text length:", replyText.trim().length);
      // Fire and forget — must respond to Slack within 3s
      (async () => {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ threadId, replyText: replyText.trim(), slackUserId, slackUserName }),
          });
        } catch (e) {
          console.error("❌ Background reply failed:", e);
        }
      })();

      return NextResponse.json({ response_action: "clear" });
    }

    return NextResponse.json({ response_action: "clear" });
  }

  return NextResponse.json({ ok: true });
}
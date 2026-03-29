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
import { Resend } from "resend";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { CannedResponse } from "@/app/api/models/CannedResponseModel";
import { EmailTemplate } from "@/app/api/models/EmailTemplateModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { Alias } from "@/app/api/models/AliasModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";

// ── Helper: substitute {name}, {email}, {subject}, {date}, {agent} in a string
function substituteVars(
  text: string,
  thread: { from: string; fromName?: string; subject: string; to: string },
  agentName: string
): string {
  let name = thread.fromName?.trim();
  
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = thread.from.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : thread.from;

  if (!name) {
    const noTags = thread.from.replace(/<[^>]+>/, "").trim();
    if (noTags && !noTags.includes("@")) {
      name = noTags;
    } else {
      name = email.split("@")[0];
    }
  }

  // Capitalize name
  name = name.charAt(0).toUpperCase() + name.slice(1);

  return text
    .replace(/\{name\}/g, name)
    .replace(/\{email\}/g, email)
    .replace(/\{subject\}/g, thread.subject)
    .replace(/\{date\}/g, new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))
    .replace(/\{agent\}/g, agentName || "Support Team");
}

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // ── New: template button ─────────────────────────────────────────────
    if (actionId === "template_button") {
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

      // Fetch workspace-level templates
      const templates = await EmailTemplate.find({ workspaceId: thread.workspaceId })
        .sort({ createdAt: -1 })
        .lean();

      const options = templates.length > 0
        ? templates.map((t) => ({
            text: { type: "plain_text", text: t.name.slice(0, 75) },
            value: t._id.toString(),
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
            callback_id: "template_picker",
            private_metadata: threadId,
            title: { type: "plain_text", text: "📋 Email Templates" },
            ...(options ? { submit: { type: "plain_text", text: "Use Template" } } : {}),
            close: { type: "plain_text", text: "Cancel" },
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: options
                    ? `*Choose a template* to pre-fill your reply.\nVariables like \`{name}\`, \`{email}\` will be auto-filled from the email.`
                    : "No templates found. Create some from the *Email Templates* section in your dashboard.",
                },
              },
              ...(options
                ? [
                    {
                      type: "input",
                      block_id: "template_select_block",
                      label: { type: "plain_text", text: "Select template" },
                      element: {
                        type: "static_select",
                        action_id: "selected_template",
                        placeholder: { type: "plain_text", text: "Choose a template..." },
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

      // Substitute template variables
      const body = cannedResponse.body
        .replace(/\{customer_name\}/g, thread.fromName || thread.from)
        .replace(/\{agent_name\}/g, payload.user?.name || "")
        .replace(/\{support_email\}/g, thread.to || "");

      // Push the reply modal directly in the response — avoids views.push race with response_action: "clear"
      return NextResponse.json({
        response_action: "push",
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
      });
    }

    // ── Template picker submitted ────────────────────────────────────────
    if (callbackId === "template_picker") {
      const threadId = payload.view.private_metadata;
      const selectedId =
        payload.view.state.values?.template_select_block?.selected_template?.selected_option?.value;

      if (!selectedId) return NextResponse.json({ response_action: "clear" });

      await dbConnect();

      const [thread, template] = await Promise.all([
        EmailThread.findById(threadId).lean(),
        EmailTemplate.findById(selectedId).lean(),
      ]);

      if (!thread || !template) return NextResponse.json({ response_action: "clear" });

      const agentName = payload.user?.name || payload.user?.real_name || "Support Team";

      // Auto-fill all variables in both subject and body
      const filledBody = substituteVars(template.body, thread, agentName);
      const filledSubject = substituteVars(
        template.subject || `Re: ${thread.subject}`,
        thread,
        agentName
      );

      // Also fill variables in htmlBody if present
      const filledHtmlBody = template.htmlBody
        ? substituteVars(template.htmlBody, thread, agentName)
        : "";

      // Push reply modal pre-filled with template — agent can still edit
      return NextResponse.json({
        response_action: "push",
        view: {
          type: "modal",
          callback_id: "template_reply_modal",
          // pass threadId + filledSubject + htmlBody in metadata
          private_metadata: JSON.stringify({ threadId, subject: filledSubject, htmlBody: filledHtmlBody }),
          title: { type: "plain_text", text: "📋 Send Template Reply" },
          submit: { type: "plain_text", text: "✉️ Send Email" },
          close: { type: "plain_text", text: "Cancel" },
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Template:* ${template.name}\n*To:* ${thread.from}\n*Subject:* ${filledSubject}`,
              },
            },
            { type: "divider" },
            {
              type: "input",
              block_id: "template_reply_body",
              label: { type: "plain_text", text: "Message (editable)" },
              hint: {
                type: "plain_text",
                text: "Variables have been auto-filled. You can still edit freely before sending.",
              },
              element: {
                type: "plain_text_input",
                action_id: "template_reply_input",
                multiline: true,
                initial_value: filledBody,
              },
            },
          ],
        },
      });
    }

    // ── Template reply modal submitted ────────────────────────────────
    if (callbackId === "template_reply_modal") {
      let threadId: string;
      let subjectOverride: string | null = null;
      let templateHtmlBody: string = "";
      try {
        const meta = JSON.parse(payload.view.private_metadata);
        threadId = meta.threadId;
        subjectOverride = meta.subject || null;
        templateHtmlBody = meta.htmlBody || "";
      } catch {
        threadId = payload.view.private_metadata;
      }

      const replyText = (
        payload.view.state.values?.template_reply_body?.template_reply_input?.value || ""
      ).trim();

      if (!replyText) return NextResponse.json({ response_action: "clear" });

      await dbConnect();

      const thread = await EmailThread.findById(threadId);
      if (!thread) return NextResponse.json({ response_action: "clear" });

      const alias = await Alias.findById(thread.aliasId).lean();
      const domain = alias
        ? await Domain.findOne({ _id: alias.domainId, workspaceId: thread.workspaceId }).lean()
        : null;

      const fallbackEmail = process.env.REPLY_FROM_EMAIL || "onboarding@resend.dev";
      const fallbackName = process.env.REPLY_FROM_NAME || "Email Router";
      const fromAddress = domain?.verifiedForSending
        ? (thread.to as string)
        : fallbackName ? `${fallbackName} <${fallbackEmail}>` : fallbackEmail;

      // Use template subject if provided, else default Re:
      const replySubject =
        subjectOverride ||
        (thread.subject.startsWith("Re:") ? thread.subject : `Re: ${thread.subject}`);

      const references = [thread.messageId, ...(thread.references || [])].filter(Boolean);
      const referencesHeader = references.join(" ");

      // Use template htmlBody if available, else build a minimal wrapper
      let htmlBody = templateHtmlBody;
      
      if (htmlBody) {
        if (htmlBody.includes("{message}")) {
          htmlBody = htmlBody.replace(/\{message\}/g, replyText.replace(/\n/g, "<br/>"));
        } else {
          // They supplied HTML but didn't put {message}
          // The plain text text part still contains replyText
        }
      } else {
        htmlBody = `<!DOCTYPE html>
<html><body style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px">
${replyText.replace(/\n/g, "<br/>")}
</body></html>`;
      }

      const { data: sentEmail, error: sendError } = await resend.emails.send({
        from: fromAddress,
        to: thread.from,
        subject: replySubject,
        text: replyText,
        html: htmlBody,
        headers: {
          "In-Reply-To": thread.messageId,
          ...(referencesHeader ? { References: referencesHeader } : {}),
        },
      });

      if (sendError || !sentEmail) {
        console.error("❌ Resend error in template_reply_modal:", sendError);
        return NextResponse.json({ response_action: "clear" });
      }

      console.log("✅ Template reply sent, emailId:", sentEmail.id);

      const storedFrom = fromAddress.includes("<")
        ? fromAddress.slice(fromAddress.indexOf("<") + 1, fromAddress.indexOf(">")).trim()
        : fromAddress;

      // Find root Slack thread ts
      let slackThreadTs: string | null = thread.slackMessageTs || null;
      let slackChannelId: string | null = thread.slackChannelId || null;

      if (thread.inReplyTo && thread.slackMessageTs) {
        const refsToCheck = [thread.inReplyTo, ...(thread.references || [])].filter(Boolean);
        const rootThread = await EmailThread.findOne({
          messageId: { $in: refsToCheck },
          slackMessageTs: { $exists: true, $ne: null },
          workspaceId: thread.workspaceId,
        }).sort({ createdAt: 1 }).lean();
        if (rootThread?.slackMessageTs) {
          slackThreadTs = rootThread.slackMessageTs as string;
          slackChannelId = (rootThread.slackChannelId as string) || slackChannelId;
        }
      }

      // Post confirmation to Slack thread
      let outboundSlackTs: string | null = null;
      if (slackChannelId && slackThreadTs) {
        const integration = await Integration.findOne({
          slackChannelId,
          authMethod: "oauth",
        }).lean();

        if (integration?.slackAccessToken) {
          const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${integration.slackAccessToken}`,
            },
            body: JSON.stringify({
              channel: slackChannelId,
              thread_ts: slackThreadTs,
              text: `📤 *Template reply sent* to ${thread.from}\n> ${replyText.replace(/\n/g, "\n> ")}`,
            }),
          });
          const slackData = await slackRes.json();
          if (slackData.ok) outboundSlackTs = slackData.ts as string;
        }
      }

      await EmailThread.create({
        workspaceId: thread.workspaceId,
        aliasId: thread.aliasId,
        originalEmailId: sentEmail.id,
        messageId: `<${sentEmail.id}@resend.app>`,
        inReplyTo: thread.messageId,
        references,
        from: storedFrom,
        to: thread.from,
        subject: replySubject,
        textBody: replyText,
        htmlBody,
        direction: "outbound",
        status: "waiting",
        statusUpdatedAt: new Date(),
        receivedAt: new Date(),
        repliedAt: new Date(),
        slackMessageTs: outboundSlackTs,
        slackChannelId: slackChannelId,
      });

      await Subscription.updateOne(
        { workspaceId: thread.workspaceId },
        { $inc: { ticketCountOutbound: 1 } }
      );

      thread.status = "open";
      thread.statusUpdatedAt = new Date();
      thread.repliedAt = new Date();
      await thread.save();

      return NextResponse.json({ response_action: "clear" });
    }

    // ── Reply modal submitted ──────────────────────────────────────────
    if (callbackId === "reply_modal") {
      const threadId = payload.view.private_metadata;
      const replyText = (payload.view.state.values?.reply_text?.reply_input?.value || "").trim();

      if (!replyText) return NextResponse.json({ response_action: "clear" });

      await dbConnect();

      const thread = await EmailThread.findById(threadId);
      if (!thread) {
        console.error("❌ Thread not found for reply_modal:", threadId);
        return NextResponse.json({ response_action: "clear" });
      }

      // Resolve from address via alias/domain
      const alias = await Alias.findById(thread.aliasId).lean();
      const domain = alias
        ? await Domain.findOne({ _id: alias.domainId, workspaceId: thread.workspaceId }).lean()
        : null;

      const fallbackEmail = process.env.REPLY_FROM_EMAIL || "onboarding@resend.dev";
      const fallbackName = process.env.REPLY_FROM_NAME || "Email Router";
      const fromAddress = domain?.verifiedForSending
        ? (thread.to as string)
        : fallbackName ? `${fallbackName} <${fallbackEmail}>` : fallbackEmail;

      const replySubject = thread.subject.startsWith("Re:") ? thread.subject : `Re: ${thread.subject}`;
      const references = [thread.messageId, ...(thread.references || [])].filter(Boolean);
      const referencesHeader = references.join(" ");

      const { data: sentEmail, error: sendError } = await resend.emails.send({
        from: fromAddress,
        to: thread.from,
        subject: replySubject,
        text: replyText,
        headers: {
          "In-Reply-To": thread.messageId,
          ...(referencesHeader ? { References: referencesHeader } : {}),
        },
      });

      if (sendError || !sentEmail) {
        console.error("❌ Resend error in reply_modal:", sendError);
        return NextResponse.json({ response_action: "clear" });
      }

      console.log("✅ Reply sent via canned response, emailId:", sentEmail.id);

      const storedFrom = fromAddress.includes("<")
        ? fromAddress.slice(fromAddress.indexOf("<") + 1, fromAddress.indexOf(">")).trim()
        : fromAddress;

      // ── Find the root Slack thread ts for threading the reply ──────────
      let slackThreadTs: string | null = thread.slackMessageTs || null;
      let slackChannelId: string | null = thread.slackChannelId || null;

      if (thread.inReplyTo && thread.slackMessageTs) {
        // Walk up the reference chain to find the oldest (root) message with a Slack ts
        const refsToCheck = [thread.inReplyTo, ...(thread.references || [])].filter(Boolean);
        const rootThread = await EmailThread.findOne({
          messageId: { $in: refsToCheck },
          slackMessageTs: { $exists: true, $ne: null },
          workspaceId: thread.workspaceId,
        }).sort({ createdAt: 1 }).lean();

        if (rootThread?.slackMessageTs) {
          slackThreadTs = rootThread.slackMessageTs as string;
          slackChannelId = (rootThread.slackChannelId as string) || slackChannelId;
        }
      }

      // ── Post confirmation message to Slack thread ──────────────────────
      let outboundSlackTs: string | null = null;
      if (slackChannelId && slackThreadTs) {
        const integration = await Integration.findOne({
          slackChannelId,
          authMethod: "oauth",
        }).lean();

        if (integration?.slackAccessToken) {
          const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${integration.slackAccessToken}`,
            },
            body: JSON.stringify({
              channel: slackChannelId,
              thread_ts: slackThreadTs,
              text: `📤 *Reply sent* to ${thread.from}\n>${replyText.replace(/\n/g, "\n>")}`,
            }),
          });
          const slackData = await slackRes.json();
          if (slackData.ok) {
            outboundSlackTs = slackData.ts as string;
            console.log("📨 Canned response posted to Slack thread:", outboundSlackTs);
          } else {
            console.warn("⚠️ Slack postMessage failed:", slackData.error);
          }
        }
      }

      await EmailThread.create({
        workspaceId: thread.workspaceId,
        aliasId: thread.aliasId,
        originalEmailId: sentEmail.id,
        messageId: `<${sentEmail.id}@resend.app>`,
        inReplyTo: thread.messageId,
        references,
        from: storedFrom,
        to: thread.from,
        subject: replySubject,
        textBody: replyText,
        htmlBody: "",
        direction: "outbound",
        status: "waiting",
        statusUpdatedAt: new Date(),
        receivedAt: new Date(),
        repliedAt: new Date(),
        slackMessageTs: outboundSlackTs,
        slackChannelId: slackChannelId,
      });

      // ── Increment outbound reply counter on the workspace's subscription ──
      await Subscription.updateOne(
        { workspaceId: thread.workspaceId },
        { $inc: { ticketCountOutbound: 1 } }
      );

      thread.status = "open";
      thread.statusUpdatedAt = new Date();
      thread.repliedAt = new Date();
      await thread.save();

      return NextResponse.json({ response_action: "clear" });
    }

    return NextResponse.json({ response_action: "clear" });
  }

  return NextResponse.json({ ok: true });
}
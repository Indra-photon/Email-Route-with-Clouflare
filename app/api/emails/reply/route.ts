import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Alias } from "@/app/api/models/AliasModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Subscription } from "@/app/api/models/SubscriptionModel";
import { Resend } from "resend";
import { getPostHogClient } from "@/lib/posthog-server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { threadId, replyText } = body as { threadId?: string; replyText?: string };

    if (!threadId || !replyText) {
      return NextResponse.json(
        { error: "Missing threadId or replyText" },
        { status: 400 }
      );
    }

    if (!String(replyText).trim()) {
      return NextResponse.json(
        { error: "Reply text cannot be empty" },
        { status: 400 }
      );
    }

    const trimmedReply = String(replyText).trim();

    await dbConnect();

    const workspace = await Workspace.findOne({
      ownerUserId: userId,
    }).lean();

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const thread = await EmailThread.findById(threadId);

    if (!thread) {
      return NextResponse.json(
        { error: "Email thread not found" },
        { status: 404 }
      );
    }

    if (thread.workspaceId.toString() !== workspace._id.toString()) {
      return NextResponse.json(
        { error: "You don't have access to this email thread" },
        { status: 403 }
      );
    }

    if (thread.direction !== "inbound") {
      return NextResponse.json(
        { error: "Can only reply to inbound emails" },
        { status: 400 }
      );
    }

    // Auto-claim ticket if not already claimed
    if (!thread.assignedTo) {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const userEmail = user.emailAddresses[0]?.emailAddress || "Unknown";
      const userName = user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : userEmail;

      thread.assignedTo = userId;
      thread.assignedToEmail = userEmail;
      thread.assignedToName = userName;
      thread.claimedAt = new Date();
      thread.status = "in_progress";
      thread.statusUpdatedAt = new Date();

      console.log(`✅ Auto-claimed ticket ${threadId} by ${userName}`);
    }

    const replySubject = thread.subject.startsWith("Re:")
      ? thread.subject
      : `Re: ${thread.subject}`;

    const references = [thread.messageId, ...(thread.references || [])].filter(Boolean);
    const referencesHeader = references.join(" ");

    // Resolve "from" address: use customer domain if verified for sending, else fallback
    const alias = await Alias.findById(thread.aliasId).lean();
    // Query by _id only — workspaceId check is already done on thread above
    const domain = alias
      ? await Domain.findById(alias.domainId).lean()
      : null;

    const fallbackEmail = process.env.REPLY_FROM_EMAIL || "onboarding@resend.dev";

    // Use custom bot name from Customize App if admin set it; otherwise bare email (default)
    const botName = (domain as any)?.botName || null;
    console.log("🎨 reply route — domain:", (domain as any)?.domain, "botName:", botName);

    let fromAddress: string;
    if (domain?.verifiedForSending) {
      const rawEmail = thread.to as string;
      fromAddress = botName ? `${botName} <${rawEmail}>` : rawEmail;
      console.log("Using customer domain for reply:", fromAddress);
    } else {
      fromAddress = botName ? `${botName} <${fallbackEmail}>` : fallbackEmail;
      console.log("Using fallback sender for reply:", fromAddress);
    }

    const { data: sentEmail, error: sendError } = await resend.emails.send({
      from: fromAddress,
      to: thread.from,
      subject: replySubject,
      text: trimmedReply,
      headers: {
        "In-Reply-To": thread.messageId,
        ...(referencesHeader ? { References: referencesHeader } : {}),
      },
    });

    if (sendError || !sentEmail) {
      console.error("❌ Resend error:", sendError);
      return NextResponse.json(
        { error: "Failed to send email", details: sendError },
        { status: 500 }
      );
    }

    const storedFromEmail =
      fromAddress.includes("<") && fromAddress.includes(">")
        ? fromAddress.slice(fromAddress.indexOf("<") + 1, fromAddress.indexOf(">")).trim()
        : fromAddress;

    const outboundThread = await EmailThread.create({
      workspaceId: workspace._id,
      aliasId: thread.aliasId,
      originalEmailId: sentEmail.id,
      messageId: `<${sentEmail.id}@resend.app>`,
      inReplyTo: thread.messageId,
      references: references,
      from: storedFromEmail,
      to: thread.from,
      subject: replySubject,
      textBody: trimmedReply,
      htmlBody: "",
      direction: "outbound",
      status: "waiting",
      statusUpdatedAt: new Date(),
      receivedAt: new Date(),
      repliedAt: new Date(),
    });

    // ── Increment outbound reply counter on the workspace's subscription ──
    await Subscription.updateOne(
      { workspaceId: workspace._id },
      { $inc: { ticketCountOutbound: 1 } }
    );

    // Save thread updates (including auto-claim)
    // Status becomes "open" after a reply — waiting for customer's next message
    thread.status = "open";
    thread.statusUpdatedAt = new Date();
    thread.repliedAt = new Date();
    await thread.save();

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: userId,
      event: "email_reply_sent",
      properties: {
        thread_id: threadId,
        workspace_id: workspace._id.toString(),
        using_custom_domain: domain?.verifiedForSending ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully",
      emailId: sentEmail.id,
      threadId: outboundThread._id.toString(),
    });
  } catch (error) {
    console.error("❌ Error processing reply:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

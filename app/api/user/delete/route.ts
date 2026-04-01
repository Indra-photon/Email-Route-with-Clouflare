import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { deleteFromR2 } from "@/lib/r2";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Models — imported in dependency order
import { Workspace }        from "@/app/api/models/WorkspaceModel";
import { EmailThread }      from "@/app/api/models/EmailThreadModel";
import { CannedResponse }   from "@/app/api/models/CannedResponseModel";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage }      from "@/app/api/models/ChatMessageModel";
import { ChatWidget }       from "@/app/api/models/ChatWidgetModel";
import { EmailTemplate }    from "@/app/api/models/EmailTemplateModel";
import { Alias }            from "@/app/api/models/AliasModel";
import { Integration }      from "@/app/api/models/IntegrationModel";
import { Domain }           from "@/app/api/models/DomainModel";
import { Subscription }     from "@/app/api/models/SubscriptionModel";
import { User }             from "@/app/api/models/UserModel";

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  await dbConnect();

  // ── 1. Find the user's workspace ────────────────────────────────────────────
  const workspace = await Workspace.findOne({ ownerUserId: userId }).lean();

  if (workspace) {
    const workspaceId = workspace._id;

    // ── 2. Cascade-delete all workspace-scoped data ──────────────────────────

    // Email tickets
    await EmailThread.deleteMany({ workspaceId });

    // Canned responses (reference aliases, delete before aliases)
    await CannedResponse.deleteMany({ workspaceId });

    // Chat messages — delete R2 assets first, then DB records
    const conversations = await ChatConversation.find({ workspaceId }).select("_id").lean();
    if (conversations.length > 0) {
      const convIds = conversations.map((c) => c._id);

      // Collect all messages that have a media file stored on R2
      const mediaMessages = await ChatMessage.find({
        conversationId: { $in: convIds },
        mediaUrl: { $exists: true, $ne: "" },
      }).select("mediaUrl").lean();

      // Delete all R2 files in parallel (failures don't block account deletion)
      if (mediaMessages.length > 0) {
        await Promise.allSettled(
          mediaMessages.map((msg) =>
            deleteFromR2(msg.mediaUrl).catch((e: unknown) =>
              console.warn(`⚠️ R2 delete failed for ${msg.mediaUrl}:`, e)
            )
          )
        );
      }

      // Now delete the DB records
      await ChatMessage.deleteMany({ conversationId: { $in: convIds } });
    }

    // Chat conversations
    await ChatConversation.deleteMany({ workspaceId });

    // Chat widgets
    await ChatWidget.deleteMany({ workspaceId });

    // Email templates
    await EmailTemplate.deleteMany({ workspaceId });

    // Aliases (reference domains & integrations)
    await Alias.deleteMany({ workspaceId });

    // Integrations
    await Integration.deleteMany({ workspaceId });

    // Domains — remove from Resend first
    const domainsWithResend = await Domain.find({
      workspaceId,
      resendDomainId: { $exists: true, $ne: null },
    }).select("resendDomainId domain").lean();

    if (domainsWithResend.length > 0) {
      await Promise.allSettled(
        domainsWithResend.map(async (d) => {
          try {
            const { error } = await resend.domains.remove(d.resendDomainId!);
            if (error) console.warn(`⚠️ Resend remove failed for ${d.domain}:`, error.message);
            else console.log(`✅ Removed from Resend: ${d.domain}`);
          } catch (e) {
            console.warn(`⚠️ Resend remove threw for ${d.domain}:`, e);
          }
        })
      );
    }

    await Domain.deleteMany({ workspaceId });

    // Subscription
    await Subscription.deleteMany({ workspaceId });

    // ── 3. Delete the workspace itself ───────────────────────────────────────
    await Workspace.deleteOne({ _id: workspaceId });
  }

  // ── 4. Delete the User mongo record ─────────────────────────────────────────
  await User.deleteOne({ clerkUserId: userId });

  // ── 5. Delete the Clerk account (server-side — works even if browser tab closes) ──
  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(userId);
    console.log(`✅ Clerk account deleted: ${userId}`);
  } catch (e) {
    // Log but don't fail — MongoDB data is already gone
    console.warn(`⚠️ Clerk deleteUser failed for ${userId}:`, e);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

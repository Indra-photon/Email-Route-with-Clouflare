import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { EmailThread } from "@/app/api/models/EmailThreadModel";

export { getOrCreateWorkspaceForCurrentUser };

export type ThreadAccessResult =
  | {
      access: true;
      thread: Awaited<ReturnType<typeof getThreadLean>>;
      workspace: Awaited<ReturnType<typeof getOrCreateWorkspaceForCurrentUser>>;
    }
  | {
      access: false;
      reason: "not_found" | "wrong_workspace" | "not_authenticated" | "error";
      error: string;
    };

async function getThreadLean(threadId: string) {
  await dbConnect();
  return EmailThread.findById(threadId).lean().exec();
}

/**
 * Check if current user has access to an email thread.
 * Returns { access: boolean, thread?, workspace?, reason?, error? }
 */
export async function checkThreadAccess(
  threadId: string
): Promise<ThreadAccessResult> {
  try {
    const workspace = await getOrCreateWorkspaceForCurrentUser();
    const thread = await getThreadLean(threadId);

    if (!thread) {
      return {
        access: false,
        reason: "not_found",
        error: "Email thread not found",
      };
    }

    if (thread.workspaceId.toString() !== workspace._id.toString()) {
      return {
        access: false,
        reason: "wrong_workspace",
        error: "This email does not belong to your workspace",
      };
    }

    return {
      access: true,
      thread,
      workspace,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        access: false,
        reason: "not_authenticated",
        error: "Please log in to continue",
      };
    }
    console.error("Error checking thread access:", error);
    return {
      access: false,
      reason: "error",
      error: "An error occurred while checking access",
    };
  }
}

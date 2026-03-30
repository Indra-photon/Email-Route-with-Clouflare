import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { Workspace } from "@/app/api/models/WorkspaceModel";

export async function getOrCreateWorkspaceForCurrentUser(userId?: string) {
  let authUserId = userId;
  
  if (!authUserId) {
    const authResult = await auth();
    authUserId = authResult.userId ?? undefined;
  }

  if (!authUserId) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const workspace = await Workspace.findOneAndUpdate(
    { ownerUserId: authUserId },
    {
      $setOnInsert: {
        name: "Default Workspace",
      },
    },
    {
      returnDocument: 'after',
      upsert: true,
    }
  );

  return workspace;
}


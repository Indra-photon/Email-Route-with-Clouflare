import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { Workspace } from "@/app/api/models/WorkspaceModel";

export async function getOrCreateWorkspaceForCurrentUser() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const workspace = await Workspace.findOneAndUpdate(
    { ownerUserId: userId },
    {
      $setOnInsert: {
        name: "Default Workspace",
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return workspace;
}


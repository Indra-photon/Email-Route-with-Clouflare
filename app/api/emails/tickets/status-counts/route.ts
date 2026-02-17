import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId }).lean();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Count tickets by status
    const counts = await EmailThread.aggregate([
      { $match: { workspaceId: workspace._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format response
    const result = {
      open: 0,
      in_progress: 0,
      waiting: 0,
      resolved: 0,
      total: 0
    };

    counts.forEach(item => {
      if (item._id) {
        result[item._id as keyof typeof result] = item.count;
        result.total += item.count;
      }
    });

    return NextResponse.json({ counts: result });
  } catch (error) {
    console.error("Error getting status counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

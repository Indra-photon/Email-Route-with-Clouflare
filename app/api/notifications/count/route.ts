import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser(userId);

    // Only count tickets received in the last 24 hours that are still open
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const count = await EmailThread.countDocuments({
      workspaceId: workspace._id,
      direction: "inbound",
      status: "open",
      receivedAt: { $gte: since },
    });

    // Also fetch the latest 5 for the dropdown panel
    const recent = await EmailThread.find({
      workspaceId: workspace._id,
      direction: "inbound",
      status: "open",
      receivedAt: { $gte: since },
    })
      .select("from fromName subject receivedAt")
      .sort({ receivedAt: -1 })
      .limit(5)
      .lean();

    const now = new Date();
    const items = recent.map((t: any) => {
      const diff = Math.floor((now.getTime() - new Date(t.receivedAt).getTime()) / 60000);
      const time = diff < 60 ? `${diff}m ago` : diff < 1440 ? `${Math.floor(diff / 60)}h ago` : "Today";
      return {
        id: t._id.toString(),
        from: t.fromName || t.from,
        subject: t.subject || "(no subject)",
        time,
      };
    });

    return NextResponse.json({ count, items });
  } catch (err) {
    console.error("[notifications/count]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


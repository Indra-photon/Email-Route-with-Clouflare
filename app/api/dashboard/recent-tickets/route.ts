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

    const threads = await EmailThread.find({
      workspaceId: workspace._id,
      direction:   "inbound",
    })
      .populate("aliasId", "email localPart")
      .select("from fromName subject status receivedAt")
      .sort({ receivedAt: -1 })
      .limit(5)
      .lean();

    const now = new Date();

    const tickets = threads.map((t: any) => {
      const alias = t.aliasId as any;
      const aliasLabel = alias?.localPart ? `${alias.localPart}@` : alias?.email ?? "—";

      const receivedAt = new Date(t.receivedAt);
      const diffMs = now.getTime() - receivedAt.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffHours   = Math.floor(diffMinutes / 60);
      const diffDays    = Math.floor(diffHours / 24);

      let time = "";
      if (diffMinutes < 60)       time = `${diffMinutes}m ago`;
      else if (diffHours < 24)    time = `${diffHours}h ago`;
      else if (diffDays === 1)    time = "Yesterday";
      else                         time = `${diffDays}d ago`;

      // Generate a short preview from the subject (no body stored on summary)
      const preview = `Email received on ${receivedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — re: ${t.subject}`;

      return {
        id:      t._id.toString(),
        from:    t.from,
        subject: t.subject,
        alias:   aliasLabel,
        status:  t.status as "open" | "in_progress" | "waiting" | "resolved",
        time,
        preview,
      };
    });

    return NextResponse.json(tickets);
  } catch (err) {
    console.error("[dashboard/recent-tickets]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

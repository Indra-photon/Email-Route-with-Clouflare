import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { Alias } from "@/app/api/models/AliasModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();
    const wid = workspace._id;

    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get("domainId") ?? "all";
    const aliasId  = searchParams.get("aliasId")  ?? "all";
    const range    = searchParams.get("range")     ?? "7d";

    // Resolve alias IDs that belong to workspace (optionally filtered by domain)
    let aliasIds: string[] = [];
    if (aliasId !== "all") {
      aliasIds = [aliasId];
    } else if (domainId !== "all") {
      const aliases = await Alias.find({ workspaceId: wid, domainId }).select("_id").lean();
      aliasIds = aliases.map((a: any) => a._id.toString());
    }

    const aliasFilter = aliasIds.length > 0 ? { aliasId: { $in: aliasIds } } : {};

    // ── Date window ──────────────────────────────────────────────────────────
    const now = new Date();
    const days = range === "7d" ? 7 : range === "14d" ? 14 : 30;
    const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const prevStart   = new Date(periodStart.getTime() - days * 24 * 60 * 60 * 1000);

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayEnd   = new Date(todayStart.getTime() - 1);

    const baseFilter = { workspaceId: wid, ...aliasFilter };

    // ── 1. Open tickets ───────────────────────────────────────────────────────
    const openCount          = await EmailThread.countDocuments({ ...baseFilter, status: "open" });
    const openCountYesterday = await EmailThread.countDocuments({
      ...baseFilter,
      status: "open",
      receivedAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
    });
    const openDelta = openCount - openCountYesterday;

    // ── 2. Avg first response (ms → minutes) ─────────────────────────────────
    // Only inbound threads that have been replied to within the period
    const repliedInPeriod = await EmailThread.find({
      ...baseFilter,
      direction: "inbound",
      repliedAt: { $ne: null, $gte: periodStart },
    }).select("receivedAt repliedAt").lean();

    let avgResponseMin = 0;
    if (repliedInPeriod.length > 0) {
      const totalMs = repliedInPeriod.reduce((sum: number, t: any) => {
        return sum + (new Date(t.repliedAt).getTime() - new Date(t.receivedAt).getTime());
      }, 0);
      avgResponseMin = Math.round(totalMs / repliedInPeriod.length / 60000);
    }

    const repliedPrevPeriod = await EmailThread.find({
      ...baseFilter,
      direction: "inbound",
      repliedAt: { $ne: null, $gte: prevStart, $lt: periodStart },
    }).select("receivedAt repliedAt").lean();

    let avgResponseMinPrev = 0;
    if (repliedPrevPeriod.length > 0) {
      const totalMs = repliedPrevPeriod.reduce((sum: number, t: any) => {
        return sum + (new Date(t.repliedAt).getTime() - new Date(t.receivedAt).getTime());
      }, 0);
      avgResponseMinPrev = Math.round(totalMs / repliedPrevPeriod.length / 60000);
    }
    const responseDelta = avgResponseMin - avgResponseMinPrev;

    // ── 3. Resolved today ─────────────────────────────────────────────────────
    const resolvedToday = await EmailThread.countDocuments({
      ...baseFilter,
      status: "resolved",
      resolvedAt: { $gte: todayStart },
    });
    const resolvedYesterday = await EmailThread.countDocuments({
      ...baseFilter,
      status: "resolved",
      resolvedAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
    });
    const resolvedDelta = resolvedToday - resolvedYesterday;

    // ── 4. Active live chats ──────────────────────────────────────────────────
    const activeChatCount = await ChatConversation.countDocuments({
      workspaceId: wid,
      status: "open",
    });

    return NextResponse.json({
      openTickets:     { value: openCount,       delta: openDelta,      deltaLabel: "vs yesterday" },
      avgResponseMin:  { value: avgResponseMin,   delta: responseDelta,  deltaLabel: "vs last period" },
      resolvedToday:   { value: resolvedToday,    delta: resolvedDelta,  deltaLabel: "vs yesterday" },
      activeLiveChats: { value: activeChatCount,  delta: 0,              deltaLabel: "right now" },
    });
  } catch (err) {
    console.error("[dashboard/stats]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

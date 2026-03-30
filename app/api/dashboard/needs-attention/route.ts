import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Alias } from "@/app/api/models/AliasModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

/** Format a duration in milliseconds as a readable string like "4h 12m" or "3 days" */
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (days >= 1) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours >= 1) {
    const rem = minutes % 60;
    return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

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

    // Resolve alias IDs
    let aliasIds: string[] = [];
    if (aliasId !== "all") {
      aliasIds = [aliasId];
    } else if (domainId !== "all") {
      const aliases = await Alias.find({ workspaceId: wid, domainId }).select("_id").lean();
      aliasIds = aliases.map((a: any) => a._id.toString());
    }

    const aliasFilter = aliasIds.length > 0 ? { aliasId: { $in: aliasIds } } : {};
    const now = new Date();
    const days = range === "7d" ? 7 : range === "14d" ? 14 : 30;
    const rangeStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const twoHoursAgo    = new Date(now.getTime() - 2  * 60 * 60 * 1000);
    const twentyFourHAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo   = new Date(now.getTime() - 3  * 24 * 60 * 60 * 1000);

    const [noResponse, agentInactive, waitingTooLong] = await Promise.all([
      // No response >2h: open, no reply, received more than 2h ago
      EmailThread.find({
        workspaceId: wid, ...aliasFilter,
        direction: "inbound",
        status: "open",
        repliedAt:  null,
        receivedAt: { $gte: rangeStart, $lte: twoHoursAgo },
      })
        .populate("aliasId", "email localPart")
        .select("from fromName subject status assignedToName receivedAt")
        .sort({ receivedAt: -1 })
        .limit(10)
        .lean(),

      // Agent inactive >24h: in_progress, assigned, claimedAt more than 24h ago
      EmailThread.find({
        workspaceId: wid, ...aliasFilter,
        direction: "inbound",
        status: "in_progress",
        assignedTo: { $ne: null },
        claimedAt:  { $lte: twentyFourHAgo },
      })
        .populate("aliasId", "email localPart")
        .select("from fromName subject status assignedToName claimedAt receivedAt")
        .sort({ claimedAt: 1 })
        .limit(10)
        .lean(),

      // Waiting too long >3 days
      EmailThread.find({
        workspaceId: wid, ...aliasFilter,
        direction: "inbound",
        status: "waiting",
        statusUpdatedAt: { $lte: threeDaysAgo },
      })
        .populate("aliasId", "email localPart")
        .select("from fromName subject status assignedToName statusUpdatedAt receivedAt")
        .sort({ statusUpdatedAt: 1 })
        .limit(10)
        .lean(),
    ]);

    function mapTicket(t: any, reason: string) {
      const alias = (t.aliasId as any);
      const aliasLabel = alias?.localPart ? `${alias.localPart}@` : alias?.email ?? "—";

      let stuckFor = "—";
      if (reason === "no_response") {
        stuckFor = formatDuration(now.getTime() - new Date(t.receivedAt).getTime());
      } else if (reason === "agent_inactive") {
        stuckFor = formatDuration(now.getTime() - new Date(t.claimedAt).getTime());
      } else if (reason === "waiting_too_long") {
        stuckFor = formatDuration(now.getTime() - new Date(t.statusUpdatedAt).getTime());
      }

      const receivedAt = new Date(t.receivedAt);
      const diff = now.getTime() - receivedAt.getTime();
      let receivedLabel = "";
      if (diff < 24 * 60 * 60 * 1000) {
        receivedLabel = `Today, ${receivedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
      } else if (diff < 48 * 60 * 60 * 1000) {
        receivedLabel = `Yesterday, ${receivedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
      } else {
        receivedLabel = receivedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
      }

      return {
        id:         t._id.toString(),
        fromName:   t.fromName || t.from.split("@")[0],
        fromEmail:  t.from,
        subject:    t.subject,
        alias:      aliasLabel,
        status:     t.status,
        assignedTo: t.assignedToName ?? null,
        reason,
        stuckFor,
        receivedAt: receivedLabel,
      };
    }

    const tickets = [
      ...noResponse.map((t) => mapTicket(t, "no_response")),
      ...agentInactive.map((t) => mapTicket(t, "agent_inactive")),
      ...waitingTooLong.map((t) => mapTicket(t, "waiting_too_long")),
    ].slice(0, 20);

    return NextResponse.json(tickets);
  } catch (err) {
    console.error("[dashboard/needs-attention]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
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

    // Resolve alias IDs
    let aliasIds: string[] = [];
    if (aliasId !== "all") {
      aliasIds = [aliasId];
    } else if (domainId !== "all") {
      const aliases = await Alias.find({ workspaceId: wid, domainId }).select("_id").lean();
      aliasIds = aliases.map((a: any) => a._id.toString());
    }

    const aliasFilter = aliasIds.length > 0 ? { aliasId: { $in: aliasIds } } : {};

    const days = range === "7d" ? 7 : range === "14d" ? 14 : 30;
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Build per-day buckets
    const result: { date: string; incoming: number; resolved: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const label = dayStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const [incoming, resolved] = await Promise.all([
        EmailThread.countDocuments({
          workspaceId: wid,
          ...aliasFilter,
          direction: "inbound",
          receivedAt: { $gte: dayStart, $lte: dayEnd },
        }),
        EmailThread.countDocuments({
          workspaceId: wid,
          ...aliasFilter,
          status: "resolved",
          resolvedAt: { $gte: dayStart, $lte: dayEnd },
        }),
      ]);

      result.push({ date: label, incoming, resolved });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[dashboard/volume]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

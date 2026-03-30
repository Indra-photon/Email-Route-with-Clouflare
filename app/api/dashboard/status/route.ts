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

    // Resolve alias IDs
    let aliasIds: string[] = [];
    if (aliasId !== "all") {
      aliasIds = [aliasId];
    } else if (domainId !== "all") {
      const aliases = await Alias.find({ workspaceId: wid, domainId }).select("_id").lean();
      aliasIds = aliases.map((a: any) => a._id.toString());
    }

    const aliasFilter = aliasIds.length > 0 ? { aliasId: { $in: aliasIds } } : {};
    const base = { workspaceId: wid, ...aliasFilter };

    const [open, inProgress, waiting, resolved] = await Promise.all([
      EmailThread.countDocuments({ ...base, status: "open" }),
      EmailThread.countDocuments({ ...base, status: "in_progress" }),
      EmailThread.countDocuments({ ...base, status: "waiting" }),
      EmailThread.countDocuments({ ...base, status: "resolved" }),
    ]);

    return NextResponse.json([
      { label: "Open",        value: open,       colour: "#075985", bg: "bg-sky-800"     },
      { label: "In Progress", value: inProgress,  colour: "#FCD34D", bg: "bg-amber-300"  },
      { label: "Waiting",     value: waiting,     colour: "#E5E7EB", bg: "bg-gray-200"   },
      { label: "Resolved",    value: resolved,    colour: "#10B981", bg: "bg-emerald-500" },
    ]);
  } catch (err) {
    console.error("[dashboard/status]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

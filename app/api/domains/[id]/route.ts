import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Domain } from "@/app/api/models/DomainModel";
import { Alias } from "@/app/api/models/AliasModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Domain id is required" }, { status: 400 });
    }

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();
    const domain = await Domain.findOne({
      _id: id,
      workspaceId: workspace._id,
    }).lean();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: domain._id.toString(),
      domain: domain.domain,
      status: domain.status,
      verifiedForSending: domain.verifiedForSending,
      verifiedForReceiving: domain.verifiedForReceiving,
      resendDomainId: domain.resendDomainId,
      dnsRecords: domain.dnsRecords || [],
      receivingEnabled: domain.receivingEnabled || false,
      receivingEnabledAt: domain.receivingEnabledAt || null,
      receivingMxRecords: domain.receivingMxRecords || [],
      lastCheckedAt: domain.lastCheckedAt,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  } catch (err) {
    console.error("Get domain error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/domains/[id] — remove domain and its aliases
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    const domain = await Domain.findOneAndDelete({
      _id: id,
      workspaceId: workspace._id,
    });

    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // Cascade delete aliases for this domain
    await Alias.deleteMany({ domainId: id, workspaceId: workspace._id });

    return NextResponse.json({ success: true, message: "Domain deleted" });
  } catch (err) {
    console.error("Delete domain error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

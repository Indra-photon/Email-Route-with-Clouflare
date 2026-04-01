import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Domain } from "@/app/api/models/DomainModel";
import { Alias } from "@/app/api/models/AliasModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/domains/[id]
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
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/domains/[id] — remove from Resend first, then from DB
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    const domain = await Domain.findOne({ _id: id, workspaceId: workspace._id });

    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // ── Step 1: Remove from Resend (if it was ever added) ─────────────────
    if (domain.resendDomainId) {
      try {
        const { error: resendError } = await resend.domains.remove(domain.resendDomainId);
        if (resendError) {
          console.warn(`⚠️ Resend domain remove failed for ${domain.domain}:`, resendError.message);
        } else {
          console.log(`✅ Removed domain from Resend: ${domain.domain} (${domain.resendDomainId})`);
        }
      } catch (e) {
        // Non-fatal — still clean up our DB
        console.warn(`⚠️ Resend domain remove threw for ${domain.domain}:`, e);
      }
    }

    // ── Step 2: Delete from MongoDB ────────────────────────────────────────
    await Domain.findByIdAndDelete(id);
    await Alias.deleteMany({ domainId: id, workspaceId: workspace._id });

    return NextResponse.json({ success: true, message: "Domain deleted" });
  } catch (err) {
    console.error("Delete domain error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

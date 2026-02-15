import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Domain } from "@/app/api/models/DomainModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { domainId } = body as { domainId?: string };
    if (!domainId) {
      return NextResponse.json(
        { error: "domainId is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();
    const domain = await Domain.findOne({
      _id: domainId,
      workspaceId: workspace._id,
    }).lean();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    if (!domain.resendDomainId) {
      return NextResponse.json(
        { error: "Domain not yet added to Resend. Add domain first." },
        { status: 400 }
      );
    }

    const { data: resendData, error: resendError } = await resend.domains.get(
      domain.resendDomainId
    );

    if (resendError) {
      const message = resendError.message || "Resend API error";
      return NextResponse.json(
        { error: message, details: resendError },
        { status: 500 }
      );
    }

    if (!resendData) {
      return NextResponse.json(
        { error: "Resend did not return domain data" },
        { status: 500 }
      );
    }

    const isVerified = resendData.status === "verified";
    const records = (resendData.records || []).map(
      (r: { record?: string; name?: string; type?: string; value?: string; status?: string; ttl?: string; priority?: number }) => ({
        record: r.record || "",
        name: r.name || "",
        type: r.type || "",
        value: r.value ?? "",
        status: r.status || "not_started",
        ttl: r.ttl,
        priority: r.priority,
      })
    );

    await Domain.findByIdAndUpdate(domainId, {
      status: isVerified ? "verified" : domain.status,
      verifiedForSending: isVerified,
      dnsRecords: records,
      lastCheckedAt: new Date(),
      ...(isVerified ? { verifiedForReceiving: true } : {}),
    });

    const updated = await Domain.findById(domainId).lean();
    return NextResponse.json({
      success: true,
      verified: isVerified,
      status: resendData.status,
      domain: updated
        ? {
            id: updated._id.toString(),
            domain: updated.domain,
            status: updated.status,
            verifiedForSending: updated.verifiedForSending,
            dnsRecords: updated.dnsRecords,
            lastCheckedAt: updated.lastCheckedAt,
          }
        : null,
    });
  } catch (err) {
    console.error("Check verification error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}

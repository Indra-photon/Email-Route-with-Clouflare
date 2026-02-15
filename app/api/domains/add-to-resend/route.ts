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
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    if (domain.resendDomainId) {
      return NextResponse.json(
        { error: "Domain already added to Resend", resendDomainId: domain.resendDomainId },
        { status: 400 }
      );
    }

    const { data: resendData, error: resendError } = await resend.domains.create({
      name: domain.domain,
    });

    if (resendError) {
      const message = resendError.message || "Resend API error";
      const status =
        message.toLowerCase().includes("already exists") ? 409 :
        message.toLowerCase().includes("invalid") ? 400 : 500;
      return NextResponse.json(
        { error: message, details: resendError },
        { status }
      );
    }

    if (!resendData?.id) {
      return NextResponse.json(
        { error: "Resend did not return domain id" },
        { status: 500 }
      );
    }

    const records = (resendData.records || []).map((r: { record?: string; name?: string; type?: string; value?: string; status?: string; ttl?: string; priority?: number }) => ({
      record: r.record || "",
      name: r.name || "",
      type: r.type || "",
      value: r.value ?? "",
      status: r.status || "not_started",
      ttl: r.ttl,
      priority: r.priority,
    }));

    await Domain.findByIdAndUpdate(domainId, {
      resendDomainId: resendData.id,
      dnsRecords: records,
      lastCheckedAt: new Date(),
    });

    const updated = await Domain.findById(domainId).lean();
    return NextResponse.json({
      success: true,
      resendDomainId: resendData.id,
      domain: updated
        ? {
            id: updated._id.toString(),
            domain: updated.domain,
            status: updated.status,
            resendDomainId: updated.resendDomainId,
            dnsRecords: updated.dnsRecords,
          }
        : null,
    });
  } catch (err) {
    console.error("Add to Resend error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}

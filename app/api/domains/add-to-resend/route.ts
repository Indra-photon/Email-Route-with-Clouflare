import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Domain } from "@/app/api/models/DomainModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { getSubscriptionGuard } from "@/lib/checkSubscriptionStatus";
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

    // ── Plan guard ────────────────────────────────────────────────────────────────
    const { isExpired, hasNoPlan } = await getSubscriptionGuard(workspace._id);
    if (hasNoPlan) {
      return NextResponse.json(
        { error: "You need an active plan to configure domains. Please purchase a plan.", upgradeRequired: true },
        { status: 403 }
      );
    }
    if (isExpired) {
      return NextResponse.json(
        { error: "Your plan has expired. Please renew to configure domains.", upgradeRequired: true },
        { status: 403 }
      );
    }
    // ──────────────────────────────────────────────────────────────────────────────

    if (domain.resendDomainId) {
      return NextResponse.json(
        { error: "Domain already added to Resend", resendDomainId: domain.resendDomainId },
        { status: 400 }
      );
    }

    // ── Step 1: Create domain on Resend ──────────────────────────────────
    console.log("📡 Creating domain on Resend:", domain.domain);
    const { data: resendData, error: resendError } = await resend.domains.create({
      name: domain.domain,
    });

    if (resendError) {
      const message = resendError.message || "Resend API error";
      console.log("❌ Resend API error:", message, resendError);
      
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

    console.log("✅ Domain created on Resend:", resendData.id);

    // Map sending DNS records from the create response
    const sendingRecords = (resendData.records || []).map(
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

    // ── Step 2: Immediately try to enable receiving capability ────────────
    let receivingEnabled = false;
    let receivingMxRecords: { type: string; name: string; value: string; priority: number; ttl: string }[] = [];

    console.log("📬 Attempting to enable receiving on newly created domain...");
    try {
      const { error: updateError } = await resend.domains.update({
        id: resendData.id,
        capabilities: { receiving: "enabled" },
      });

      if (updateError) {
        console.log("⚠️ Could not enable receiving yet (domain may need verification first):", updateError.message);
      } else {
        console.log("✅ Receiving capability enabled. Fetching MX records...");

        // Small wait for Resend to generate receiving records
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Re-fetch domain to get receiving MX records
        const { data: refreshedData, error: refreshError } = await resend.domains.get(resendData.id);

        if (refreshError) {
          console.log("⚠️ Failed to fetch receiving records:", refreshError.message);
        } else if (refreshedData) {
          console.log("📦 Refreshed domain records:", {
            totalRecords: refreshedData.records?.length,
            records: refreshedData.records?.map((r: any) => ({
              record: r.record, type: r.type, name: r.name
            }))
          });

          // Extract receiving MX records (record type === "Receiving")
          const mx = (refreshedData.records || [])
            .filter((r: any) => r.record === "Receiving")
            .map((r: any) => ({
              type: r.type || "MX",
              name: r.name || "",
              value: r.value || "",
              priority: r.priority || 10,
              ttl: r.ttl || "Auto",
            }));

          if (mx.length > 0) {
            receivingEnabled = true;
            receivingMxRecords = mx;
            console.log("✅ Receiving MX records captured immediately:", mx);
          } else {
            // Receiving was enabled but no MX records yet — still mark enabled
            receivingEnabled = true;
            console.log("⚠️ Receiving enabled but no MX records returned yet. Will be fetched on Check Verification.");
          }

          // Also merge any new records from the refreshed data into sendingRecords
          const refreshedSending = (refreshedData.records || [])
            .filter((r: any) => r.record !== "Receiving")
            .map((r: any) => ({
              record: r.record || "",
              name: r.name || "",
              type: r.type || "",
              value: r.value ?? "",
              status: r.status || "not_started",
              ttl: r.ttl,
              priority: r.priority,
            }));
          if (refreshedSending.length > 0) {
            sendingRecords.length = 0;
            sendingRecords.push(...refreshedSending);
          }
        }
      }
    } catch (receivingError) {
      console.error("⚠️ Error enabling receiving (non-fatal):", receivingError);
      // Don't fail — sending records were already obtained
    }

    // ── Step 3: Save everything to DB ────────────────────────────────────
    console.log("💾 Saving to DB:", {
      resendDomainId: resendData.id,
      sendingRecords: sendingRecords.length,
      receivingEnabled,
      receivingMxRecords: receivingMxRecords.length,
    });

    await Domain.findByIdAndUpdate(domainId, {
      resendDomainId: resendData.id,
      dnsRecords: sendingRecords,
      lastCheckedAt: new Date(),
      ...(receivingEnabled ? {
        receivingEnabled: true,
        receivingEnabledAt: new Date(),
        receivingMxRecords,
      } : {}),
    });

    const updated = await Domain.findById(domainId).lean();
    return NextResponse.json({
      success: true,
      resendDomainId: resendData.id,
      receivingEnabled,
      receivingMxRecordsCount: receivingMxRecords.length,
      domain: updated
        ? {
          id: updated._id.toString(),
          domain: updated.domain,
          status: updated.status,
          resendDomainId: updated.resendDomainId,
          dnsRecords: updated.dnsRecords,
          receivingEnabled: updated.receivingEnabled,
          receivingMxRecords: updated.receivingMxRecords,
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

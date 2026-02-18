// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import dbConnect from "@/lib/dbConnect";
// import { Domain } from "@/app/api/models/DomainModel";
// import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: Request) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     const { domainId } = body as { domainId?: string };
//     if (!domainId) {
//       return NextResponse.json(
//         { error: "domainId is required" },
//         { status: 400 }
//       );
//     }

//     await dbConnect();
//     const workspace = await getOrCreateWorkspaceForCurrentUser();
//     const domain = await Domain.findOne({
//       _id: domainId,
//       workspaceId: workspace._id,
//     }).lean();

//     if (!domain) {
//       return NextResponse.json(
//         { error: "Domain not found" },
//         { status: 404 }
//       );
//     }

//     if (!domain.resendDomainId) {
//       return NextResponse.json(
//         { error: "Domain not yet added to Resend. Add domain first." },
//         { status: 400 }
//       );
//     }

//     const { data: resendData, error: resendError } = await resend.domains.get(
//       domain.resendDomainId
//     );

//     if (resendError) {
//       const message = resendError.message || "Resend API error";
//       return NextResponse.json(
//         { error: message, details: resendError },
//         { status: 500 }
//       );
//     }

//     if (!resendData) {
//       return NextResponse.json(
//         { error: "Resend did not return domain data" },
//         { status: 500 }
//       );
//     }

//     const isVerified = resendData.status === "verified";
//     const records = (resendData.records || []).map(
//       (r: { record?: string; name?: string; type?: string; value?: string; status?: string; ttl?: string; priority?: number }) => ({
//         record: r.record || "",
//         name: r.name || "",
//         type: r.type || "",
//         value: r.value ?? "",
//         status: r.status || "not_started",
//         ttl: r.ttl,
//         priority: r.priority,
//       })
//     );

//     await Domain.findByIdAndUpdate(domainId, {
//       status: isVerified ? "verified" : domain.status,
//       verifiedForSending: isVerified,
//       dnsRecords: records,
//       lastCheckedAt: new Date(),
//       ...(isVerified ? { verifiedForReceiving: true } : {}),
//     });

//     const updated = await Domain.findById(domainId).lean();
//     return NextResponse.json({
//       success: true,
//       verified: isVerified,
//       status: resendData.status,
//       domain: updated
//         ? {
//             id: updated._id.toString(),
//             domain: updated.domain,
//             status: updated.status,
//             verifiedForSending: updated.verifiedForSending,
//             dnsRecords: updated.dnsRecords,
//             lastCheckedAt: updated.lastCheckedAt,
//           }
//         : null,
//     });
//   } catch (err) {
//     console.error("Check verification error:", err);
//     return NextResponse.json(
//       { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown" },
//       { status: 500 }
//     );
//   }
// }


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

    console.log("🔍 Check verification requested for domain ID:", domainId);

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();
    const domain = await Domain.findOne({
      _id: domainId,
      workspaceId: workspace._id,
    }).lean();

    if (!domain) {
      console.log("❌ Domain not found");
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    console.log("📋 Found domain:", {
      domain: domain.domain,
      resendDomainId: domain.resendDomainId,
      currentStatus: domain.status
    });

    if (!domain.resendDomainId) {
      console.log("❌ Domain not added to Resend yet");
      return NextResponse.json(
        { error: "Domain not yet added to Resend. Add domain first." },
        { status: 400 }
      );
    }

    console.log("📊 Calling Resend API for domain:", domain.resendDomainId);

    // First, trigger verification check
    console.log("🔍 Triggering Resend to verify DNS...");
    const { error: verifyError } = await resend.domains.verify(
      domain.resendDomainId
    );

    if (verifyError) {
      console.log("⚠️ Verify trigger error (might be normal):", verifyError);
    }

    // Wait for Resend to update (give it time to verify)
    console.log("⏳ Waiting 3 seconds for Resend to update...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Then get the updated status
    console.log("📊 Fetching updated domain status...");
    const { data: resendData, error: resendError } = await resend.domains.get(
      domain.resendDomainId
    );

    if (resendError) {
      console.log("❌ Resend API error:", resendError);
      const message = resendError.message || "Resend API error";
      return NextResponse.json(
        { error: message, details: resendError },
        { status: 500 }
      );
    }

    if (!resendData) {
      console.log("❌ Resend returned no data");
      return NextResponse.json(
        { error: "Resend did not return domain data" },
        { status: 500 }
      );
    }

    console.log("📦 Resend API response:", {
      status: resendData.status,
      capabilities: (resendData as any).capabilities,
      recordCount: resendData.records?.length,
      records: resendData.records?.map((r: any) => ({
        record: r.record,
        name: r.name,
        type: r.type,
        status: r.status
      }))
    });

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

    console.log("🔄 Mapped records for DB:", records.map((r: any) => ({
      record: r.record,
      status: r.status
    })));

    // ─── AUTO-ENABLE RECEIVING ───────────────────────────────────────────
    // If the domain is verified AND receiving is not yet enabled,
    // automatically enable it via the Resend API — no admin needed!
    let receivingEnabled = domain.receivingEnabled || false;
    let receivingMxRecords = domain.receivingMxRecords || [];
    let receivingAutoEnabled = false;

    if (isVerified && !domain.receivingEnabled) {
      console.log("📬 Domain verified! Auto-enabling receiving via Resend API...");

      try {
        // Step 1: Enable receiving capability on Resend
        const { data: updateData, error: updateError } = await resend.domains.update({
          id: domain.resendDomainId,
          capabilities: { receiving: "enabled" },
        });

        if (updateError) {
          console.log("⚠️ Failed to enable receiving:", updateError);
          // Don't fail the whole request — verification still succeeded
        } else {
          console.log("✅ Receiving enabled on Resend:", updateData);

          // Step 2: Wait a moment for Resend to generate the receiving MX records
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Step 3: Re-fetch domain to get the receiving MX records
          const { data: refreshedData, error: refreshError } = await resend.domains.get(
            domain.resendDomainId
          );

          if (refreshError) {
            console.log("⚠️ Failed to refetch domain after enabling receiving:", refreshError);
          } else if (refreshedData) {
            console.log("📦 Refreshed Resend data after enabling receiving:", {
              capabilities: (refreshedData as any).capabilities,
              recordCount: refreshedData.records?.length,
              records: refreshedData.records?.map((r: any) => ({
                record: r.record,
                name: r.name,
                type: r.type,
                priority: r.priority,
              }))
            });

            // Extract receiving MX records (record type = "Receiving")
            const receivingRecords = (refreshedData.records || [])
              .filter((r: any) => r.record === "Receiving")
              .map((r: any) => ({
                type: r.type || "MX",
                name: r.name || "",
                value: r.value || "",
                priority: r.priority || 10,
                ttl: r.ttl || "Auto",
              }));

            if (receivingRecords.length > 0) {
              receivingEnabled = true;
              receivingMxRecords = receivingRecords;
              receivingAutoEnabled = true;
              console.log("✅ Receiving MX records captured:", receivingRecords);
            } else {
              console.log("⚠️ No receiving records found after enabling. Capabilities may need time.");
              // Still mark as enabled since the API call succeeded
              receivingEnabled = true;
              receivingAutoEnabled = true;
            }

            // Also update the main DNS records with the refreshed data
            const refreshedRecords = (refreshedData.records || []).map(
              (r: any) => ({
                record: r.record || "",
                name: r.name || "",
                type: r.type || "",
                value: r.value ?? "",
                status: r.status || "not_started",
                ttl: r.ttl,
                priority: r.priority,
              })
            );
            // Use refreshed records (which now include receiving records)
            records.length = 0;
            records.push(...refreshedRecords);
          }
        }
      } catch (receivingError) {
        console.error("⚠️ Error auto-enabling receiving:", receivingError);
        // Don't fail the overall verification check
      }
    }

    console.log("💾 Updating database...");

    await Domain.findByIdAndUpdate(domainId, {
      status: isVerified ? "verified" : domain.status,
      verifiedForSending: isVerified,
      dnsRecords: records,
      lastCheckedAt: new Date(),
      ...(isVerified ? { verifiedForReceiving: true } : {}),
      // Auto-receiving fields
      ...(receivingAutoEnabled ? {
        receivingEnabled: true,
        receivingEnabledAt: new Date(),
        receivingMxRecords: receivingMxRecords,
      } : {}),
    });

    console.log("✅ Database updated successfully");
    console.log("📝 Updated domain:", {
      id: domainId,
      status: isVerified ? "verified" : domain.status,
      verifiedForSending: isVerified,
      receivingEnabled: receivingEnabled,
      receivingMxRecords: receivingMxRecords.length,
      recordCount: records.length,
      recordStatuses: records.map((r: any) => ({ record: r.record, status: r.status }))
    });

    const updated = await Domain.findById(domainId).lean();
    return NextResponse.json({
      success: true,
      verified: isVerified,
      status: resendData.status,
      receivingAutoEnabled: receivingAutoEnabled,
      domain: updated
        ? {
          id: updated._id.toString(),
          domain: updated.domain,
          status: updated.status,
          verifiedForSending: updated.verifiedForSending,
          receivingEnabled: updated.receivingEnabled,
          receivingMxRecords: updated.receivingMxRecords,
          dnsRecords: updated.dnsRecords,
          lastCheckedAt: updated.lastCheckedAt,
        }
        : null,
    });
  } catch (err) {
    console.error("❌ Check verification error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}
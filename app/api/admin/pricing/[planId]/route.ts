import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import { PricingPlan } from "@/app/api/models/PricingPlanModel";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

async function assertAdmin(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  if (ADMIN_USER_IDS.length > 0 && !ADMIN_USER_IDS.includes(userId)) return null;
  return userId;
}

// PATCH /api/admin/pricing/[planId] — update a plan and revalidate pricing page
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  const userId = await assertAdmin();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await params;
  if (!["starter", "growth", "scale"].includes(planId)) {
    return NextResponse.json({ error: "Invalid planId" }, { status: 400 });
  }

  // ── Parse body safely ────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid or empty request body" }, { status: 400 });
  }

  await dbConnect();

  // ── Whitelist allowed fields to prevent schema injection ─────────────────────
  const allowedFields = [
    "name", "price", "description", "highlight", "ctaLabel",
    "dodoPriceId", "dodoPriceIdTest", "dodoPriceIdLive",
    "limits", "features", "sortOrder", "isVisible",
  ];
  const update: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) update[key] = body[key];
  }

  const updated = await PricingPlan.findOneAndUpdate(
    { id: planId },
    { $set: update },
    { returnDocument: "after", runValidators: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  // ── Revalidate ISR caches (fire-and-forget to avoid blocking the response) ───
  // Do NOT await — revalidatePath in dev is very slow (can take 30+ seconds)
  Promise.resolve().then(() => {
    try {
      revalidatePath("/pricing");
      revalidatePath("/");
      revalidatePath("/api/public/pricing");
    } catch (e) {
      console.warn("⚠️ revalidatePath failed (non-fatal):", e);
    }
  });

  console.log(`✅ Admin: pricing plan "${planId}" updated by ${userId}`);
  return NextResponse.json(updated);
}

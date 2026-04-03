import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { PricingPlan } from "@/app/api/models/PricingPlanModel";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

// POST /api/admin/pricing/migrate-ids
// One-time: copies existing dodoPriceId → dodoPriceIdTest for plans that have
// no dodoPriceIdTest set yet. Run once after deploying the new schema.
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (ADMIN_USER_IDS.length > 0 && !ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // Only migrate plans where dodoPriceIdTest is still empty but dodoPriceId is set
  const plans = await PricingPlan.find({
    dodoPriceId: { $ne: "" },
    $or: [
      { dodoPriceIdTest: { $exists: false } },
      { dodoPriceIdTest: "" },
    ],
  });

  const migrated: string[] = [];

  for (const plan of plans) {
    plan.dodoPriceIdTest = plan.dodoPriceId;  // copy existing test ID → dodoPriceIdTest
    if (!plan.dodoPriceIdLive) plan.dodoPriceIdLive = ""; // ensure field exists
    await plan.save();
    migrated.push(`${plan.id}: ${plan.dodoPriceId}`);
    console.log(`✅ Migrated plan "${plan.id}" → dodoPriceIdTest="${plan.dodoPriceId}"`);
  }

  return NextResponse.json({
    migrated: migrated.length,
    plans: migrated,
    message: migrated.length > 0
      ? `Migrated ${migrated.length} plan(s). Existing dodoPriceId copied to dodoPriceIdTest.`
      : "Nothing to migrate — all plans already have dodoPriceIdTest set.",
  });
}

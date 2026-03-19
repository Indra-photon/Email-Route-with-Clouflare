// lib/seedPricingPlans.ts
// Called once at startup (or from an admin route) when the PricingPlan collection is empty.
// Seeds the DB with the baseline values from constants/pricing.ts.

import { PricingPlan as PricingPlanModel } from "@/app/api/models/PricingPlanModel";
import { PRICING_PLANS_SEED } from "@/constants/pricing";

export async function seedPricingPlans(): Promise<void> {
  const count = await PricingPlanModel.countDocuments();
  if (count > 0) return; // already seeded

  console.log("🌱 Seeding pricing plans into MongoDB...");
  await PricingPlanModel.insertMany(
    PRICING_PLANS_SEED.map((plan) => ({
      ...plan,
      // Align -1 unlimited values for the schema
      limits: plan.limits,
    }))
  );
  console.log("✅ Pricing plans seeded.");
}

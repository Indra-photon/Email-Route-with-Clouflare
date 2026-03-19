import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { PricingPlan } from "@/app/api/models/PricingPlanModel";
import { seedPricingPlans } from "@/lib/seedPricingPlans";

// GET /api/public/pricing — unauthenticated, used by the pricing page (ISR-cached)
export async function GET() {
  try {
    await dbConnect();
    await seedPricingPlans();

    const plans = await PricingPlan.find({ isVisible: true })
      .sort({ sortOrder: 1 })
      .select("-dodoPriceId") // never expose Dodo price IDs to the public
      .lean();

    return NextResponse.json(plans, {
      headers: {
        // Allow Next.js ISR to cache this for 60s; CDN caches for 5 min
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("❌ Public pricing fetch error:", error);
    return NextResponse.json({ error: "Failed to load pricing" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import { PricingPlan } from "@/app/api/models/PricingPlanModel";
import { seedPricingPlans } from "@/lib/seedPricingPlans";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

async function assertAdmin(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  if (ADMIN_USER_IDS.length > 0 && !ADMIN_USER_IDS.includes(userId)) return null;
  return userId;
}

// GET /api/admin/pricing — list all plans (admin only)
export async function GET() {
  const userId = await assertAdmin();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  await seedPricingPlans();

  const plans = await PricingPlan.find().sort({ sortOrder: 1 }).lean();
  return NextResponse.json({
    dodoEnv: process.env.DODO_ENV ?? "test",
    plans,
  });
}

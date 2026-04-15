import React from 'react'
import { PricingTableSection } from './PricingTableSection'
import { KeyFeaturesSection } from './KeyFeaturesSection'
import { ComparisonTableSection } from './ComparisonTableSection'
import dbConnect from '@/lib/dbConnect'
import { PricingPlan } from '@/app/api/models/PricingPlanModel'
import { seedPricingPlans } from '@/lib/seedPricingPlans'
import { Footer } from '@/components/Footer'

async function page() {
  await dbConnect()
  await seedPricingPlans()

  const plans = await PricingPlan.find({ isVisible: true })
    .sort({ sortOrder: 1 })
    .select('-dodoPriceId')
    .lean()

  return (
    <div>
        <PricingTableSection plans={JSON.parse(JSON.stringify(plans))} />
        {/* <KeyFeaturesSection /> */}
        <ComparisonTableSection />
        <Footer />
    </div>
  )
}

export default page
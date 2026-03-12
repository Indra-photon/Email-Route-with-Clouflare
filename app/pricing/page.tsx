import React from 'react'
import { PricingTableSection } from './PricingTableSection'
import { KeyFeaturesSection } from './KeyFeaturesSection'
import { ComparisonTableSection } from './ComparisonTableSection'

function page() {
  return (
    <div>
        <PricingTableSection />
        <KeyFeaturesSection />
        <ComparisonTableSection />
    </div>
  )
}

export default page
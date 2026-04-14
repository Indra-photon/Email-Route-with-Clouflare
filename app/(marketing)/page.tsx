import { Container } from "@/components/Container";
import Image from "next/image";
import { HeroSection } from "./Homepage/HeroSection";
import { SectionSeparator } from "./Homepage/SectionSeparator";
import { BenefitsSection } from "./Homepage/BenefitsSection";
import { FeaturesSection } from "./Homepage/FeaturesSection";
import { PerfectForSection } from "./Homepage/PerfectForSection";
import { TestimonialsSection } from "./Homepage/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { HowItWorksSection } from "./Homepage/HowItWorksSection";
import { WhySlackDeskSection } from "./Homepage/WhySlackDeskSection";
import { DashboardShowcaseSection } from "./Homepage/DashboardShowcaseSection";
import { OnboardingStepsSection } from "./Homepage/OnboardingStepsSection";

export default function Home() {
  return (
    <div className="">
      <section className="flex flex-col gap-24">
        <HeroSection />
        <BenefitsSection />
        {/* <FeaturesSection /> */}
        <DashboardShowcaseSection />
        <WhySlackDeskSection />
        <OnboardingStepsSection />
        {/* <TestimonialsSection /> */}
        <FAQSection />
        <Footer />
      </section>
    </div>
  );
}

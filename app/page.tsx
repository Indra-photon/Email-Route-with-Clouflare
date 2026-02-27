import { Container } from "@/components/Container";
import Image from "next/image";
import { HeroSection } from "./Homepage/HeroSection";
import { SectionSeparator } from "./Homepage/SectionSeparator";
import { BenefitsSection } from "./Homepage/BenefitsSection";
import { FeaturesSection } from "./Homepage/FeaturesSection";
import { TestimonialsSection } from "./Homepage/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="">
      <section>
        <HeroSection />
        {/* <SectionSeparator /> */}
        <BenefitsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />

      </section>
      
    </div>
  );
}

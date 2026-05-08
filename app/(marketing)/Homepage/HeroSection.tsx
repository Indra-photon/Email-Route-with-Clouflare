"use client";

import React, { useState } from "react";
import { Heading } from "@/components/Heading";
import { EmailSlackIllustration } from "./EmailSlackIllustration";
import { AnimatePresence, motion } from "motion/react";
import { WebsiteChatIllustration } from "./WebsiteChatIllustration";
import { Container } from "@/components/Container";
import { Paragraph } from "@/components/Paragraph";
import { LiveTeamJoin } from "./LiveTeamJoin";
import HeroCTAPrimary, { HeroCTASecondary } from "@/components/HeroCTAPrimary";
import CTAWrapper from "@/components/CTAWrapper";
import { FeatureTabs } from "./FeatureTabs";
import { VideoHero } from "./VideoHero";

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabId = "email" | "chat";

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="w-full bg-white">
      {/* ── Hero content ──────────────────────────────────────────────────── */}
      <Container className="px-4 pt-10 pb-5 md:px-0 md:pt-20 md:pb-10">
        <div className="flex flex-col lg:flex-row lg:gap-12">
          {/* Heading — 3/5 width on desktop */}
          <div className="lg:w-3/5">
            <Heading as="h1" className="text-neutral-900 leading-tight">
              <span>Handle Customer Support</span>
              <span className="block text-sky-800 font-schibsted font-extralight">
                Inside Slack. Answer customers. Track tickets. Close faster.
              </span>
            </Heading>
          </div>

          {/* Subheading + CTAs + Social proof — 2/5 width on desktop */}
          <div className="lg:w-2/5 mt-6 lg:mt-0 flex flex-col justify-center sm:pt-10">
            <Paragraph variant="home-par" className="mb-8">
              SyncSupport brings your entire customer support workflow into
              Slack, so your team can answer emails, manage tickets, and close
              issues without ever switching tools.
            </Paragraph>

            {/* CTA Buttons */}
            <div className="flex flex-row items-start gap-4">
              <CTAWrapper
                loggedInHref="/dashboard"
                loggedOutHref="/sign-up"
                loggedInText="Dashboard"
                loggedOutText="Get Started"
              >
                {({ text }) => <HeroCTAPrimary text={text} />}
              </CTAWrapper>
              <HeroCTASecondary />
            </div>
          </div>
        </div>
      </Container>

      <Container className="px-4 pb-10 md:px-0 md:pb-16">
        <VideoHero />
      </Container>

      <FeatureTabs />

      {/* ── Feature tabs ──────────────────────────────────────────────────── */}
    </section>
  );
}

"use client";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { DashboardLink } from "@/components/docs/DashboardLink";
import { Callout } from "@/components/docs/Callout";
import { DocsPage, DocsBody } from "fumadocs-ui/page";

/* ═══════════════════════════════════════════════════════════════
   1. CONTENT
   ═══════════════════════════════════════════════════════════════ */

const BOT_SETTINGS: { title: string; description: string }[] = [
  {
    title: "Bot Name",
    description:
      'The display name that appears in Slack when the bot posts a message. Instead of a generic label, it shows whatever you type here — e.g. "Acme Support" or "Billing Bot". This name appears at the top of every message the bot posts.',
  },
  {
    title: "Bot Avatar",
    description:
      "The profile picture of the bot in Slack. Upload a JPG, PNG, GIF, or WebP image (max 2 MB). When the bot posts a message, that image appears as its profile photo. If you don't upload anything, Slack uses a default icon.",
  },
  {
    title: "Bot Description",
    description:
      "A short line of text that appears below the email header in every Slack message the bot posts — shown as small italic grey text. Gives your team context about which domain or purpose this bot serves.",
  },
];

const BLANK_FIELDS: { title: string; description: string }[] = [
  {
    title: "No bot name",
    description: "Slack uses the default name set in your Slack app settings.",
  },
  {
    title: "No avatar",
    description: "Slack uses the default icon for the integration.",
  },
  {
    title: "No description",
    description:
      "No context line appears in the message, which is perfectly fine.",
  },
];

const STEPS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "go-to-customize",
    title: "Go to Customize App",
    body: (
      <Paragraph variant="docs-par">
        From the dashboard, navigate to{" "}
        <DashboardLink
          href="/dashboard/customize-app"
          className="text-sky-800 hover:text-sky-900 underline"
        >
          Dashboard → Customize App
        </DashboardLink>{" "}
        from the sidebar. You'll see a tab bar at the top listing all your
        verified domains.
      </Paragraph>
    ),
  },
  {
    id: "select-domain",
    title: "Select a domain",
    body: (
      <Paragraph variant="docs-par">
        Pick the domain you want to brand from the tab bar. Each domain has its
        own independent bot settings — so{" "}
        <Highlight>support.acme.com</Highlight> and{" "}
        <Highlight>billing.acme.com</Highlight> can each have a different bot
        name, avatar, and description.
      </Paragraph>
    ),
  },
  {
    id: "fill-settings",
    title: "Fill in the bot settings",
    body: (
      <Paragraph variant="docs-par">
        Enter a <Highlight>Bot Name</Highlight>, upload a{" "}
        <Highlight>Bot Avatar</Highlight> image (JPG, PNG, GIF, or WebP — max 2
        MB), and optionally type a <Highlight>Bot Description</Highlight>. All
        three fields are optional — leave any blank to use Slack's defaults.
      </Paragraph>
    ),
  },
  {
    id: "save-changes",
    title: "Click Save Changes",
    body: (
      <Paragraph variant="docs-par">
        Click <Highlight>Save Changes</Highlight>. From that moment on, every
        email notification posted to Slack for that domain will display your
        custom bot name, avatar, and description instead of the generic webhook
        defaults.
      </Paragraph>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════════
   2. PRIMITIVES
   ═══════════════════════════════════════════════════════════════ */

function StepBadge({ n }: { n: number }) {
  return (
    <span className="relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-800 to-cyan-700 border-2 border-sky-100 text-white text-sm font-bold font-schibsted flex-shrink-0 select-none">
      {n}
    </span>
  );
}

function StepCard({
  step,
  id,
  title,
  children,
}: {
  step: number;
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="flex gap-4 items-start mb-4">
      <div className="pt-3">
        <StepBadge n={step} />
      </div>
      <div
        className="flex-1 rounded-xl overflow-hidden"
        style={{
          boxShadow:
            "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)",
        }}
      >
        <div className="px-4 py-2.5 bg-gradient-to-r from-sky-800 to-cyan-700">
          <span className="font-schibsted font-light text-white text-[18px] tracking-wide">
            {title}
          </span>
        </div>
        <div className="px-5 py-3.5 text-sm text-neutral-700 font-schibsted leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-schibsted font-semibold uppercase tracking-wide text-neutral-900 text-lg mb-1"
    >
      {children}
    </h2>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function CustomizeAppPage() {
  let globalStep = 0;

  return (
    <DocsPage
      toc={[
        { title: "What is this page?", url: "#what-is-this", depth: 2 },
        { title: "The three settings", url: "#three-settings", depth: 3 },
        { title: "How to customize", url: "#how-to-customize", depth: 3 },
        { title: "If fields are left blank", url: "#blank-fields", depth: 3 },
      ]}
      tableOfContent={{ style: "clerk" }}
    >
      <DocsBody className="prose prose-neutral max-w-none">
        {/* ── Header ── */}
        <div className="mb-8">
          <Heading
            as="h1"
            className="!text-white !text-2xl !sm:text-2xl !md:text-3xl !lg:text-4xl !xl:text-5xl
              inset-shadow-sm inset-shadow-black/70 text-shadow-3xl bg-gradient-to-b from-sky-800 to-cyan-700 mb-4
              rounded-lg px-4 py-2"
          >
            Customize App
          </Heading>
          <Paragraph
            variant="home-par"
            className="text-neutral-600 font-schibsted leading-relaxed tracking-tighter"
          >
            Give your Slack bot a name, profile picture, and description — per
            domain. Instead of a generic webhook, your team sees a branded bot
            identity every time a customer email arrives.
          </Paragraph>
        </div>

        {/* ── What is this page ── */}
        <div className="mb-8" id="what-is-this">
          <Callout type="info" title="What is this page?">
            The Customize App page lets you control how the Slack bot looks when
            it posts email notifications into your channels. Settings are{" "}
            <strong>per domain</strong> — so each domain you manage can have its
            own bot name, avatar, and description.
          </Callout>
        </div>

        {/* ── Three settings ── */}
        <div className="mb-10">
          <SectionHeading id="three-settings">
            The three settings
          </SectionHeading>
          <Paragraph variant="docs-subPar" className="mb-5">
            Each setting controls a different part of how the bot appears in
            Slack.
          </Paragraph>

          <div className="space-y-3 not-prose">
            {BOT_SETTINGS.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3"
              >
                <p className="font-schibsted font-semibold tracking-tighter text-sm text-sky-800 mb-0.5">
                  {title}
                </p>
                <Paragraph variant="docs-par" className="mb-0">
                  {description}
                </Paragraph>
              </div>
            ))}
          </div>
        </div>

        {/* ── Description note ── */}
        <div className="mb-10">
          <Callout type="info" title="About bot description">
            The description now shows directly inside every Slack message as a
            small italic grey context line below the email header — it is
            visible to your whole team, not internal only.
          </Callout>
        </div>

        {/* ── How to customize ── */}
        <div className="mb-10">
          <SectionHeading id="how-to-customize">
            How to customize
          </SectionHeading>
          <Paragraph variant="docs-subPar" className="mb-5">
            Takes under a minute per domain.
          </Paragraph>

          <div className="relative not-prose">
            <div className="absolute left-[15px] top-10 bottom-4 w-px bg-gradient-to-b from-sky-800 to-cyan-100 z-0" />

            {STEPS.map((s, i) => {
              globalStep++;
              return (
                <StepCard key={i} step={globalStep} id={s.id} title={s.title}>
                  {s.body}
                </StepCard>
              );
            })}
          </div>
        </div>

        {/* ── Blank fields ── */}
        <div className="mb-12">
          <SectionHeading id="blank-fields">
            If fields are left blank
          </SectionHeading>
          <Paragraph variant="docs-subPar" className="mb-5">
            All three settings are optional — here's what happens when each is
            omitted.
          </Paragraph>

          <div className="space-y-3 not-prose">
            {BLANK_FIELDS.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3"
              >
                <p className="font-schibsted font-semibold tracking-tighter text-sm text-sky-800 mb-0.5">
                  {title}
                </p>
                <Paragraph variant="docs-par" className="mb-0">
                  {description}
                </Paragraph>
              </div>
            ))}
          </div>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

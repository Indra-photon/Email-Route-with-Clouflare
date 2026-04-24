"use client";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { DashboardLink } from "@/components/docs/DashboardLink";
import { Callout } from "@/components/docs/Callout";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { DocVideo } from "@/components/docs/DocVideo";

/* ═══════════════════════════════════════════════════════════════
   1. CONTENT — all raw data lives here, no JSX yet
   ═══════════════════════════════════════════════════════════════ */

const STEPS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "go-to-aliases",
    title: "Go to Aliases",
    body: (
      <Paragraph variant="docs-par">
        Once your domain is verified and at least one integration is connected,
        navigate to{" "}
        <DashboardLink
          href="/dashboard/aliases"
          className="text-sky-800 hover:text-sky-900 underline"
        >
          Dashboard → Aliases
        </DashboardLink>{" "}
        from the sidebar. This is where you map email addresses to Slack or
        Discord channels.
      </Paragraph>
    ),
  },
  {
    id: "click-add-alias",
    title: "Click Add Alias",
    body: (
      <Paragraph variant="docs-par">
        Click <Highlight>Add Alias</Highlight> to open the alias creation form.
        You can create as many aliases as you need — one per team, department,
        or workflow.
      </Paragraph>
    ),
  },
  {
    id: "select-domain",
    title: "Select your domain and enter the local part",
    body: (
      <Paragraph variant="docs-par">
        Select your verified domain from the dropdown. Then enter the local part
        of the email address — the part before the @. For example, enter{" "}
        <Highlight>support</Highlight> to create{" "}
        <Highlight>support@yourdomain.com</Highlight>, or{" "}
        <Highlight>sales</Highlight> to create{" "}
        <Highlight>sales@yourdomain.com</Highlight>. You can create as many
        local parts as you need (e.g., <Highlight>billing</Highlight>,{" "}
        <Highlight>hello</Highlight>, <Highlight>team</Highlight>).
      </Paragraph>
    ),
  },
  {
    id: "select-integration",
    title: "Select the target integration",
    body: (
      <Paragraph variant="docs-par">
        Choose which Slack integration this alias should route emails to. Each
        alias routes to exactly one channel. If you want to route different
        aliases to different channels, simply create multiple Slack integrations
        (one per channel) and select the appropriate one for each alias. If
        you're using Discord, select the target Discord integration instead.
      </Paragraph>
    ),
  },
  {
    id: "create-alias",
    title: "Click Create Alias",
    body: (
      <Paragraph variant="docs-par">
        Click <Highlight>Create Alias</Highlight> to save. Your alias is now
        live — any email sent to that address will immediately appear in the
        connected Slack or Discord channel. You can test it right away by
        sending a test email to the address you just created.
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

/* ═══════════════════════════════════════════════════════════════
   3. PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function AliasesPage() {
  let globalStep = 0;

  return (
    <DocsPage
      toc={[
        { title: "Prerequisites", url: "#prerequisites", depth: 2 },
        { title: "Go to Aliases", url: "#go-to-aliases", depth: 4 },
        { title: "Click Add Alias", url: "#click-add-alias", depth: 4 },
        { title: "Select your domain", url: "#select-domain", depth: 4 },
        {
          title: "Select the target integration",
          url: "#select-integration",
          depth: 4,
        },
        { title: "Click Create Alias", url: "#create-alias", depth: 4 },
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
            How to Create Email Aliases
          </Heading>
          <Paragraph
            variant="home-par"
            className="text-neutral-600 font-schibsted leading-relaxed tracking-tighter"
          >
            Map email addresses to Slack channels. Route{" "}
            <Highlight>support@</Highlight>, <Highlight>sales@</Highlight>,{" "}
            <Highlight>billing@</Highlight> and more to different teams — each
            email lands exactly where it needs to be.
          </Paragraph>

          <DocVideo
            url="https://youtu.be/-Z3luBBqEM8"
            label="Watch overview · 2 min"
          />
        </div>

        {/* ── Prerequisites ── */}
        <div className="mb-8" id="prerequisites">
          <Callout type="info" title="Before You Start">
            <ul className="list-none pl-0 space-y-1 text-sm">
              <li>
                Your domain must be added and verified.{" "}
                <CustomLink
                  href="/docs/domains"
                  className="text-sky-800 hover:text-sky-900 underline"
                >
                  How to add a domain
                </CustomLink>
              </li>
              <li>
                At least one integration (Slack or Discord) must be connected.{" "}
                <CustomLink
                  href="/docs/integrations"
                  className="text-sky-800 hover:text-sky-900 underline"
                >
                  How to set up an integration
                </CustomLink>
              </li>
            </ul>
          </Callout>
        </div>

        {/* ══ STEPS ══ */}
        <div className="relative mb-12">
          {/* Absolute vertical line behind all badges */}
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

      </DocsBody>
    </DocsPage>
  );
}

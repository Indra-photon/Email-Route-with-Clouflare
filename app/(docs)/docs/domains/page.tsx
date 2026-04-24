"use client";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { DashboardLink } from "@/components/docs/DashboardLink";
import { Callout } from "@/components/docs/Callout";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DocVideo } from "@/components/docs/DocVideo";

/* ═══════════════════════════════════════════════════════════════
   1. CONTENT — all raw data lives here, no JSX yet
   ═══════════════════════════════════════════════════════════════ */

// ── Section 1: Add Domain in Dashboard ──────────────────────────
const DASHBOARD_STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Add your domain",
    body: (
      <Paragraph variant="docs-par">
        After you sign in and navigate to the dashboard, select{" "}
        <DashboardLink
          href="/dashboard/domains"
          className="text-sky-800 hover:text-sky-900 underline"
        >
          Domains
        </DashboardLink>{" "}
        from the sidebar. Select the <Highlight>Add Domain</Highlight> tab,
        enter your domain name (e.g., <Highlight>acme.com</Highlight>), and
        click <Highlight>Add Domain</Highlight>.
      </Paragraph>
    ),
  },
  {
    title: "Retrieve MX records",
    body: (
      <Paragraph variant="docs-par">
        After you click <Highlight>Add domain</Highlight>, if successfull you
        will be redirected to <Highlight>Domains</Highlight> tab. There you will
        see all your listed domain. Click any domain card and click{" "}
        <Highlight>Add to Resend</Highlight>. This will register your domain and
        generate the MX records you need to add to your DNS provider. Make sure
        to copy the MX records from the modal — you'll need them next.
      </Paragraph>
    ),
  },
];

// ── Section 2: DNS provider sub-steps ───────────────────────────
type Provider = "cloudflare" | "godaddy" | "namecheap";

const PROVIDERS: { key: Provider; label: string }[] = [
  { key: "cloudflare", label: "Cloudflare" },
  { key: "godaddy", label: "GoDaddy" },
  { key: "namecheap", label: "Namecheap" },
];

const PROVIDER_STEPS: Record<
  Provider,
  { title: string; body: string; highlight?: string }[]
> = {
  cloudflare: [
    { title: "Log in", body: "Log in to your Cloudflare dashboard." },
    {
      title: "Select domain",
      body: "Click on the domain you want to configure.",
    },
    {
      title: "DNS Records",
      body: "Go to DNS → Records in the left navigation.",
      highlight: "DNS → Records",
    },
    { title: "Add record", body: "Click Add record.", highlight: "Add record" },
    {
      title: "Paste & save",
      body: "Paste the MX records copied from your dashboard into the appropriate fields and save.",
    },
  ],
  godaddy: [
    { title: "Log in", body: "Log in to your GoDaddy account." },
    {
      title: "My Products",
      body: "Go to My Products → Domains.",
      highlight: "My Products → Domains",
    },
    { title: "DNS", body: "Click DNS next to your domain.", highlight: "DNS" },
    {
      title: "MX Records",
      body: "Scroll to the MX Records section and click Add.",
      highlight: "Add",
    },
    {
      title: "Paste & save",
      body: "Paste the MX records copied from your dashboard and save changes.",
    },
  ],
  namecheap: [
    { title: "Log in", body: "Log in to your Namecheap account." },
    {
      title: "Domain List",
      body: "Go to Domain List → Manage.",
      highlight: "Domain List → Manage",
    },
    {
      title: "Advanced DNS",
      body: "Select Advanced DNS.",
      highlight: "Advanced DNS",
    },
    {
      title: "Mail Settings",
      body: "Locate Mail Settings.",
      highlight: "Mail Settings",
    },
    {
      title: "Paste & save",
      body: "Paste the MX records copied from your dashboard and save changes.",
    },
  ],
};

// ── Section 3: Verify ────────────────────────────────────────────
const VERIFY_STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Verify your MX records",
    body: (
      <Paragraph variant="docs-par">
        After adding MX records, verify your domain in the dashboard by clicking
        the <Highlight>Check Verification</Highlight> button. Make sure the
        status of every record changes to <Highlight>Verified</Highlight>.
      </Paragraph>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════════
   2. PRIMITIVES — tiny reusable UI pieces
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
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 items-start mb-4">
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
   3. PROVIDER TABS — animated provider switcher
   ═══════════════════════════════════════════════════════════════ */

function ProviderSteps() {
  const [active, setActive] = useState<Provider>("cloudflare");
  const steps = PROVIDER_STEPS[active];

  return (
    <div>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {PROVIDERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-3 py-1 rounded-md text-xs font-schibsted font-medium transition-all border ${
              active === key
                ? "bg-sky-50 border-sky-300 text-sky-800 shadow-sm"
                : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-sky-200 hover:text-sky-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {steps.map((s, i) => (
            <div key={i}>
              <div className="flex gap-3 items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold font-schibsted flex-shrink-0 mt-0.5 select-none">
                  {String.fromCharCode(97 + i)}
                </span>
                <div className="flex-1 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-700 font-schibsted">
                  <span className="font-semibold text-neutral-800">
                    {s.title} —{" "}
                  </span>
                  {s.highlight
                    ? s.body
                        .split(s.highlight)
                        .flatMap((part, pi, arr) =>
                          pi < arr.length - 1
                            ? [
                                part,
                                <Highlight key={pi}>{s.highlight}</Highlight>,
                              ]
                            : [part],
                        )
                    : s.body}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex gap-3">
                  <div className="flex justify-center w-6 flex-shrink-0">
                    <div
                      className="w-px bg-cyan-200"
                      style={{ minHeight: 10 }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. PAGE — renders everything via .map()
   ═══════════════════════════════════════════════════════════════ */

export default function DomainsPage() {
  let globalStep = 0;

  return (
    <DocsPage
      toc={[
        { title: "Prerequisites", url: "#prerequisites", depth: 2 },
        { title: "Add your domain", url: "#add-your-domain", depth: 4 },
        { title: "Retrieve MX records", url: "#retrieve-mx-records", depth: 4 },
        { title: "Paste MX records in DNS", url: "#configure-dns", depth: 4 },
        { title: "Verify your MX records", url: "#verify-domain", depth: 4 },
      ]}
      tableOfContent={{
        style: "clerk",
      }}
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
            How to Add and Configure Your Domain
          </Heading>
          <Paragraph
            variant="home-par"
            className="text-neutral-600 font-schibsted leading-relaxed tracking-tighter"
          >
            Configure your domain to receive and route emails through Email
            Router. Follow the steps below to add your domain, set up DNS
            records, and verify your configuration.
          </Paragraph>
        </div>

        <DocVideo
          url="https://youtu.be/-Z3luBBqEM8"
          label="Watch overview · 2 min"
        />

        {/* ── Prerequisites ── */}
        <div className="mb-8" id="prerequisites">
          <Callout type="info" title="Before You Start">
            <p className="text-sm">
              You need access to your domain's DNS settings through your DNS
              provider (Cloudflare, GoDaddy, Namecheap, etc.).
            </p>
          </Callout>
        </div>

        {/* ══ ALL STEPS — single relative wrapper, absolute line runs full height ══ */}
        <div className="relative mb-12">
          {/* Absolute vertical line behind all badges */}
          <div className="absolute left-[15px] top-10 bottom-4 w-px bg-gradient-to-b from-sky-800 to-cyan-100 z-0" />

          {/* ── Section 1: Dashboard steps ── */}
          {DASHBOARD_STEPS.map((s, i) => {
            globalStep++;
            const id =
              i === 0
                ? "add-your-domain"
                : i === 1
                  ? "retrieve-mx-records"
                  : undefined;
            return (
              <div key={`dashboard-${i}`}>
                {id && <div id={id} />}
                <StepCard step={globalStep} title={s.title}>
                  {s.body}
                </StepCard>
              </div>
            );
          })}

          {/* ── Section 2: DNS step (standalone) ── */}
          <div id="configure-dns" />
          {(() => {
            globalStep++;
            return (
              <StepCard
                key="dns"
                step={globalStep}
                title="Paste MX records in your DNS provider"
              >
                <Paragraph variant="docs-par">
                  Copy the MX records from the dashboard domain card and add
                  them to your DNS provider. There will be 4 records in total.
                </Paragraph>
                {/* <div className="mt-4">
                  <ProviderSteps />
                </div> */}
              </StepCard>
            );
          })()}

          {/* ── Section 3: Verify steps ── */}
          {VERIFY_STEPS.map((s, i) => {
            globalStep++;
            return (
              <div key={`verify-${i}`}>
                {i === 0 && <div id="verify-domain" />}
                <StepCard step={globalStep} title={s.title}>
                  {s.body}
                </StepCard>
              </div>
            );
          })}
        </div>
      </DocsBody>
    </DocsPage>
  );
}

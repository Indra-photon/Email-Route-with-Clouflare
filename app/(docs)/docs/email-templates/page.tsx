"use client";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { DashboardLink } from "@/components/docs/DashboardLink";
import { Callout } from "@/components/docs/Callout";
import { DocsPage, DocsBody } from "fumadocs-ui/page";

/* ═══════════════════════════════════════════════════════════════
   1. CONTENT
   ═══════════════════════════════════════════════════════════════ */

const VARIABLES: { placeholder: string; resolves: string }[] = [
  {
    placeholder: "{name}",
    resolves: 'Customer\'s name from the email (e.g. "Sarah")',
  },
  { placeholder: "{email}", resolves: "Customer's email address" },
  { placeholder: "{subject}", resolves: "The email subject line" },
  { placeholder: "{date}", resolves: "Date the email was received" },
  {
    placeholder: "{agent}",
    resolves: "Name of the Slack agent handling the ticket",
  },
];

const BODY_MODES: { title: string; description: string }[] = [
  {
    title: "Plain Text",
    description:
      "Write the reply in normal text. The entire message is shown to the agent in Slack and they can freely edit any part of it before sending.",
  },
  {
    title: "Editable HTML",
    description:
      "Write the email in HTML and wrap one section in a special tag pair. Only that wrapped section is editable in Slack — the rest is locked and sent exactly as written. Good for branded emails with one fillable paragraph.",
  },
  {
    title: "Static HTML",
    description:
      "Full HTML with no editable section. The entire email is sent exactly as written — no editing step in Slack. Good for fully standardised replies where nothing should change.",
  },
];

const STEPS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "go-to-templates",
    title: "Go to Email Templates",
    body: (
      <Paragraph variant="docs-par">
        Navigate to{" "}
        <DashboardLink
          href="/dashboard/email-templates"
          className="text-sky-800 hover:text-sky-900 underline"
        >
          Dashboard → Email Templates
        </DashboardLink>{" "}
        from the sidebar. This is where all your saved templates live.
      </Paragraph>
    ),
  },
  {
    id: "click-add-template",
    title: "Click Add Template",
    body: (
      <Paragraph variant="docs-par">
        Click <Highlight>Add Template</Highlight> to open the creation form.
        Give the template a name your team will recognise — for example{" "}
        <Highlight>Welcome Response</Highlight> or{" "}
        <Highlight>Refund Policy</Highlight>. This name is internal only and
        never shown to customers.
      </Paragraph>
    ),
  },
  {
    id: "write-subject-body",
    title: "Write the subject and body",
    body: (
      <Paragraph variant="docs-par">
        Enter an email subject — you can use{" "}
        <Highlight>{"{subject}"}</Highlight> here to auto-fill from the
        customer's original email. Then write the body using plain text or HTML.
        Add any placeholders you need (<Highlight>{"{name}"}</Highlight>,{" "}
        <Highlight>{"{agent}"}</Highlight>, etc.) and choose the appropriate
        body mode for your use case.
      </Paragraph>
    ),
  },
  {
    id: "create-template",
    title: "Click Create Template",
    body: (
      <Paragraph variant="docs-par">
        Click <Highlight>Create Template</Highlight> to save. Your template is
        now available to everyone on your team. When an agent replies to a
        ticket from Slack, they click <Highlight>Templates</Highlight>, pick
        this one, and the placeholders auto-fill with the customer's real data
        before sending.
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

export default function EmailTemplatesPage() {
  let globalStep = 0;

  return (
    <DocsPage
      toc={[
        { title: "What are templates?", url: "#what-are-templates", depth: 2 },
        { title: "Smart variables", url: "#smart-variables", depth: 3 },
        { title: "Body modes", url: "#body-modes", depth: 3 },
        {
          title: "How to create a template",
          url: "#create-template-steps",
          depth: 2,
        },
        { title: "Managing templates", url: "#managing-templates", depth: 3 },
        { title: "Plan requirement", url: "#plan-requirement", depth: 3 },
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
            How to Add Email Templates
          </Heading>
          <Paragraph
            variant="home-par"
            className="text-neutral-600 font-schibsted leading-relaxed tracking-tighter"
          >
            Create pre-written replies your team can reuse from Slack. Smart
            placeholders auto-fill with the customer's real data — so a
            polished, personalised response goes out in seconds instead of
            minutes.
          </Paragraph>
        </div>

        {/* ── What are templates ── */}
        <div className="mb-8" id="what-are-templates">
          <Callout type="info" title="What are templates?">
            Templates are saved email replies that live in your workspace. When
            an agent is handling a ticket from Slack, they click{" "}
            <Highlight>Templates</Highlight>, pick one, and the placeholders
            (like <Highlight>{"{name}"}</Highlight> or{" "}
            <Highlight>{"{subject}"}</Highlight>) automatically fill in with the
            customer's real data. The agent can then edit the editable section
            (if any) and hit send — the customer receives a normal email from
            your domain's address.
          </Callout>
        </div>

        {/* ── Smart variables ── */}
        <div className="mb-10">
          <SectionHeading id="smart-variables">Smart variables</SectionHeading>
          <Paragraph variant="docs-subPar" className="mb-5 ">
            Wrap these in your template subject or body. They're replaced with
            real values the moment an agent picks the template.
          </Paragraph>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose">
            {VARIABLES.map(({ placeholder, resolves }) => (
              <div
                key={placeholder}
                className="flex gap-3 items-start rounded-xl bg-white p-4"
                style={{
                  boxShadow:
                    "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)",
                }}
              >
                <code className="mt-0.5 flex-shrink-0 rounded-md bg-sky-50 px-2 py-0.5 font-mono text-sm font-semibold text-sky-800 border border-sky-100">
                  {placeholder}
                </code>
                <Paragraph variant="docs-par" className="mb-5 ">
                  {resolves}
                </Paragraph>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body modes ── */}
        <div className="mb-10">
          <SectionHeading id="body-modes">Body modes</SectionHeading>
          <Paragraph variant="docs-subPar" className="mb-5 ">
            Choose how much of the template is editable when an agent uses it in
            Slack.
          </Paragraph>

          <div className="space-y-3 not-prose">
            {BODY_MODES.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3"
              >
                <p className="font-schibsted font-semibold tracking-tighter text-sm text-sky-800 mb-0.5">
                  {title}
                </p>
                <Paragraph variant="docs-par" className="mb-5 ">
                  {description}
                </Paragraph>
              </div>
            ))}
          </div>
        </div>

        {/* ── How to create ── */}
        <div className="mb-10">
          <SectionHeading id="create-template-steps">
            How to create a template
          </SectionHeading>
          <Paragraph variant="docs-subPar" className="mb-5 ">
            Takes under two minutes from start to first use.
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

        {/* ── Managing templates ── */}
        <div className="mb-10">
          <SectionHeading id="managing-templates">
            Managing templates
          </SectionHeading>
          <Paragraph variant="docs-subPar" className="mb-5">
            Edit or remove templates at any time from the Templates tab.
          </Paragraph>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose">
            <div
              className="block rounded-xl bg-white p-4"
              style={{
                boxShadow:
                  "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)",
              }}
            >
              <p className="font-schibsted font-semibold tracking-tighter text-sm text-sky-800 mb-0.5">
                Edit
              </p>
              <Paragraph variant="docs-par" className="mb-5 ">
                Update the name, subject, or body of any template at any time.
                Changes apply to future uses immediately — past emails are
                unaffected.
              </Paragraph>
            </div>

            <div
              className="block rounded-xl bg-white p-4"
              style={{
                boxShadow:
                  "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)",
              }}
            >
              <p className="font-schibsted font-semibold tracking-tighter text-sm text-sky-800 mb-0.5">
                Delete
              </p>
              <Paragraph variant="docs-par" className="mb-5 ">
                Remove a template permanently. This does not affect emails
                already sent using it — only future use is prevented.
              </Paragraph>
            </div>
          </div>
        </div>

        {/* ── Plan requirement ── */}
        <div className="mb-12" id="plan-requirement">
          <Callout type="warning" title="Plan requirement">
            Creating new templates requires an active paid plan. If your plan
            has expired or you haven't subscribed yet, the save button will fail
            and prompt you to upgrade.{" "}
            <CustomLink
              href="/pricing"
              className="text-sky-800 hover:text-sky-900 underline"
            >
              View plans
            </CustomLink>
            . Viewing and using existing templates still works normally on any
            plan.
          </Callout>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

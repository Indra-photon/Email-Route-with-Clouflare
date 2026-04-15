// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { CustomLink } from "@/components/CustomLink";
// import { DocsNavigation } from "@/components/docs/DocsNavigation";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";

// import { DocsBody } from "fumadocs-ui/page";
// import { CustomDocsPage as DocsPage } from "@/components/docs/CustomDocsPage";

// export default function SlackIntegrationPage() {
//   return (
//     <DocsPage toc={[]}>
//     <DocsBody className="prose prose-neutral max-w-none">

//       {/* ── Header ── */}
//       <div className="mb-8">
//         <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
//           Integrations
//         </Badge>
//         <Heading as="h1" className="text-neutral-900 mb-4">
//           Slack Integration
//         </Heading>
//         <Paragraph variant="default" className="text-neutral-600 font-schibsted leading-relaxed">
//           Connect Email Router to your Slack workspace and bring customer
//           conversations directly to your team. See new emails instantly, reply
//           via threads, and resolve tickets faster without ever changing tabs.
//         </Paragraph>
//       </div>

//       {/* ── Steps ── */}
//       <div className="relative mb-12">

//         {/* Vertical connecting line */}
//         <div className="absolute left-[19px] top-10 bottom-10 w-px bg-gradient-to-b from-sky-800 to-cyan-700 z-0" />

//         {/* ── Step 1 ── */}
//         <div className="relative flex gap-4 pb-3">
//           <div className="relative z-10 flex-shrink-0 pt-1">
//             <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-schibsted font-bold">
//               1
//             </span>
//           </div>
//           <Card className="flex-1">
//             <CardContent className="px-0">
//               <Heading as="h2" variant="small" className="text-neutral-100 mb-4">
//                 <div className="inline-flex items-center w-full mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
//                   Connect your Workspace
//                 </div>
//               </Heading>
//               <Paragraph variant="docs-par" className="mb-4 pl-8">
//                 Link your Email Router account to your Slack workspace from the
//                 dashboard.
//               </Paragraph>
//               <Paragraph variant="docs-par" className="mb-0 pl-8">
//                 <ol className="list-decimal list-inside space-y-2 font-schibsted">
//                   <li>
//                     Go to{" "}
//                     <CustomLink
//                       href="/dashboard/integrations"
//                       className="text-sky-800 hover:text-sky-900 underline font-semibold"
//                     >
//                       Dashboard → Integrations
//                     </CustomLink>
//                     .
//                   </li>
//                   <li>Click <Highlight>Add Integration</Highlight>.</li>
//                   <li>Select <Highlight>Slack</Highlight> as the integration type.</li>
//                   <li>
//                     Click <Highlight>Connect with Slack</Highlight> to authorize our app
//                     to post messages into your channels securely.
//                   </li>
//                 </ol>
//               </Paragraph>
//             </CardContent>
//           </Card>
//         </div>

//         {/* ── Step 2 ── */}
//         <div className="relative flex gap-4">
//           <div className="relative z-10 flex-shrink-0 pt-1">
//             <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-schibsted font-bold">
//               2
//             </span>
//           </div>
//           <Card className="flex-1">
//             <CardContent className="px-0">
//               <Heading as="h2" variant="small" className="text-neutral-100 mb-4">
//                 <div className="inline-flex items-center w-full mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
//                   Start Routing
//                 </div>
//               </Heading>
//               <Paragraph variant="docs-par" className="mb-0 pl-8">
//                 Your Slack integration is now active! Once you connect an{" "}
//                 <CustomLink
//                   href="/docs/aliases"
//                   className="text-sky-800 hover:text-sky-900 font-semibold underline"
//                 >
//                   Email Alias
//                 </CustomLink>{" "}
//                 to this integration, all incoming emails will instantly pop up
//                 in your selected Slack channel.
//               </Paragraph>
//             </CardContent>
//           </Card>
//         </div>

//       </div>

//       {/* ── Routing Examples ── */}
//       <div className="mb-12">
//         <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
//           Routing Examples
//         </Heading>
//         <Paragraph variant="docs-par" className="mb-4">
//           You can create multiple integrations to route different types of
//           inquiries to specific channels to keep your team organized:
//         </Paragraph>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-schibsted">
//           <div className="p-4 border border-neutral-200 rounded-lg bg-white">
//             <div className="font-semibold text-neutral-900 mb-1">support@</div>
//             <div className="text-sm text-neutral-500">→ <Highlight>#customer-support</Highlight></div>
//           </div>
//           <div className="p-4 border border-neutral-200 rounded-lg bg-white">
//             <div className="font-semibold text-neutral-900 mb-1">sales@</div>
//             <div className="text-sm text-neutral-500">→ <Highlight>#sales-inquiries</Highlight></div>
//           </div>
//           <div className="p-4 border border-neutral-200 rounded-lg bg-white">
//             <div className="font-semibold text-neutral-900 mb-1">billing@</div>
//             <div className="text-sm text-neutral-500">→ <Highlight>#billing</Highlight></div>
//           </div>
//         </div>
//       </div>

//       {/* ── Navigation ── */}
//       <DocsNavigation
//         prev={{ title: "Integrations Overview", href: "/docs/integrations" }}
//         next={{ title: "Setup Chat Widgets", href: "/docs/chatbot" }}
//       />

//     </DocsBody>
//     </DocsPage>
//   );
// }



"use client";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { DocVideo } from "@/components/docs/DocVideo";


/* ═══════════════════════════════════════════════════════════════
   1. CONTENT — all raw data lives here, no JSX yet
   ═══════════════════════════════════════════════════════════════ */

// ── Steps ───────────────────────────────────────────────────────
const STEPS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "go-to-integrations",
    title: "Go to Integrations",
    body: (
      <Paragraph variant="docs-par">
        Once you have added your domain and verified it <CustomLink href="/docs/domains" className="text-sky-800 hover:text-sky-900 underline">How to Add and Configure Your Domain</CustomLink>, 
        you can set up your Slack integration. From the dashboard,
        navigate to{" "}
        <CustomLink
          href="/dashboard/integrations"
          className="text-sky-800 hover:text-sky-900 underline"
        >
          Integrations
        </CustomLink>{" "}
        from the sidebar. This is where all your workspace connections live.
      </Paragraph>
    ),
  },
  {
    id: "add-slack-integration",
    title: "Add a Slack integration",
    body: (
      <Paragraph variant="docs-par">
        Click <Highlight>Add Integration</Highlight>. You can create
        multiple Slack integrations. Each one can be linked to a different channel, so you can route
        different types of emails to the right teams (e.g., support@ to #customer-support, sales@ to #sales, etc.).
      </Paragraph>
    ),
  },
  {
    id: "authorize-slack",
    title: "Authorize with Slack",
    body: (
      <Paragraph variant="docs-par">
        Click <Highlight>Connect with Slack</Highlight>. You will be redirected
        to Slack's OAuth page. Select your workspace, choose the channel you
        want emails delivered to, and click <Highlight>Allow</Highlight>. You
        will be redirected back to the dashboard once authorized.
      </Paragraph>
    ),
  },
  {
    id: "connect-email-alias",
    title: "Connect an email alias",
    body: (
      <Paragraph variant="docs-par">
        Your Slack integration is now active. Head over to{" "}
        <CustomLink
          href="/docs/aliases"
          className="text-sky-800 hover:text-sky-900 underline"
        >
          Email Aliases
        </CustomLink>{" "}
        and link an alias (e.g., <Highlight>support@acme.com</Highlight>) to
        this integration. Every email that arrives at that address will
        immediately appear as a message in your chosen Slack channel.
      </Paragraph>
    ),
  },
];

// ── Routing examples ─────────────────────────────────────────────
const ROUTING_EXAMPLES: { alias: string; channel: string }[] = [
  { alias: "support@",  channel: "#customer-support" },
  { alias: "sales@",    channel: "#sales-inquiries"  },
  { alias: "billing@",  channel: "#billing"          },
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
      <div className="flex-1 rounded-xl overflow-hidden" style={{ boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)" }}>
        <div className="px-4 py-2.5 bg-gradient-to-r from-sky-800 to-cyan-700">
          <span className="font-schibsted font-semibold text-white text-sm tracking-wide">
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

export default function SlackIntegrationPage() {
  let globalStep = 0;

  return (
    <DocsPage toc={[
      { title: "Prerequisites", url: "#prerequisites", depth: 2 },
      { title: "Go to Integrations", url: "#go-to-integrations", depth: 4 },
      { title: "Add a Slack integration", url: "#add-slack-integration", depth: 4 },
      { title: "Authorize with Slack", url: "#authorize-slack", depth: 4 },
      { title: "Connect an email alias", url: "#connect-email-alias", depth: 4 },
    ]}
    tableOfContent={{
    style: 'clerk',
  }}>
      <DocsBody className="prose prose-neutral max-w-none">

        {/* ── Header ── */}
        <div className="mb-8">
          <Heading
            as="h1"
            className="!text-white !text-2xl !sm:text-2xl !md:text-3xl !lg:text-4xl !xl:text-5xl
              inset-shadow-sm inset-shadow-black/70 text-shadow-3xl bg-gradient-to-b from-sky-800 to-cyan-700 mb-4
              rounded-lg px-4 py-2"
          >
            How to Set Up Slack Integration
          </Heading>
          <Paragraph
            variant="home-par"
            className="text-neutral-600 font-schibsted leading-relaxed"
          >
            Connect SyncSupport to your Slack workspace and bring customer
            conversations directly to your team. See new emails the moment they
            arrive, reply via threads, and resolve tickets faster — without
            switching tabs.
          </Paragraph>

          <DocVideo
            url="https://youtu.be/-Z3luBBqEM8"
            label="Watch overview · 2 min"
          />
        </div>

        {/* ── Prerequisites ── */}
        <div className="mb-8" id="prerequisites">
          <Callout type="info" title="Before You Start">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                You must be a Slack workspace admin, or have permission to
                install apps in your workspace.
              </li>
              <li>
                Your domain must be verified before linking an alias.{" "}
                <CustomLink
                  href="/docs/domains"
                  className="text-sky-800 hover:text-sky-900 underline"
                >
                  How to add a domain
                </CustomLink>
              </li>
            </ul>
          </Callout>
        </div>

        {/* ══ STEPS — single relative wrapper, absolute line runs full height ══ */}
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

        {/* ── Routing Examples ── */}
        {/* <div className="mb-12">
          <Heading
            as="h2"
            className="text-neutral-900 mb-2 font-schibsted text-lg font-semibold"
          >
            Routing Examples
          </Heading>
          <Paragraph variant="docs-par" className="mb-4">
            You can create multiple Slack integrations to route different email
            addresses to different channels — keeping each team focused on what
            matters to them:
          </Paragraph>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-schibsted">
            {ROUTING_EXAMPLES.map(({ alias, channel }) => (
              <div
                key={alias}
                className="p-4 rounded-xl bg-white"
                style={{ boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)" }}
              >
                <div className="font-semibold text-neutral-900 mb-1 text-sm">
                  {alias}
                </div>
                <div className="text-sm text-neutral-500">
                  →{" "}
                  <Highlight>{channel}</Highlight>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* ── Navigation ── */}
        {/* <DocsNavigation
          prev={{ title: "Integrations Overview", href: "/docs/integrations" }}
          next={{ title: "Setup Chat Widgets", href: "/docs/chatbot" }}
        /> */}

      </DocsBody>
    </DocsPage>
  );
}
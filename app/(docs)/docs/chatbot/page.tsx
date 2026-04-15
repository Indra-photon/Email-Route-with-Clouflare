// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { CustomLink } from "@/components/CustomLink";
// import { CodeBlock } from "@/components/docs/CodeBlock";
// import { Callout } from "@/components/docs/Callout";
// import { DocsNavigation } from "@/components/docs/DocsNavigation";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { DocsBody } from "fumadocs-ui/page";

// export default function ChatbotPage() {
//   return (
//     <DocsPage toc={[]}>
//     <DocsBody className="prose prose-neutral max-w-none">

//       {/* ── Header ── */}
//       <div className="mb-8">
//         <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
//           Chat Widget
//         </Badge>
//         <Heading as="h1" className="text-neutral-900 mb-4">
//           How to Integrate Live Chat Widget on Your Website
//         </Heading>
//         <Paragraph variant="default" className="text-neutral-600 font-schibsted leading-relaxed">
//           Add a beautiful live chat widget to your website. Visitors can chat
//           with your team directly, and your team can reply directly from
//           Slack—creating a seamless customer support experience.
//         </Paragraph>
//       </div>

//       {/* ── Prerequisites ── */}
//       <div className="mb-8">
//         <Callout type="info" title="Before You Start">
//           <ul className="list-disc list-inside space-y-1 text-sm">
//             <li>
//               Domain must be added and configured.{" "}
//               <CustomLink
//                 href="/docs/domains"
//                 className="text-sky-800 hover:text-sky-900 underline"
//               >
//                 How to add a domain
//               </CustomLink>
//             </li>
//             <li>
//               At least one integration (Slack or Discord) must be set up.{" "}
//               <CustomLink
//                 href="/docs/integrations"
//                 className="text-sky-800 hover:text-sky-900 underline"
//               >
//                 How to set up an integration
//               </CustomLink>
//             </li>
//           </ul>
//         </Callout>
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
//                   Create a Chat Widget
//                 </div>
//               </Heading>
//               <Paragraph variant="docs-par" className="mb-0 pl-8">
//                 <ol className="list-decimal list-inside space-y-2 font-schibsted">
//                   <li>
//                     Go to{" "}
//                     <CustomLink
//                       href="/dashboard/chat-widgets"
//                       className="text-sky-800 hover:text-sky-900"
//                     >
//                       Dashboard → Chat Widgets
//                     </CustomLink>
//                     .
//                   </li>
//                   <li>Click <Highlight>Create Widget</Highlight>.</li>
//                   <li>Select the verified domain where the widget will be hosted.</li>
//                   <li>
//                     Select the Integration (Slack or Discord) that will receive
//                     the chat messages.
//                   </li>
//                   <li>
//                     Customize the <Highlight>Welcome Message</Highlight> and{" "}
//                     <Highlight>Accent Color</Highlight> to match your brand.
//                   </li>
//                   <li>Click <Highlight>Create Widget</Highlight>.</li>
//                 </ol>
//               </Paragraph>
//             </CardContent>
//           </Card>
//         </div>

//         {/* ── Step 2 ── */}
//         <div className="relative flex gap-4 pb-3">
//           <div className="relative z-10 flex-shrink-0 pt-1">
//             <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-semibold font-schibsted">
//               2
//             </span>
//           </div>
//           <Card className="flex-1 overflow-hidden">
//             <CardContent className="px-0">
//               <Heading as="h2" variant="small" className="text-neutral-100 mb-4">
//                 <div className="inline-flex items-center w-full mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
//                   Embed on Your Website
//                 </div>
//               </Heading>
//               <Paragraph variant="docs-par" className="mb-4 pl-8">
//                 Once created, you will be provided with an Activation Key and
//                 an Embed Script. Add the script to your website's HTML before
//                 the closing <Highlight>&lt;/body&gt;</Highlight> tag.
//               </Paragraph>
//               <div className="pl-8">
//               <CodeBlock
//                 code={`<!-- Email Router Chat Widget -->
// <script>window.CHAT_KEY = 'YOUR_ACTIVATION_KEY_HERE';</script>
// <script async src="https://your-email-router-domain.com/chat/widget.js"></script>`}
//                 language="html"
//                 filename="index.html"
//                 className=""
//               />
//               </div>
//               <Paragraph variant="docs-par" className="mt-4 mb-0 pl-8">
//                 Replace <Highlight>YOUR_ACTIVATION_KEY_HERE</Highlight> with
//                 the activation key provided in the dashboard. The widget will
//                 automatically load and apply your custom branding.
//               </Paragraph>
//             </CardContent>
//           </Card>
//         </div>

//         {/* ── Step 3 ── */}
//         <div className="relative flex gap-4">
//           <div className="relative z-10 flex-shrink-0 pt-1">
//             <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-semibold font-schibsted">
//               3
//             </span>
//           </div>
//           <Card className="flex-1">
//             <CardContent className="px-0">
//               <Heading as="h2" variant="small" className="text-neutral-100 mb-4">
//                 <div className="inline-flex items-center w-full mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
//                   Reply in Real-Time
//                 </div>
//               </Heading>
//               <Paragraph variant="docs-par" className="mb-4 pl-8 font-schibsted">
//                 When a visitor starts a chat, you can reply to them instantly
//                 from two places: your <Highlight>Slack workspace</Highlight> or
//                 your <Highlight>Email Router dashboard</Highlight>.
//               </Paragraph>

//               {/* Option A */}
//               <div className="mb-4 pl-8">
//                 <div className="inline-flex items-center mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-1">
//                   <p className="font-schibsted font-semibold text-white text-sm">
//                     Option A: Reply from Slack
//                   </p>
//                 </div>
//                 <Paragraph variant="docs-par" className="mb-4 pl-4">
//                 <ul className="list-disc list-inside space-y-2 font-schibsted">
//                   <li>Hover over the chat notification message in Slack in the integrated channel.</li>
//                   <li>Click <strong>Reply in thread</strong>.</li>
//                   <li>Type your message and send it.</li>
//                 </ul>
//                 </Paragraph>
//               </div>

//               {/* Option B */}
//               <div className="mb-4 pl-8">
//                 <div className="inline-flex items-center mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-1">
//                   <p className="font-schibsted font-semibold text-white text-sm">
//                     Option B: Reply from Dashboard
//                   </p>
//                 </div>

//                 <Paragraph variant="docs-par" className="mb-4 pl-4">
//                 <ul className="list-disc list-inside space-y-2 font-schibsted">
//                   <li>
//                     Go to{" "}
//                     <CustomLink
//                       href="/dashboard/live-chats"
//                       className="text-sky-800 hover:text-sky-900 font-semibold underline"
//                     >
//                       Dashboard → Live Chats
//                     </CustomLink>
//                     .
//                   </li>
//                   <li>Select the active conversation in the sidebar.</li>
//                   <li>Type your message in the chat window and hit send.</li>
//                 </ul>
//                 </Paragraph>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//       </div>

//       {/* ── Navigation ── */}
//       <DocsNavigation
//         prev={{ title: "Slack Integration", href: "/docs/integrations/slack" }}
//         next={{ title: "Troubleshooting", href: "/docs/troubleshooting" }}
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
import { DashboardLink } from "@/components/docs/DashboardLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { DocVideo } from "@/components/docs/DocVideo";

/* ═══════════════════════════════════════════════════════════════
   1. CONTENT — all raw data lives here, no JSX yet
   ═══════════════════════════════════════════════════════════════ */

const EMBED_CODE = `<!-- SyncSupport Chat Widget -->
<script>window.CHAT_KEY = 'YOUR_ACTIVATION_KEY_HERE';</script>
<script async src="https://your-email-router-domain.com/chat/widget.js"></script>`;

const REPLY_OPTIONS: {
  label: string;
  steps: React.ReactNode[];
}[] = [
  {
    label: "Option A: Reply from Slack",
    steps: [
      <>Hover over the chat notification in the integrated Slack channel.</>,
      <>Click <Highlight>Reply in thread</Highlight>.</>,
      <>Type your message and send. The visitor will see it in real time.</>,
    ],
  },
  {
    label: "Option B: Reply from Dashboard",
    steps: [
      <>
        Go to{" "}
        <DashboardLink
          href="/dashboard/live-chats"
          className="text-sky-800 hover:text-sky-900 underline"
        >
          Dashboard → Live Chats
        </DashboardLink>
        .
      </>,
      <>Select the active conversation from the sidebar.</>,
      <>Type your message in the chat window and hit send.</>,
    ],
  },
];

const STEPS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "go-to-chat-widgets",
    title: "Go to Chat Widgets",
    body: (
      <Paragraph variant="docs-par">
        Once your domain is verified and an integration is connected, navigate
        to{" "}
        <DashboardLink
          href="/dashboard/chat-widgets"
          className="text-sky-800 hover:text-sky-900 underline"
        >
          Chat Widgets
        </DashboardLink>{" "}
        from the sidebar. This is where you create and manage the widgets
        installed on your website.
      </Paragraph>
    ),
  },
  {
    id: "create-widget",
    title: "Create a widget",
    body: (
      <Paragraph variant="docs-par">
        Click <Highlight>Create Widget</Highlight>. Select the verified domain
        where the widget will be hosted, then choose the Slack or Discord
        integration that will receive incoming chat messages. Customize the{" "}
        <Highlight>Welcome Message</Highlight> and{" "}
        <Highlight>Accent Color</Highlight> to match your brand, then click{" "}
        <Highlight>Create Widget</Highlight> to save.
      </Paragraph>
    ),
  },
  {
    id: "embed-script",
    title: "Embed the script on your website",
    body: (
      <>
        <Paragraph variant="docs-par">
          Once created, you will receive an <Highlight>Activation Key</Highlight>{" "}
          and an embed script. Paste the script into your website's HTML just
          before the closing <Highlight>&lt;/body&gt;</Highlight> tag:
        </Paragraph>
        <div className="mt-3">
          <CodeBlock
            code={EMBED_CODE}
            language="html"
            filename="index.html"
          />
        </div>
        <Paragraph variant="docs-par" className="mt-3">
          Replace <Highlight>YOUR_ACTIVATION_KEY_HERE</Highlight> with the key
          shown in the dashboard. The widget will load automatically and apply
          your custom branding.
        </Paragraph>
      </>
    ),
  },
  {
    id: "reply-to-visitors",
    title: "Reply to visitors in real time",
    body: (
      <>
        <Paragraph variant="docs-par">
          When a visitor starts a chat, a notification appears in your connected
          Slack channel. You can reply from two places:
        </Paragraph>
        <div className="mt-3 space-y-3">
          {REPLY_OPTIONS.map(({ label, steps }) => (
            <div
              key={label}
              className="rounded-lg border border-sky-100 bg-sky-50/60 px-4 py-3"
            >
              <p className="text-xs font-schibsted font-semibold text-sky-700 mb-2 uppercase tracking-wide">
                {label}
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-neutral-700 font-schibsted">
                {steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </>
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

export default function ChatbotPage() {
  let globalStep = 0;

  return (
    <DocsPage toc={[
      { title: "Prerequisites", url: "#prerequisites", depth: 2 },
      { title: "Go to Chat Widgets", url: "#go-to-chat-widgets", depth: 4 },
      { title: "Create a widget", url: "#create-widget", depth: 4 },
      { title: "Embed the script", url: "#embed-script", depth: 4 },
      { title: "Reply to visitors", url: "#reply-to-visitors", depth: 4 },
    ]} tableOfContent={{ style: 'clerk' }}>
      <DocsBody className="prose prose-neutral max-w-none">

        {/* ── Header ── */}
        <div className="mb-8">
          <Heading
            as="h1"
            className="!text-white !text-2xl !sm:text-2xl !md:text-3xl !lg:text-4xl !xl:text-5xl
              inset-shadow-sm inset-shadow-black/70 text-shadow-3xl bg-gradient-to-b from-sky-800 to-cyan-700 mb-4
              rounded-lg px-4 py-2"
          >
            How to Integrate Live Chat Widget on Your Website
          </Heading>
          <Paragraph
            variant="docs-par"
            className="text-neutral-600 font-schibsted leading-relaxed"
          >
            Add a live chat widget to your website in minutes. Visitors chat
            with your team directly, and your team replies from Slack or the
            dashboard — creating a seamless support experience without switching
            tools.
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

        {/* ── Navigation ── */}
        {/* <DocsNavigation
          prev={{ title: "Slack Integration", href: "/docs/integrations/slack" }}
          next={{ title: "Troubleshooting", href: "/docs/troubleshooting" }}
        /> */}

      </DocsBody>
    </DocsPage>
  );
}
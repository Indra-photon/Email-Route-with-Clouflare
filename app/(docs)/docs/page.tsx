// 'use client';

// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { CustomLink } from "@/components/CustomLink";
// import { CodeBlock } from "@/components/docs/CodeBlock";
// import { Callout } from "@/components/docs/Callout";
// import { DocsNavigation } from "@/components/docs/DocsNavigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Mail, Zap, Users, BarChart3, Icon } from "lucide-react";
// import { AnalyticsIcon, IconMail, IconZap, UsersIcon } from "@/constants/icons";
// import { useState } from "react";
// import { DocsBody } from "fumadocs-ui/page";

// export default function DocsIndexPage() {
//   const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
//   return (
//     <DocsPage toc={[]}>
//     <DocsBody className="prose prose-neutral max-w-none">
//       {/* Hero Section */}
//       <div className="mb-12">
//         <Heading as="h1" className="text-neutral-900 mb-4">
//           Welcome to Email Router
//         </Heading>
//         <Paragraph variant="docs-par" className="">
//           Email Router helps teams manage customer support emails directly in Slack or Discord. 
//           Route emails to channels, assign tickets, and respond faster—all without leaving your workspace.
//         </Paragraph>
//       </div>

//       {/* Key Features */}
//       <div className="mb-12">
//         <Heading as="h2" variant="muted" className="text-neutral-900 tracking-tighter mb-6 text-2xl">
//           Key Features
//         </Heading>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[
//         {
//           icon: IconMail,
//           bgColor: "bg-sky-100",
//           iconColor: "text-sky-800",
//           title: "Email to Slack Routing",
//           description: "Automatically route support@, sales@, and billing@ emails to dedicated Slack channels",
//         },
//         {
//           icon: IconZap,
//           bgColor: "bg-sky-100",
//           iconColor: "text-sky-800",
//           title: "Instant Notifications",
//           description: "Team sees every email in 2-5 seconds, no more checking email clients",
//         },
//         {
//           icon: UsersIcon,
//           bgColor: "bg-sky-100",
//           iconColor: "text-sky-800",
//           title: "Ticket Management",
//           description: "Claim tickets, track status, assign to team members, and collaborate",
//         },
//         {
//           icon: AnalyticsIcon,
//           bgColor: "bg-sky-100",
//           iconColor: "text-amber-800",
//           title: "Performance Analytics",
//           description: "Track response times, ticket volume, and team performance metrics",
//         },
//           ].map((feature) => {
//         const Icon = feature.icon;
//         return (
//           <Card
//           onMouseEnter={() => setHoveredIcon(feature.title)}
//                 onMouseLeave={() => setHoveredIcon(null)}
          
//           key={feature.title}>
//             <CardContent className="p-6">
//               <div className="flex items-start gap-4">
//                 <div
//                 className={`rounded-lg ${feature.bgColor} p-3`}>
//                   <Icon isAnimating={hoveredIcon === feature.title} className={`size-6 ${feature.iconColor}`} />
//                 </div>
//                 <div>
//                   <Paragraph variant="muted" className="text-base font-schibsted font-bold text-sky-800 mb-2">
//                     {feature.title}
//                   </Paragraph>
//                   <Paragraph variant="docs-par" className="">
//                     {feature.description}
//                   </Paragraph>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         );
//           })}
//         </div>
//       </div>

//       {/* Quick Start */}
//       <div className="mb-12">
//         <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
//           Quick Start
//         </Heading>
//         <Paragraph variant="docs-par" className="mb-6">
//           Get up and running in <Highlight>5 minutes</Highlight>. Here's what you'll need:
//         </Paragraph>

//         <Callout type="tip" title="Prerequisites">
//           <ul className="list-disc list-inside space-y-1 text-sm">
//             <li>A Slack or Discord workspace</li>
//             <li>Access to your domain's DNS settings</li>
//             <li>5 minutes of setup time</li>
//           </ul>
//         </Callout>

//         <div className="mt-6">
//           <Paragraph variant="docs-par" className="mb-4 underline">
//             Follow these steps to get started:
//           </Paragraph>
//           <ol className="">
//             <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
//             <li>Create a Slack or Discord webhook</li>
//             <li>Add the integration in Email Router</li>
//             <li>Configure your domain</li>
//             <li>Create email aliases</li>
//             <li>Send a test email</li>
//             </Paragraph>
//           </ol>
//         </div>

//         <div className="mt-6">
//           <CustomLink
//             href="/docs/domains"
//             className="inline-flex items-center gap-2 rounded-lg bg-sky-800 px-6 py-3 text-sm font-schibsted font-semibold text-white hover:bg-sky-900 transition-colors"
//           >
//             How to add your domain →
//           </CustomLink>
//         </div>
//       </div>

//       {/* Popular Guides */}
//       {/* <div className="mb-12">
//         <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
//           Popular Guides
//         </Heading>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <CustomLink
//             href="/docs/integrations/slack"
//             className="block rounded-lg border border-neutral-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
//           >
//             <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
//               Slack Integration
//             </h3>
//             <Paragraph variant="small" className="text-neutral-600">
//               Connect Email Router to your Slack workspace
//             </Paragraph>
//           </CustomLink>

//           <CustomLink
//             href="/docs/domains"
//             className="block rounded-lg border border-neutral-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
//           >
//             <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
//               DNS Configuration
//             </h3>
//             <Paragraph variant="small" className="text-neutral-600">
//               Set up MX records and email forwarding
//             </Paragraph>
//           </CustomLink>

//           <CustomLink
//             href="/docs/api"
//             className="block rounded-lg border border-neutral-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
//           >
//             <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
//               API Reference
//             </h3>
//             <Paragraph variant="small" className="text-neutral-600">
//               Integrate Email Router with your apps
//             </Paragraph>
//           </CustomLink>
//         </div>
//       </div> */}

//       {/* Navigation */}
//       <DocsNavigation
//         next={{
//           title: "Add Your Domain",
//           href: "/docs/domains",
//         }}
//       />
//     </DocsBody>
//     </DocsPage>
//   );
// }


"use client";

import { CustomLink } from "@/components/CustomLink";
import { Callout } from "@/components/docs/Callout";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { DocVideo } from "@/components/docs/DocVideo";
import {
  IconMail, IconMessageCircle, IconPhoto, IconUsers,
  IconChartBar, IconSparkles, IconMessageCheck, IconFileSpreadsheet,
  IconBrandSlack, IconWorld, IconAt, IconSend,
} from "@tabler/icons-react";

/* ═══════════════════════════════════════════════════════════════
   1. CONTENT
   ═══════════════════════════════════════════════════════════════ */

const FEATURES: { icon: React.ElementType; title: string; description: string }[] = [
  { icon: IconMail,           title: "Email → Slack Routing",    description: "Route support@, sales@, and billing@ to dedicated Slack or Discord channels. Every email lands in 2–5 seconds." },
  { icon: IconMessageCircle,  title: "Live Chat Widget",         description: "Embed a chat widget on your website in two lines of code. Visitors chat — your team replies from Slack." },
  { icon: IconPhoto,          title: "File & Screenshot Sharing",description: "Users send bug screenshots inside the chat. You see them in Slack the moment they arrive." },
  { icon: IconUsers,          title: "Ticket Management",        description: "Claim tickets, track status, assign to teammates — all from the dashboard or directly inside Slack." },
  { icon: IconChartBar,       title: "Analytics & Reports",      description: "See response times, ticket volume by alias, and 7 or 30-day trends. Spot overloaded aliases early." },
  { icon: IconSparkles,       title: "AI Monthly Digest",        description: "Instead of reading 600 tickets, read 5 bullet points. AI surfaces top pain points automatically." },
  { icon: IconMessageCheck,   title: "Canned Responses",         description: "Pre-written replies for your most common questions. Stay fast and consistent without blank-screen anxiety." },
  { icon: IconFileSpreadsheet,title: "CSV / Excel Export",       description: "Export all tickets, response times, and alias volumes anytime. Your data, no lock-in." },
];

const QUICK_START_STEPS: { icon: React.ElementType; title: string; href: string; description: string }[] = [
  { icon: IconBrandSlack, title: "Connect Slack or Discord",   href: "/docs/integrations/slack", description: "Authorize SyncSupport to post into your workspace. Takes under a minute." },
  { icon: IconWorld,      title: "Add and verify your domain", href: "/docs/domains",             description: "Add a DNS record and verify ownership — we'll walk you through every DNS provider." },
  { icon: IconAt,         title: "Create email aliases",       href: "/docs/aliases",             description: "Map support@, sales@, billing@ to the right Slack channels." },
  { icon: IconMessageCircle, title: "Embed the chat widget",   href: "/docs/chatbot",             description: "Two lines of code. Your website now has a live chat connected to Slack." },
  { icon: IconSend,       title: "Send a test email",          href: "/docs/domains",             description: "Fire off a test message and watch it land in Slack within 5 seconds." },
];

const POPULAR_GUIDES: { title: string; href: string; description: string }[] = [
  { title: "Add and Configure Your Domain", href: "/docs/domains",             description: "Set up MX records and verify your domain for email routing." },
  { title: "Slack Integration",             href: "/docs/integrations/slack",  description: "Connect SyncSupport to your Slack workspace." },
  { title: "Create Email Aliases",          href: "/docs/aliases",             description: "Route support@, sales@, and billing@ to the right channels." },
  { title: "Live Chat Widget",              href: "/docs/chatbot",             description: "Embed a chat widget and reply to visitors from Slack." },
];

/* ═══════════════════════════════════════════════════════════════
   2. PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function GettingStartedPage() {
  return (
    <DocsPage toc={[
      { title: "What SyncSupport does", url: "#what-syncsupport-does", depth: 2 },
      { title: "Quick start", url: "#quick-start", depth: 2 },
      { title: "Popular guides", url: "#popular-guides", depth: 2 },
    ]} tableOfContent={{ style: 'clerk' }}>
      <DocsBody className="prose prose-neutral max-w-none">

        {/* ── Hero ── */}
        <div className="not-prose mb-10 rounded-2xl bg-gradient-to-br from-sky-800 to-cyan-600 px-6 py-8 text-white">
          <p className="text-xs font-schibsted font-semibold uppercase tracking-widest text-sky-200 mb-2">Documentation</p>
          <h1 className="font-schibsted font-bold text-2xl md:text-3xl leading-tight mb-3">
            Welcome to SyncSupport
          </h1>
          <p className="font-schibsted text-sm text-sky-100 leading-relaxed max-w-lg">
            Route customer support emails directly into Slack. Your team sees every message instantly, replies without switching tabs, and closes tickets faster. Five minutes of setup — no onboarding call, no per-seat fees.
          </p>
          <div className="mt-5">
            <DocVideo
              url="https://youtu.be/-Z3luBBqEM8"
              label="Watch overview · 3 min"
            />
          </div>
        </div>

        {/* ── What SyncSupport does ── */}
        <div className="not-prose mb-12" id="what-syncsupport-does">
          <p className="font-schibsted font-semibold text-neutral-900 text-base mb-0.5">What SyncSupport does</p>
          <p className="font-schibsted text-sm text-neutral-500 mb-5">Everything your team needs to handle support — without leaving Slack.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-3 items-start rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-4"
              >
                <div className="flex-shrink-0 mt-0.5 flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-sky-800 to-cyan-600">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-schibsted font-semibold text-sm text-neutral-900 mb-0.5">{title}</p>
                  <p className="font-schibsted text-xs text-neutral-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Start ── */}
        <div className="not-prose mb-12" id="quick-start">
          <p className="font-schibsted font-semibold text-neutral-900 text-base mb-0.5">Quick start</p>
          <p className="font-schibsted text-sm text-neutral-500 mb-5">Follow these steps in order to get fully set up.</p>

          <div className="relative">
            <div className="absolute left-[15px] top-6 bottom-6 w-px bg-gradient-to-b from-sky-800 to-cyan-200 z-0" />
            {QUICK_START_STEPS.map(({ icon: Icon, title, href, description }, i) => (
              <div key={i} className="flex gap-4 items-start mb-3">
                <span className="relative z-10 inline-flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-sky-800 to-cyan-600 text-white text-sm font-bold font-schibsted flex-shrink-0 select-none mt-0.5 border-2 border-white shadow-sm">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-800 to-cyan-600">
                    <Icon size={14} className="text-sky-200 flex-shrink-0" />
                    <CustomLink href={href} className="font-schibsted font-semibold text-white text-sm hover:underline">
                      {title}
                    </CustomLink>
                  </div>
                  <div className="px-4 py-3 text-xs text-neutral-600 font-schibsted leading-relaxed">
                    {description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Popular Guides ── */}
        <div className="not-prose mb-12" id="popular-guides">
          <p className="font-schibsted font-semibold text-neutral-900 text-base mb-0.5">Popular guides</p>
          <p className="font-schibsted text-sm text-neutral-500 mb-5">Jump straight to what you need.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR_GUIDES.map(({ title, href, description }) => (
              <CustomLink
                key={href}
                href={href}
                className="group block rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-4 hover:border-sky-300 hover:from-sky-100 hover:to-cyan-100 transition-colors"
              >
                <p className="font-schibsted font-semibold text-sm text-sky-800 mb-1 group-hover:text-sky-900">
                  {title} →
                </p>
                <p className="font-schibsted text-xs text-neutral-500 leading-relaxed">
                  {description}
                </p>
              </CustomLink>
            ))}
          </div>
        </div>

        {/* ── Pricing nudge ── */}
        <Callout type="info" title="Flat pricing — not per seat">
          Add your 11th teammate. Your 20th. Still{" "}
          <strong>$19/mo</strong> on the Starter plan. SyncSupport charges a flat monthly rate — no surprises when your team grows.{" "}
          <CustomLink href="/pricing" className="text-sky-800 hover:text-sky-900 underline">
            View pricing →
          </CustomLink>
        </Callout>

      </DocsBody>
    </DocsPage>
  );
}
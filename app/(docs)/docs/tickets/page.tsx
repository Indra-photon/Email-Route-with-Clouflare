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

// export default function TicketsPage() {
//   return (
//     <DocsPage toc={[]}>
//     <DocsBody className="prose prose-neutral max-w-none">
//       <div className="mb-8">
//         <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
//           Ticket Management
//         </Badge>
//         <Heading as="h1" className="text-neutral-900 mb-4">
//           Ticket Management
//         </Heading>
//         <Paragraph variant="default" className="text-neutral-600">
//           View, claim, assign, and track customer support tickets. Collaborate with your team to resolve issues faster.
//         </Paragraph>
//       </div>

//       <Callout type="info" title="What Are Tickets?">
//         Every inbound email becomes a ticket that can be claimed, tracked, and managed by your team.
//       </Callout>

//       <div className="my-12">
//         <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
//           Ticket Statuses
//         </Heading>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="size-3 rounded-full bg-amber-500"></div>
//                 <h3 className="text-sm font-schibsted font-semibold text-neutral-900">
//                   Open
//                 </h3>
//               </div>
//               <Paragraph variant="small" className="text-neutral-600">
//                 New unassigned tickets waiting to be claimed
//               </Paragraph>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="size-3 rounded-full bg-sky-500"></div>
//                 <h3 className="text-sm font-schibsted font-semibold text-neutral-900">
//                   In Progress
//                 </h3>
//               </div>
//               <Paragraph variant="small" className="text-neutral-600">
//                 Tickets claimed and actively being worked on
//               </Paragraph>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="size-3 rounded-full bg-purple-500"></div>
//                 <h3 className="text-sm font-schibsted font-semibold text-neutral-900">
//                   Waiting
//                 </h3>
//               </div>
//               <Paragraph variant="small" className="text-neutral-600">
//                 Waiting for customer response or external action
//               </Paragraph>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="size-3 rounded-full bg-green-500"></div>
//                 <h3 className="text-sm font-schibsted font-semibold text-neutral-900">
//                   Resolved
//                 </h3>
//               </div>
//               <Paragraph variant="small" className="text-neutral-600">
//                 Tickets successfully closed and resolved
//               </Paragraph>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="mb-12">
//         <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
//           View Tickets
//         </Heading>
//         <Paragraph variant="default" className="mb-4">
//           Access your tickets from the dashboard:
//         </Paragraph>
//         <ul className="list-disc list-inside space-y-2 font-schibsted font-normal text-sm text-neutral-600 mb-6">
//           <li><CustomLink href="/dashboard/tickets/mine" className="text-sky-800 hover:text-sky-900 underline">My Tickets</CustomLink> - Tickets assigned to you</li>
//           <li><CustomLink href="/dashboard/tickets/unassigned" className="text-sky-800 hover:text-sky-900 underline">Unassigned Tickets</CustomLink> - Available tickets to claim</li>
//         </ul>
//       </div>

//       <div className="mb-12">
//         <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
//           Claim a Ticket
//         </Heading>
//         <Paragraph variant="default" className="mb-4">
//           When you see an unassigned ticket you want to handle:
//         </Paragraph>
//         <ol className="list-decimal list-inside space-y-3 font-schibsted font-normal text-sm text-neutral-600 mb-6">
//           <li>Go to <CustomLink href="/dashboard/tickets/unassigned" className="text-sky-800 hover:text-sky-900 underline">Unassigned Tickets</CustomLink></li>
//           <li>Find the ticket you want to handle</li>
//           <li>Click "Claim" button</li>
//           <li>Ticket is now assigned to you</li>
//           <li>Status changes to "In Progress"</li>
//         </ol>

//         <CodeBlock
//           code={`POST /api/emails/tickets/{ticketId}/claim

// Response:
// {
//   "id": "ticket_123",
//   "status": "in_progress",
//   "assignedTo": "user_456",
//   "claimedAt": "2024-02-28T10:30:00Z"
// }`}
//           language="json"
//           filename="claim-ticket.json"
//         />
//       </div>

//       <div className="mb-12">
//         <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
//           Reply to Customers
//         </Heading>
//         <Paragraph variant="default" className="mb-4">
//           Respond to customer emails directly from the ticket view:
//         </Paragraph>
//         <ol className="list-decimal list-inside space-y-3 font-schibsted font-normal text-sm text-neutral-600 mb-6">
//           <li>Open the ticket details</li>
//           <li>Click "Reply" button</li>
//           <li>Compose your response</li>
//           <li>Click "Send"</li>
//           <li>Customer receives your email</li>
//         </ol>

//         <Callout type="tip" title="Email Threading">
//           Replies automatically maintain the email thread, so customers see your response in context.
//         </Callout>
//       </div>

//       <div className="mb-12">
//         <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
//           Update Ticket Status
//         </Heading>
//         <Paragraph variant="default" className="mb-4">
//           Change ticket status based on progress:
//         </Paragraph>

//         <div className="space-y-3">
//           <div className="rounded-lg border border-neutral-200 p-4">
//             <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-1">
//               Mark as Waiting
//             </h3>
//             <Paragraph variant="small" className="text-neutral-600">
//               Use when you need customer to provide more information
//             </Paragraph>
//           </div>

//           <div className="rounded-lg border border-neutral-200 p-4">
//             <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-1">
//               Mark as Resolved
//             </h3>
//             <Paragraph variant="small" className="text-neutral-600">
//               Use when the issue is completely solved
//             </Paragraph>
//           </div>
//         </div>

//         <CodeBlock
//           code={`POST /api/emails/tickets/{ticketId}/status

// {
//   "status": "resolved"
// }

// Response:
// {
//   "id": "ticket_123",
//   "status": "resolved",
//   "resolvedAt": "2024-02-28T11:45:00Z"
// }`}
//           language="json"
//           filename="update-status.json"
//           className="mt-6"
//         />
//       </div>

//       <div className="mb-12">
//         <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
//           Filter Tickets
//         </Heading>
//         <Paragraph variant="default" className="mb-4">
//           Use filters to find specific tickets:
//         </Paragraph>
//         <ul className="list-disc list-inside space-y-2 font-schibsted font-normal text-sm text-neutral-600 mb-6">
//           <li><Highlight>All</Highlight> - View all tickets</li>
//           <li><Highlight>Open</Highlight> - Only new unassigned tickets</li>
//           <li><Highlight>In Progress</Highlight> - Tickets being actively worked</li>
//           <li><Highlight>Waiting</Highlight> - Tickets awaiting customer response</li>
//           <li><Highlight>Resolved</Highlight> - Closed tickets</li>
//         </ul>
//       </div>

//       <div className="mb-12">
//         <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
//           Ticket Metrics
//         </Heading>
//         <Paragraph variant="default" className="mb-4">
//           Track your team's performance:
//         </Paragraph>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card>
//             <CardContent className="p-4">
//               <h3 className="text-xs font-schibsted font-medium text-neutral-600 mb-1">
//                 Response Time
//               </h3>
//               <p className="text-2xl font-schibsted font-semibold text-neutral-900">
//                 12 min
//               </p>
//               <Paragraph variant="small" className="text-neutral-600">
//                 Average time to first response
//               </Paragraph>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <h3 className="text-xs font-schibsted font-medium text-neutral-600 mb-1">
//                 Resolution Time
//               </h3>
//               <p className="text-2xl font-schibsted font-semibold text-neutral-900">
//                 2.5 hrs
//               </p>
//               <Paragraph variant="small" className="text-neutral-600">
//                 Average time to resolve
//               </Paragraph>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <h3 className="text-xs font-schibsted font-medium text-neutral-600 mb-1">
//                 Tickets Resolved
//               </h3>
//               <p className="text-2xl font-schibsted font-semibold text-neutral-900">
//                 156
//               </p>
//               <Paragraph variant="small" className="text-neutral-600">
//                 This week
//               </Paragraph>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="mb-12">
//         <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
//           Best Practices
//         </Heading>
//         <div className="space-y-4">
//           <Callout type="tip" title="Claim Quickly">
//             Claim tickets as soon as possible to show customers you're on it
//           </Callout>

//           <Callout type="tip" title="Update Status">
//             Keep ticket status current so teammates know what's happening
//           </Callout>

//           <Callout type="tip" title="Use Templates">
//             Create response templates for common issues to save time
//           </Callout>
//         </div>
//       </div>

//       <DocsNavigation
//         prev={{ title: "Email Aliases", href: "/docs/aliases" }}
//         next={{ title: "Chatbot Widget", href: "/docs/chatbot" }}
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

// ── Ticket statuses ──────────────────────────────────────────────
const STATUSES: {
  color: string;
  label: string;
  description: string;
}[] = [
  {
    color: "bg-amber-400",
    label: "Open",
    description: "New email arrived, no one has claimed it yet. Visible to the whole team under Unassigned Tickets.",
  },
  {
    color: "bg-sky-500",
    label: "In Progress",
    description: "A team member has claimed the ticket and is actively working on a response.",
  },
  {
    color: "bg-purple-500",
    label: "Waiting",
    description: "Your team has replied and is waiting on the customer to respond or provide more information.",
  },
  {
    color: "bg-green-500",
    label: "Resolved",
    description: "The issue is fully closed. Resolved tickets are stored and exportable for analytics.",
  },
];

// ── Steps: claim a ticket ────────────────────────────────────────
const CLAIM_STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Go to Unassigned Tickets",
    body: (
      <Paragraph variant="docs-par">
        Navigate to{" "}
        <CustomLink
          href="/dashboard/tickets/unassigned"
          className="text-sky-800 hover:text-sky-900 underline"
        >
          Dashboard → Unassigned Tickets
        </CustomLink>{" "}
        to see all open tickets that haven't been claimed yet. These are visible
        to your entire team.
      </Paragraph>
    ),
  },
  {
    title: "Claim the ticket",
    body: (
      <Paragraph variant="docs-par">
        Find the ticket you want to handle and click{" "}
        <Highlight>Claim</Highlight>. The ticket is immediately assigned to you
        and its status changes from <Highlight>Open</Highlight> to{" "}
        <Highlight>In Progress</Highlight>. Other team members will see it's
        taken.
      </Paragraph>
    ),
  },
  {
    title: "Reply to the customer",
    body: (
      <Paragraph variant="docs-par">
        Open the ticket and click <Highlight>Reply</Highlight>. Compose your
        response — or pick a canned response if you have one set up — and click{" "}
        <Highlight>Send</Highlight>. The customer receives your reply as a
        normal email, threaded with their original message.
      </Paragraph>
    ),
  },
  {
    title: "Update the status",
    body: (
      <Paragraph variant="docs-par">
        As the conversation progresses, keep the status current. Mark as{" "}
        <Highlight>Waiting</Highlight> if you need the customer to respond, or{" "}
        <Highlight>Resolved</Highlight> once the issue is fully closed. Status
        updates are visible to everyone in the channel so your team always knows
        what's been handled.
      </Paragraph>
    ),
  },
];

// ── Best practices ───────────────────────────────────────────────
const BEST_PRACTICES: { title: string; body: string }[] = [
  {
    title: "Claim quickly",
    body: "Claiming a ticket signals to the customer and your team that someone is on it. Even if you can't reply immediately, claiming prevents duplicate effort.",
  },
  {
    title: "Keep status current",
    body: "A ticket stuck on In Progress with no updates is invisible to your manager. Move it to Waiting or Resolved so the team dashboard stays accurate.",
  },
  {
    title: "Use canned responses",
    body: "For common questions — billing, password resets, feature timelines — save a canned response. It keeps your replies consistent and cuts reply time to seconds.",
  },
  {
    title: "Check your analytics",
    body: "The analytics dashboard shows average response time, ticket volume by alias, and 7 or 30-day trends. Use it to spot which alias is getting hammered before a customer notices.",
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
      <div className="flex-1 rounded-xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
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

function SectionHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-schibsted font-semibold text-neutral-900 text-lg mb-1">
      {children}
    </h2>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function TicketsPage() {
  let globalStep = 0;

  return (
    <DocsPage toc={[
      { title: "What is a ticket?", url: "#what-is-a-ticket", depth: 2 },
      { title: "Ticket statuses", url: "#ticket-statuses", depth: 2 },
      { title: "How to claim and resolve", url: "#claim-and-resolve", depth: 2 },
      { title: "Where to find your tickets", url: "#where-to-find-tickets", depth: 2 },
      { title: "Best practices", url: "#best-practices", depth: 2 },
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
            Ticket Management
          </Heading>
          <Paragraph
            variant="default"
            className="text-neutral-600 font-schibsted leading-relaxed"
          >
            Every inbound email becomes a ticket your team can claim, track,
            and close — without leaving Slack. View unassigned tickets, take
            ownership, reply directly to customers, and keep status up to date
            so nothing falls through the cracks.
          </Paragraph>

          <DocVideo
            url="https://youtu.be/-Z3luBBqEM8"
            label="Watch overview · 2 min"
          />
        </div>

        {/* ── What is a ticket ── */}
        <div className="mb-8" id="what-is-a-ticket">
          <Callout type="info" title="What is a ticket?">
            When an email arrives at one of your aliases (e.g.,{" "}
            <Highlight>support@acme.com</Highlight>), SyncSupport creates a
            ticket and posts it to your connected Slack channel. From that
            point, your team can claim it, reply to the customer, and track its
            status — all from the dashboard or from Slack.
          </Callout>
        </div>

        {/* ── Ticket statuses ── */}
        <div className="mb-10">
          <SectionHeading id="ticket-statuses">Ticket statuses</SectionHeading>
          <Paragraph variant="docs-par" className="mb-4 text-neutral-500">
            Every ticket moves through these four states.
          </Paragraph>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose">
            {STATUSES.map(({ color, label, description }) => (
              <div
                key={label}
                className="flex gap-3 items-start rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <span
                  className={`mt-1.5 size-2.5 rounded-full flex-shrink-0 ${color}`}
                />
                <div>
                  <p className="font-schibsted font-semibold text-sm text-neutral-900 mb-0.5">
                    {label}
                  </p>
                  <p className="font-schibsted text-xs text-neutral-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How to work a ticket ── */}
        <div className="mb-10">
          <SectionHeading id="claim-and-resolve">How to claim and resolve a ticket</SectionHeading>
          <Paragraph variant="docs-par" className="mb-5 text-neutral-500">
            The full lifecycle from an arriving email to a resolved ticket.
          </Paragraph>

          <div className="relative not-prose">
            <div className="absolute left-[15px] top-10 bottom-4 w-px bg-gradient-to-b from-sky-800 to-cyan-100 z-0" />

            {CLAIM_STEPS.map((s, i) => {
              globalStep++;
              return (
                <StepCard key={i} step={globalStep} title={s.title}>
                  {s.body}
                </StepCard>
              );
            })}
          </div>
        </div>

        {/* ── View tickets ── */}
        <div className="mb-10">
          <SectionHeading id="where-to-find-tickets">Where to find your tickets</SectionHeading>
          <Paragraph variant="docs-par" className="mb-4 text-neutral-500">
            Two views in the dashboard give you full visibility.
          </Paragraph>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose">
            <CustomLink
              href="/dashboard/tickets/mine"
              className="block rounded-xl border border-neutral-200 bg-white p-4 hover:border-sky-300 hover:bg-sky-50/50 transition-colors shadow-sm"
            >
              <p className="font-schibsted font-semibold text-sm text-neutral-900 mb-1">
                My Tickets →
              </p>
              <p className="font-schibsted text-xs text-neutral-500 leading-relaxed">
                Tickets you have claimed and are currently working on. Your
                personal queue.
              </p>
            </CustomLink>

            <CustomLink
              href="/dashboard/tickets/unassigned"
              className="block rounded-xl border border-neutral-200 bg-white p-4 hover:border-sky-300 hover:bg-sky-50/50 transition-colors shadow-sm"
            >
              <p className="font-schibsted font-semibold text-sm text-neutral-900 mb-1">
                Unassigned Tickets →
              </p>
              <p className="font-schibsted text-xs text-neutral-500 leading-relaxed">
                All open tickets no one has claimed yet. First come, first
                served — claim before a teammate does.
              </p>
            </CustomLink>
          </div>
        </div>

        {/* ── Best practices ── */}
        <div className="mb-12">
          <SectionHeading id="best-practices">Best practices</SectionHeading>
          <Paragraph variant="docs-par" className="mb-4 text-neutral-500">
            Small habits that keep your team's ticket queue healthy.
          </Paragraph>

          <div className="space-y-3 not-prose">
            {BEST_PRACTICES.map(({ title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3"
              >
                <p className="font-schibsted font-semibold text-sm text-sky-800 mb-0.5">
                  {title}
                </p>
                <p className="font-schibsted text-xs text-neutral-600 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Navigation ── */}
        {/* <DocsNavigation
          prev={{ title: "Email Aliases", href: "/docs/aliases" }}
          next={{ title: "Live Chat Widget", href: "/docs/chatbot" }}
        /> */}

      </DocsBody>
    </DocsPage>
  );
}
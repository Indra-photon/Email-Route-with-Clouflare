// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { CustomLink } from "@/components/CustomLink";
// import { DocsNavigation } from "@/components/docs/DocsNavigation";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { LayoutDashboard, CheckCircle } from "lucide-react";

// export default function SlackIntegrationPage() {
//   return (
//     <article className="prose prose-neutral max-w-none">
//       <div className="mb-8">
//         <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
//           Integrations
//         </Badge>
//         <Heading as="h1" className="text-neutral-900 mb-4">
//           Slack Integration
//         </Heading>
//         <Paragraph variant="default" className="text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed">
//           Connect Email Router to your Slack workspace and bring customer conversations directly to your team. 
//           See new emails instantly, reply via threads, and resolve tickets faster without ever changing tabs.
//         </Paragraph>
//       </div>

//       <div className="mb-12">
//         <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
//           Complete Setup in 2 Steps
//         </Heading>
        
//         <div className="space-y-6">
//           {/* Step 1 */}
//           <Card className="border border-neutral-200">
//             <CardContent className="p-6">
//               <div className="flex items-start gap-4">
//                 <div className="rounded-lg bg-sky-100 p-3 mt-1">
//                   <LayoutDashboard className="size-6 text-sky-800" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-2">
//                     Step 1: Connect your Workspace
//                   </h3>
//                   <Paragraph variant="docs-par" className="mb-4">
//                     Link your Email Router account to your Slack workspace from the dashboard.
//                   </Paragraph>
//                   <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-600 font-schibsted">
//                     <li>Go to <CustomLink href="/dashboard/integrations" className="text-sky-800 hover:text-sky-900 underline font-semibold">Dashboard → Integrations</CustomLink>.</li>
//                     <li>Click <strong>Add Integration</strong>.</li>
//                     <li>Select <strong>Slack</strong> as the integration type.</li>
//                     <li>Click <strong>Connect with Slack</strong> to authorize our app to post messages into your channels securely.</li>
//                   </ol>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Step 2 */}
//           <Card className="border border-neutral-200 bg-emerald-50">
//             <CardContent className="p-6">
//               <div className="flex items-start gap-4">
//                 <div className="rounded-lg bg-emerald-100 p-3 mt-1 border border-emerald-200">
//                   <CheckCircle className="size-6 text-emerald-800" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-2">
//                     Step 2: Start Routing
//                   </h3>
//                   <Paragraph variant="docs-par" className="mb-0 text-sm text-neutral-600 font-schibsted">
//                     Your Slack integration is now active! Once you connect an <CustomLink href="/docs/aliases" className="text-sky-800 hover:text-sky-900 font-semibold underline">Email Alias</CustomLink> to this integration, all incoming emails will instantly pop up in your selected Slack channel. 
//                   </Paragraph>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//         </div>
//       </div>

//       <div className="mb-12">
//         <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
//           Routing Examples
//         </Heading>
//         <Paragraph variant="docs-par" className="mb-4">
//           You can create multiple integrations to route different types of inquiries to specific channels to keep your team organized:
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

//       <DocsNavigation
//         prev={{
//           title: "Integrations Overview",
//           href: "/docs/integrations",
//         }}
//         next={{
//           title: "Setup Chat Widgets",
//           href: "/docs/chatbot",
//         }}
//       />
//     </article>
//   );
// }


import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function SlackIntegrationPage() {
  return (
    <article className="prose prose-neutral max-w-none">

      {/* ── Header ── */}
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Integrations
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Slack Integration
        </Heading>
        <Paragraph variant="default" className="text-neutral-600 font-schibsted leading-relaxed">
          Connect Email Router to your Slack workspace and bring customer
          conversations directly to your team. See new emails instantly, reply
          via threads, and resolve tickets faster without ever changing tabs.
        </Paragraph>
      </div>

      {/* ── Steps ── */}
      <div className="relative mb-12">

        {/* Vertical connecting line */}
        <div className="absolute left-[19px] top-10 bottom-10 w-px bg-gradient-to-b from-sky-800 to-cyan-700 z-0" />

        {/* ── Step 1 ── */}
        <div className="relative flex gap-4 pb-3">
          <div className="relative z-10 flex-shrink-0 pt-1">
            <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-schibsted font-bold">
              1
            </span>
          </div>
          <Card className="flex-1">
            <CardContent className="px-0">
              <Heading as="h2" variant="small" className="text-neutral-100 mb-4">
                <div className="inline-flex items-center w-full mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
                  Connect your Workspace
                </div>
              </Heading>
              <Paragraph variant="docs-par" className="mb-4 pl-8">
                Link your Email Router account to your Slack workspace from the
                dashboard.
              </Paragraph>
              <Paragraph variant="docs-par" className="mb-0 pl-8">
                <ol className="list-decimal list-inside space-y-2 font-schibsted">
                  <li>
                    Go to{" "}
                    <CustomLink
                      href="/dashboard/integrations"
                      className="text-sky-800 hover:text-sky-900 underline font-semibold"
                    >
                      Dashboard → Integrations
                    </CustomLink>
                    .
                  </li>
                  <li>Click <Highlight>Add Integration</Highlight>.</li>
                  <li>Select <Highlight>Slack</Highlight> as the integration type.</li>
                  <li>
                    Click <Highlight>Connect with Slack</Highlight> to authorize our app
                    to post messages into your channels securely.
                  </li>
                </ol>
              </Paragraph>
            </CardContent>
          </Card>
        </div>

        {/* ── Step 2 ── */}
        <div className="relative flex gap-4">
          <div className="relative z-10 flex-shrink-0 pt-1">
            <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-schibsted font-bold">
              2
            </span>
          </div>
          <Card className="flex-1">
            <CardContent className="px-0">
              <Heading as="h2" variant="small" className="text-neutral-100 mb-4">
                <div className="inline-flex items-center w-full mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
                  Start Routing
                </div>
              </Heading>
              <Paragraph variant="docs-par" className="mb-0 pl-8">
                Your Slack integration is now active! Once you connect an{" "}
                <CustomLink
                  href="/docs/aliases"
                  className="text-sky-800 hover:text-sky-900 font-semibold underline"
                >
                  Email Alias
                </CustomLink>{" "}
                to this integration, all incoming emails will instantly pop up
                in your selected Slack channel.
              </Paragraph>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* ── Routing Examples ── */}
      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Routing Examples
        </Heading>
        <Paragraph variant="docs-par" className="mb-4">
          You can create multiple integrations to route different types of
          inquiries to specific channels to keep your team organized:
        </Paragraph>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-schibsted">
          <div className="p-4 border border-neutral-200 rounded-lg bg-white">
            <div className="font-semibold text-neutral-900 mb-1">support@</div>
            <div className="text-sm text-neutral-500">→ <Highlight>#customer-support</Highlight></div>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg bg-white">
            <div className="font-semibold text-neutral-900 mb-1">sales@</div>
            <div className="text-sm text-neutral-500">→ <Highlight>#sales-inquiries</Highlight></div>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg bg-white">
            <div className="font-semibold text-neutral-900 mb-1">billing@</div>
            <div className="text-sm text-neutral-500">→ <Highlight>#billing</Highlight></div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <DocsNavigation
        prev={{ title: "Integrations Overview", href: "/docs/integrations" }}
        next={{ title: "Setup Chat Widgets", href: "/docs/chatbot" }}
      />

    </article>
  );
}
// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { CustomLink } from "@/components/CustomLink";
// import { CodeBlock } from "@/components/docs/CodeBlock";
// import { Callout } from "@/components/docs/Callout";
// import { DocsNavigation } from "@/components/docs/DocsNavigation";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { MessageSquare, Power, RadioTower } from "lucide-react";

// export default function ChatbotPage() {
//   return (
//     <article className="prose prose-neutral max-w-none">
//       <div className="mb-8">
//         <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
//           Chat Widget
//         </Badge>
//         <Heading as="h1" className="text-neutral-900 mb-4">
//           How to Integrate Live chat Widget on Your Website and your workspace
//         </Heading>
//         <Paragraph variant="default" className="text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed">
//           Add a beautiful live chat widget to your website. Visitors can chat with your team directly, 
//           and your team can reply directly from Slack—creating a seamless customer support experience.
//         </Paragraph>
//       </div>

//       <div className="mb-12">
//         <Callout type="info" title="Before You Start" >
//           <ul className="list-disc list-inside space-y-1 text-sm">
//             <li>Domain must be added and configured. <CustomLink href="/docs/domains" className="text-sky-800 hover:text-sky-900 underline">How to add a domain</CustomLink></li>
//             <li>At least one integration (Slack or Discord) must be set up, <CustomLink href="/docs/integrations" className="text-sky-800 hover:text-sky-900 underline">How to set up an integration</CustomLink></li>
//           </ul>
//         </Callout>
        
//         <div className="space-y-2 mt-3">
//           {/* Step 1 */}
//           <Card className="">
//             <CardContent className="p-6">
//               <div className="flex items-start gap-4">
//                 <div className="flex-1 min-w-0">
                  
//                   <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
//                     <span className="inline-flex items-center justify-center bg-neutral-900 text-white rounded-full w-8 h-8 p-3"> 1 </span> Create a Chat Widget
//                   </Heading>
//                   <Paragraph variant="docs-par" className="mb-4">
//                   <ol className="list-decimal list-inside space-y-2">
//                     <li>Go to <CustomLink href="/dashboard/chat-widgets" className="text-sky-800 hover:text-sky-900">Dashboard → Chat Widgets</CustomLink>.</li>
//                     <li>Click "Create Widget".</li>
//                     <li>Select the verified domain where the widget will be hosted.</li>
//                     <li>Select the Integration (Slack or Discord) that will receive the chat messages.</li>
//                     <li>Customize the <Highlight>Welcome Message</Highlight> and <Highlight>Accent Color</Highlight> to match your brand.</li>
//                     <li>Click "Create Widget".</li>
//                   </ol>
//                   </Paragraph>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Step 2 */}
//           <Card className="">
//             <CardContent className="p-6">
//               <div className="flex items-start gap-4">
//                 <div className="flex-1 min-w-0">
//                   <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
//                     <span className="inline-flex items-center justify-center bg-neutral-900 text-white rounded-full w-8 h-8 p-3"> 2 </span> Embed on Your Website
//                   </Heading>
//                   <Paragraph variant="docs-par" className="mb-4">
//                     Once created, you will be provided with an Activation Key and an Embed Script. Add the script to your website's HTML before the closing <Highlight>&lt;/body&gt;</Highlight> tag.
//                   </Paragraph>
//                   <CodeBlock
//                     code={`<!-- Email Router Chat Widget -->
// <script>window.CHAT_KEY = 'YOUR_ACTIVATION_KEY_HERE';</script>
// <script async src="https://your-email-router-domain.com/chat/widget.js"></script>`}
//                     language="html"
//                     filename="index.html"
//                   />
//                   <Paragraph variant="docs-par" className="mt-4">
//                     Replace <Highlight>YOUR_ACTIVATION_KEY_HERE</Highlight> with the activation key provided in the dashboard. The widget will automatically load and apply your custom branding.
//                   </Paragraph>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Step 3 */}
//           <Card className="">
//             <CardContent className="p-6">
//               <div className="flex items-start gap-4">
//                 <div className="flex-1 min-w-0">
//                   <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
//                     <span className="inline-flex items-center justify-center bg-neutral-900 text-white rounded-full w-8 h-8 p-3"> 3 </span> Reply in Real-Time
//                   </Heading>
//                   <Paragraph variant="docs-par" className="mb-4">
//                     When a visitor starts a chat, you can reply to them instantly from two places: your <Highlight>Slack workspace</Highlight> or your <Highlight>Email Router dashboard</Highlight>.
//                   </Paragraph>
                  
//                   <div className="mb-4">
//                     <div className="flex items-center gap-2 mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 border border-neutral-300 rounded px-2 py-1 w-max">
//                       <p className="font-schibsted font-semibold text-neutral-100 text-sm">
//                         Option A: Reply from Slack
//                       </p>
//                     </div>
//                     <Paragraph variant="docs-par" className="mb-4">
//                     <ul className="list-disc list-inside space-y-3 font-schibsted">
//                       <li>Hover over the chat notification message in Slack in the integrated channel.</li>
//                       <li>Click <strong>Reply in thread</strong>.</li>
//                       <li>Type your message and send it.</li>
//                     </ul>
//                     </Paragraph>
//                   </div>

//                   <div className="mb-4">
//                     <div className="flex items-center gap-2 mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 border border-neutral-300 rounded px-2 py-1 w-max">
//                       <p className="font-schibsted font-semibold text-neutral-100 text-sm">
//                         Option B: Reply from Dashboard
//                       </p>
//                     </div>
//                     <Paragraph variant="docs-par" className="mb-4">
//                     <ul className="list-disc list-inside space-y-3 font-schibsted">
//                       <li>Go to <CustomLink href="/dashboard/live-chats" className="text-sky-800 hover:text-sky-900 font-semibold underline">Dashboard → Live Chats</CustomLink>.</li>
//                       <li>Select the active conversation in the sidebar.</li>
//                       <li>Type your message in the chat window and hit send.</li>
//                     </ul>
//                     </Paragraph>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <DocsNavigation
//         prev={{ title: "Slack Integration", href: "/docs/integrations/slack" }}
//         next={{ title: "Troubleshooting", href: "/docs/troubleshooting" }}
//       />
//     </article>
//   );
// }



import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatbotPage() {
  return (
    <article className="prose prose-neutral max-w-none">

      {/* ── Header ── */}
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Chat Widget
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          How to Integrate Live Chat Widget on Your Website
        </Heading>
        <Paragraph variant="default" className="text-neutral-600 font-schibsted leading-relaxed">
          Add a beautiful live chat widget to your website. Visitors can chat
          with your team directly, and your team can reply directly from
          Slack—creating a seamless customer support experience.
        </Paragraph>
      </div>

      {/* ── Prerequisites ── */}
      <div className="mb-8">
        <Callout type="info" title="Before You Start">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Domain must be added and configured.{" "}
              <CustomLink
                href="/docs/domains"
                className="text-sky-800 hover:text-sky-900 underline"
              >
                How to add a domain
              </CustomLink>
            </li>
            <li>
              At least one integration (Slack or Discord) must be set up.{" "}
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
                  Create a Chat Widget
                </div>
              </Heading>
              <Paragraph variant="docs-par" className="mb-0 pl-8">
                <ol className="list-decimal list-inside space-y-2 font-schibsted">
                  <li>
                    Go to{" "}
                    <CustomLink
                      href="/dashboard/chat-widgets"
                      className="text-sky-800 hover:text-sky-900"
                    >
                      Dashboard → Chat Widgets
                    </CustomLink>
                    .
                  </li>
                  <li>Click <Highlight>Create Widget</Highlight>.</li>
                  <li>Select the verified domain where the widget will be hosted.</li>
                  <li>
                    Select the Integration (Slack or Discord) that will receive
                    the chat messages.
                  </li>
                  <li>
                    Customize the <Highlight>Welcome Message</Highlight> and{" "}
                    <Highlight>Accent Color</Highlight> to match your brand.
                  </li>
                  <li>Click <Highlight>Create Widget</Highlight>.</li>
                </ol>
              </Paragraph>
            </CardContent>
          </Card>
        </div>

        {/* ── Step 2 ── */}
        <div className="relative flex gap-4 pb-3">
          <div className="relative z-10 flex-shrink-0 pt-1">
            <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-semibold font-schibsted">
              2
            </span>
          </div>
          <Card className="flex-1 overflow-hidden">
            <CardContent className="px-0">
              <Heading as="h2" variant="small" className="text-neutral-100 mb-4">
                <div className="inline-flex items-center w-full mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
                  Embed on Your Website
                </div>
              </Heading>
              <Paragraph variant="docs-par" className="mb-4 pl-8">
                Once created, you will be provided with an Activation Key and
                an Embed Script. Add the script to your website's HTML before
                the closing <Highlight>&lt;/body&gt;</Highlight> tag.
              </Paragraph>
              <div className="pl-8">
              <CodeBlock
                code={`<!-- Email Router Chat Widget -->
<script>window.CHAT_KEY = 'YOUR_ACTIVATION_KEY_HERE';</script>
<script async src="https://your-email-router-domain.com/chat/widget.js"></script>`}
                language="html"
                filename="index.html"
                className=""
              />
              </div>
              <Paragraph variant="docs-par" className="mt-4 mb-0 pl-8">
                Replace <Highlight>YOUR_ACTIVATION_KEY_HERE</Highlight> with
                the activation key provided in the dashboard. The widget will
                automatically load and apply your custom branding.
              </Paragraph>
            </CardContent>
          </Card>
        </div>

        {/* ── Step 3 ── */}
        <div className="relative flex gap-4">
          <div className="relative z-10 flex-shrink-0 pt-1">
            <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-semibold font-schibsted">
              3
            </span>
          </div>
          <Card className="flex-1">
            <CardContent className="px-0">
              <Heading as="h2" variant="small" className="text-neutral-100 mb-4">
                <div className="inline-flex items-center w-full mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
                  Reply in Real-Time
                </div>
              </Heading>
              <Paragraph variant="docs-par" className="mb-4 pl-8 font-schibsted">
                When a visitor starts a chat, you can reply to them instantly
                from two places: your <Highlight>Slack workspace</Highlight> or
                your <Highlight>Email Router dashboard</Highlight>.
              </Paragraph>

              {/* Option A */}
              <div className="mb-4 pl-8">
                <div className="inline-flex items-center mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-1">
                  <p className="font-schibsted font-semibold text-white text-sm">
                    Option A: Reply from Slack
                  </p>
                </div>
                <Paragraph variant="docs-par" className="mb-4 pl-4">
                <ul className="list-disc list-inside space-y-2 font-schibsted">
                  <li>Hover over the chat notification message in Slack in the integrated channel.</li>
                  <li>Click <strong>Reply in thread</strong>.</li>
                  <li>Type your message and send it.</li>
                </ul>
                </Paragraph>
              </div>

              {/* Option B */}
              <div className="mb-4 pl-8">
                <div className="inline-flex items-center mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-1">
                  <p className="font-schibsted font-semibold text-white text-sm">
                    Option B: Reply from Dashboard
                  </p>
                </div>

                <Paragraph variant="docs-par" className="mb-4 pl-4">
                <ul className="list-disc list-inside space-y-2 font-schibsted">
                  <li>
                    Go to{" "}
                    <CustomLink
                      href="/dashboard/live-chats"
                      className="text-sky-800 hover:text-sky-900 font-semibold underline"
                    >
                      Dashboard → Live Chats
                    </CustomLink>
                    .
                  </li>
                  <li>Select the active conversation in the sidebar.</li>
                  <li>Type your message in the chat window and hit send.</li>
                </ul>
                </Paragraph>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* ── Navigation ── */}
      <DocsNavigation
        prev={{ title: "Slack Integration", href: "/docs/integrations/slack" }}
        next={{ title: "Troubleshooting", href: "/docs/troubleshooting" }}
      />

    </article>
  );
}
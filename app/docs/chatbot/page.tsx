import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Power, RadioTower } from "lucide-react";

export default function ChatbotPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Chat Widget
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Chat Widgets & Live Chat
        </Heading>
        <Paragraph variant="default" className="text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed">
          Add a beautiful live chat widget to your website. Visitors can chat with your team directly, 
          and your team can reply directly from Slack—creating a seamless customer support experience.
        </Paragraph>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Complete Setup in 3 Steps
        </Heading>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <Card className="border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-indigo-100 p-3 mt-1">
                  <Power className="size-6 text-indigo-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-2">
                    Step 1: Create a Chat Widget
                  </h3>
                  <Paragraph variant="docs-par" className="mb-4">
                    Generate and customize an embeddable widget directly from your dashboard.
                  </Paragraph>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-600 font-schibsted">
                    <li>Go to <CustomLink href="/dashboard/chat-widgets" className="text-sky-800 hover:text-sky-900 underline font-semibold">Dashboard → Chat Widgets</CustomLink>.</li>
                    <li>Click <strong>Create Widget</strong>.</li>
                    <li>Select the verified domain where the widget will be hosted.</li>
                    <li>Select the Integration (Slack or Discord) that will receive the chat messages.</li>
                    <li>Customize the <strong>Welcome Message</strong> and <strong>Accent Color</strong> to match your brand.</li>
                    <li>Click <strong>Create Widget</strong>.</li>
                  </ol>
                  <div className="mt-4">
                    <Callout type="info" title="Prerequisites">
                      You must have at least one verified domain and one active integration before creating a chat widget.
                    </Callout>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-sky-100 p-3 mt-1">
                  <MessageSquare className="size-6 text-sky-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-2">
                    Step 2: Embed on Your Website
                  </h3>
                  <Paragraph variant="docs-par" className="mb-4">
                    Once created, you will be provided with an Activation Key and an Embed Script. Add the script to your website's HTML before the closing <Highlight>&lt;/body&gt;</Highlight> tag.
                  </Paragraph>
                  <CodeBlock
                    code={`<!-- Email Router Chat Widget -->
<script>window.CHAT_KEY = 'YOUR_ACTIVATION_KEY_HERE';</script>
<script async src="https://your-email-router-domain.com/chat/widget.js"></script>`}
                    language="html"
                    filename="index.html"
                  />
                  <Paragraph variant="docs-par" className="mt-4 text-xs italic">
                    Replace <Highlight>YOUR_ACTIVATION_KEY_HERE</Highlight> with the activation key provided in the dashboard. The widget will automatically load and apply your custom branding.
                  </Paragraph>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border border-neutral-200 bg-sky-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-amber-100 p-3 mt-1 border border-amber-200">
                  <RadioTower className="size-6 text-amber-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-2">
                    Step 3: Reply in Real-Time
                  </h3>
                  <Paragraph variant="docs-par" className="mb-4">
                    When a visitor starts a chat, you can reply to them instantly from two places: your Slack workspace or your Email Router dashboard.
                  </Paragraph>
                  
                  <div className="mb-4">
                    <h4 className="font-schibsted font-semibold text-neutral-900 text-sm mb-2">Option A: Reply from Slack</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-neutral-600 font-schibsted">
                      <li>Hover over the chat notification message in Slack.</li>
                      <li>Click <strong>Reply in thread</strong>.</li>
                      <li>Type your message and send it.</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-schibsted font-semibold text-neutral-900 text-sm mb-2">Option B: Reply from Dashboard</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-neutral-600 font-schibsted">
                      <li>Go to <CustomLink href="/dashboard/live-chats" className="text-sky-800 hover:text-sky-900 font-semibold underline">Dashboard → Live Chats</CustomLink>.</li>
                      <li>Select the active conversation in the sidebar.</li>
                      <li>Type your message in the chat window and hit send.</li>
                    </ul>
                  </div>

                  <Callout type="tip" title="Lightning FastSync">
                    Email Router uses persistent WebSockets under the hood to ensure that delays are minimal. Responses usually appear in less than a second!
                  </Callout>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DocsNavigation
        prev={{ title: "Slack Integration", href: "/docs/integrations/slack" }}
        next={{ title: "Troubleshooting", href: "/docs/troubleshooting" }}
      />
    </article>
  );
}
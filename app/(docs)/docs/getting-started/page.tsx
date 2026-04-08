import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Zap, Users, BarChart3 } from "lucide-react";
import { DocsPage, DocsBody } from "fumadocs-ui/page";

export default function GettingStartedPage() {
  return (
    <DocsPage toc={[]}>
    <DocsBody className="prose prose-neutral max-w-none">
      {/* Hero Section */}
      <div className="mb-12">
        <Heading as="h1" className="text-neutral-900 mb-4">
          Welcome to SlackDesk
        </Heading>
        <Paragraph variant="default" className="text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed">
          Email Router helps teams manage customer support emails directly in Slack or Discord. 
          Route emails to channels, assign tickets, and respond faster—all without leaving your workspace.
        </Paragraph>
      </div>

      {/* Key Features */}
      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Key Features
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-sky-100 p-3">
                  <Mail className="size-6 text-sky-800" />
                </div>
                <div>
                  <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
                    Email to Slack Routing
                  </h3>
                  <Paragraph variant="small" className="text-neutral-600">
                    Automatically route support@, sales@, and billing@ emails to dedicated Slack channels
                  </Paragraph>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-purple-100 p-3">
                  <Zap className="size-6 text-purple-800" />
                </div>
                <div>
                  <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
                    Instant Notifications
                  </h3>
                  <Paragraph variant="small" className="text-neutral-600">
                    Team sees every email in 2-5 seconds, no more checking email clients
                  </Paragraph>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <Users className="size-6 text-green-800" />
                </div>
                <div>
                  <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
                    Ticket Management
                  </h3>
                  <Paragraph variant="small" className="text-neutral-600">
                    Claim tickets, track status, assign to team members, and collaborate
                  </Paragraph>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-amber-100 p-3">
                  <BarChart3 className="size-6 text-amber-800" />
                </div>
                <div>
                  <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
                    Performance Analytics
                  </h3>
                  <Paragraph variant="small" className="text-neutral-600">
                    Track response times, ticket volume, and team performance metrics
                  </Paragraph>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Quick Start
        </Heading>
        <Paragraph variant="default" className="mb-6">
          Get up and running in <Highlight>5 minutes</Highlight>. Here's what you'll need:
        </Paragraph>

        <Callout type="tip" title="Prerequisites">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>A Slack or Discord workspace</li>
            <li>Access to your domain's DNS settings</li>
            <li>5 minutes of setup time</li>
          </ul>
        </Callout>

        <div className="mt-6">
          <Paragraph variant="default" className="mb-4">
            Follow these steps to get started:
          </Paragraph>
          <ol className="list-decimal list-inside space-y-2 font-schibsted font-normal text-sm text-neutral-600">
            <li>Create a Slack or Discord webhook</li>
            <li>Add the integration in Email Router</li>
            <li>Configure your domain</li>
            <li>Create email aliases</li>
            <li>Send a test email</li>
          </ol>
        </div>

        <div className="mt-6">
          <CustomLink
            href="/docs/getting-started"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-800 px-6 py-3 text-sm font-schibsted font-semibold text-white hover:bg-sky-900 transition-colors"
          >
            Read Full Quick Start Guide →
          </CustomLink>
        </div>
      </div>

      {/* Example */}
      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Example: Route Support Emails
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Here's how to route <Highlight>support@yourdomain.com</Highlight> to your Slack #customer-support channel:
        </Paragraph>

        <CodeBlock
          code={`// 1. Create Slack webhook
              Webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL

              // 2. Add integration
              POST /api/integrations
              {
                "type": "slack",
                "name": "Customer Support",
                "webhookUrl": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
              }

              // 3. Create alias
              POST /api/aliases
              {
                "localPart": "support",
                "domainId": "your-domain-id",
                "integrationId": "your-integration-id"
              }`}
          language="javascript"
          filename="setup-example.js"
        />

        <Callout type="success" title="That's it!" className="mt-4">
          Emails to support@yourdomain.com now appear in your Slack channel within 2-5 seconds!
        </Callout>
      </div>

      {/* Popular Guides */}
      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Popular Guides
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomLink
            href="/docs/integrations/slack"
            className="block rounded-lg border border-neutral-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
          >
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
              Slack Integration
            </h3>
            <Paragraph variant="small" className="text-neutral-600">
              Connect Email Router to your Slack workspace
            </Paragraph>
          </CustomLink>

          <CustomLink
            href="/docs/domains"
            className="block rounded-lg border border-neutral-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
          >
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
              DNS Configuration
            </h3>
            <Paragraph variant="small" className="text-neutral-600">
              Set up MX records and email forwarding
            </Paragraph>
          </CustomLink>

          <CustomLink
            href="/docs/api"
            className="block rounded-lg border border-neutral-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
          >
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-2">
              API Reference
            </h3>
            <Paragraph variant="small" className="text-neutral-600">
              Integrate Email Router with your apps
            </Paragraph>
          </CustomLink>
        </div>
      </div>

      {/* Navigation */}
      <DocsNavigation
        next={{
          title: "Quick Start",
          href: "/docs/getting-started",
        }}
      />
    </DocsBody>
    </DocsPage>
  );
}
'use client';

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { DashboardLink } from "@/components/docs/DashboardLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { StepIndicator } from "@/components/docs/StepIndicator";
import { Badge } from "@/components/ui/badge";


import { DocsPage, DocsBody } from "fumadocs-ui/page";

export default function DiscordIntegrationPage() {
  const steps = [
    {
      title: "Open Discord Server Settings",
      description: "Access your server configuration",
    },
    {
      title: "Create Webhook",
      description: "Set up a new webhook for your channel",
    },
    {
      title: "Copy Webhook URL",
      description: "Get the URL to add in Email Router",
    },
    {
      title: "Add to Email Router",
      description: "Configure the integration in the dashboard",
    },
  ];

  return (
    <DocsPage toc={[]}>
    <DocsBody className="prose prose-neutral max-w-none">
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Integrations
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Discord Integration
        </Heading>
        <Paragraph variant="docs-par" className="">
          Connect Email Router to your Discord server and receive email notifications in your channels.
        </Paragraph>
      </div>

      {/* <div className="my-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Setup Steps
        </Heading>
        <StepIndicator steps={steps} currentStep={0} />
      </div> */}

      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Step 1: Open Server Settings
        </Heading>

        <Paragraph variant="docs-par" className="mb-4">
        <ol className="list-decimal list-inside space-y-3">
          <li>Open Discord and navigate to your server</li>
          <li>Right-click on the channel where you want notifications</li>
          <li>Select "Edit Channel"</li>
          <li>Go to "Integrations" tab</li>
          <li>Click "Webhooks" or "Create Webhook"</li>
        </ol>
        </Paragraph>
      </div>

      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Step 2: Create Webhook
        </Heading>

        <Paragraph variant="docs-par" className="mb-4">
          <ol className="list-decimal list-inside space-y-3">
            <li>Click "New Webhook"</li>
            <li>Name it "Email Router"</li>
            <li>Optional: Upload a custom avatar</li>
            <li>Select the channel (e.g., <Highlight>#support</Highlight>)</li>
            <li>Click "Copy Webhook URL"</li>
            <li>Save changes</li>
          </ol>
        </Paragraph>
        {/* <Callout type="tip" title="Webhook URL Format">
          Discord webhook URLs look like this:
          <CodeBlock
            code="https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz"
            language="text"
            className="mt-3"
          />
        </Callout> */}
      </div>

      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Step 3: Add to Email Router
        </Heading>
        <Paragraph variant="docs-par" className="mb-4">
          Add the Discord webhook to Email Router:
        </Paragraph>

        <Paragraph variant="docs-par" className="mb-4">
        <ol className="list-decimal list-inside space-y-3 ">
          <li>Go to <DashboardLink href="/dashboard/integrations" className="text-sky-800 hover:text-sky-900 underline">Dashboard → Integrations</DashboardLink></li>
          <li>Click "Add Integration"</li>
          <li>Type: Select "Discord"</li>
          <li>Name: Enter a descriptive name</li>
          <li>Webhook URL: Paste your Discord webhook URL</li>
          <li>Click "Create Integration"</li>
        </ol>
        </Paragraph>
      </div>

      {/* <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Message Format
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Emails will appear in Discord with this format:
        </Paragraph>
        <CodeBlock
          code={`📧 **New email to support@yourdomain.com**
**From:** customer@email.com
**Subject:** Need help with billing

Hi, I need help with my invoice. I was charged twice this month...`}
          language="markdown"
          filename="discord-message-example.md"
        />
      </div> */}

      {/* <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Test Your Integration
        </Heading>
        <ol className="list-decimal list-inside space-y-3 font-schibsted font-normal text-sm text-neutral-600 mb-6">
          <li>Create an email alias linked to this Discord integration</li>
          <li>Send a test email to that alias</li>
          <li>Check your Discord channel</li>
          <li>Message should appear within 2-5 seconds</li>
        </ol>
        <Callout type="success" title="Success!">
          You should see a formatted message in your Discord channel with the sender, subject, and email content.
        </Callout>
      </div> */}

      <DocsNavigation
        prev={{
          title: "Slack Integration",
          href: "/docs/integrations/slack",
        }}
        next={{
          title: "Create Email Alias",
          href: "/docs/aliases",
        }}
      />
    </DocsBody>
    </DocsPage>
  );
}
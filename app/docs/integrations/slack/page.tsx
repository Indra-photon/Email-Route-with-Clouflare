import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { StepIndicator } from "@/components/docs/StepIndicator";
import { Badge } from "@/components/ui/badge";

export default function SlackIntegrationPage() {
  const steps = [
    {
      title: "Create Slack App",
      description: "Set up a new app in your Slack workspace",
    },
    {
      title: "Enable Incoming Webhooks",
      description: "Activate webhook functionality",
    },
    {
      title: "Add Webhook to Channel",
      description: "Connect the webhook to your target channel",
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
    <article className="prose prose-neutral max-w-none">
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Integrations
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Slack Integration
        </Heading>
        <Paragraph variant="docs-par" className="">
          Connect Email Router to your Slack workspace and receive email notifications in your channels.
        </Paragraph>
      </div>

      {/* <Callout type="info" title="Prerequisites">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Slack workspace admin access</li>
          <li>Permission to install apps in your workspace</li>
        </ul>
      </Callout> */}

      {/* <div className="my-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Setup Steps
        </Heading>
        <StepIndicator steps={steps} currentStep={0} />
      </div> */}

      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Step 1: Create Slack App
        </Heading>

        <Paragraph variant="muted" className="mb-4">
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to <CustomLink href="https://api.slack.com/apps" className="text-sky-800 hover:text-sky-900 underline">api.slack.com/apps</CustomLink></li>
          <li>Click "Create New App"</li>
          <li>Select "From scratch"</li>
          <li>Name: "Email Router"</li>
          <li>Choose your workspace</li>
          <li>Click "Create App"</li>
        </ol>
        </Paragraph>
      </div>

      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Step 2: Enable Incoming Webhooks
        </Heading>

        <Paragraph variant="docs-par" className="mb-4">
        <ol className="list-decimal list-inside space-y-2">
          <li>In your app settings, find "Incoming Webhooks" in the sidebar</li>
          <li>Toggle "Activate Incoming Webhooks" to ON</li>
          <li>Scroll down to "Webhook URLs for Your Workspace"</li>
          <li>Click "Add New Webhook to Workspace"</li>
        </ol>
        </Paragraph>
      </div>

      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Step 3: Select Channel
        </Heading>
        <Paragraph variant="docs-par" className="mb-4">
          Choose which Slack channel will receive email notifications:
        </Paragraph>
        <ul className="list-disc list-inside space-y-2 font-schibsted font-normal text-sm text-neutral-600 mb-6">
          <li><Highlight>#customer-support</Highlight> - For support@ emails</li>
          <li><Highlight>#sales</Highlight> - For sales@ inquiries</li>
          <li><Highlight>#billing</Highlight> - For billing@ questions</li>
        </ul>
      </div>

      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Step 4: Copy Webhook URL
        </Heading>
        <Paragraph variant="docs-par" className="mb-4">
          After selecting a channel, Slack will generate a webhook URL:
        </Paragraph>
        <CodeBlock
          code="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX"
          language="text"
        />
        <Callout type="warning" className="mt-4" title="Keep It Secret">
          This URL allows anyone to post to your Slack channel. Don't share it publicly!
        </Callout>
      </div>

      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4 text-2xl">
          Step 5: Add to Email Router
        </Heading>
        <Paragraph variant="docs-par" className="mb-4">
          Finally, add the integration in Email Router:
        </Paragraph>

        <Paragraph variant="docs-par" className="mb-4">
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to <CustomLink href="/dashboard/integrations" className="text-sky-800 hover:text-sky-900 underline">Dashboard → Integrations</CustomLink></li>
          <li>Click "Add Integration"</li>
          <li>Type: Select "Slack"</li>
          <li>Name: Enter a descriptive name (e.g., "Customer Support")</li>
          <li>Webhook URL: Paste your Slack webhook URL</li>
          <li>Click "Create Integration"</li>
        </ol>
        </Paragraph>
      </div>

      <DocsNavigation
        prev={{
          title: "Integrations Overview",
          href: "/docs/integrations",
        }}
        next={{
          title: "Discord Integration",
          href: "/docs/integrations/discord",
        }}
      />
    </article>
  );
}
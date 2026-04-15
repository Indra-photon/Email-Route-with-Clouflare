import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { DocsPage, DocsBody } from "fumadocs-ui/page";

export default function TroubleshootingPage() {
  return (
    <DocsPage toc={[]}>
    <DocsBody className="prose prose-neutral max-w-none">
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Troubleshooting
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Troubleshooting Guide
        </Heading>
        <Paragraph variant="default" className="text-neutral-600">
          Common issues and how to fix them. Find solutions to emails not arriving, webhook failures, and DNS problems.
        </Paragraph>
      </div>

      <Callout type="info" title="Still Need Help?">
        If you can't find a solution here, contact support at <CustomLink href="mailto:support@syncsupport.app" className="text-sky-800 hover:text-sky-900 underline">support@syncsupport.app</CustomLink>
      </Callout>

      <div className="my-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Emails Not Arriving
        </Heading>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Emails not showing up in Slack/Discord
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ol className="list-decimal list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Check MX records are configured correctly</li>
              <li>Wait 30 minutes for DNS propagation</li>
              <li>Verify webhook URL is correct in integration settings</li>
              <li>Check alias is active and linked to correct integration</li>
              <li>Test with: <Highlight>dig MX yourdomain.com</Highlight></li>
            </ol>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: MX records not updating
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ul className="list-disc list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Remove old MX records before adding new ones</li>
              <li>Clear local DNS cache: <Highlight>ipconfig /flushdns</Highlight> (Windows) or <Highlight>sudo dscacheutil -flushcache</Highlight> (Mac)</li>
              <li>Check propagation at <CustomLink href="https://mxtoolbox.com" className="text-sky-800 hover:text-sky-900 underline">MXToolbox.com</CustomLink></li>
              <li>Contact your DNS provider support</li>
            </ul>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Emails going to spam
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ul className="list-disc list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Add SPF record: <Highlight>v=spf1 include:spf.resend.dev ~all</Highlight></li>
              <li>Configure DKIM for domain authentication</li>
              <li>Set up DMARC policy</li>
              <li>Ask recipients to whitelist your domain</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Webhook Issues
        </Heading>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Slack webhook failing
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ol className="list-decimal list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Verify webhook URL starts with <Highlight>https://hooks.slack.com/services/</Highlight></li>
              <li>Check webhook wasn't deleted in Slack settings</li>
              <li>Recreate webhook if it was regenerated</li>
              <li>Test webhook manually with curl:</li>
            </ol>
            <CodeBlock
              code={`curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \\
  -H 'Content-Type: application/json' \\
  -d '{"text":"Test message"}'`}
              language="bash"
              className="mt-3"
            />
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Discord webhook not working
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ul className="list-disc list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Ensure URL format: <Highlight>https://discord.com/api/webhooks/...</Highlight></li>
              <li>Check webhook wasn't deleted in Discord channel settings</li>
              <li>Verify bot has permission to post in channel</li>
              <li>Test with Discord's webhook tester</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Performance Issues
        </Heading>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Slow email delivery
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ul className="list-disc list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Normal delivery: 2-5 seconds</li>
              <li>Check if your DNS provider has propagation delays</li>
              <li>Verify Slack/Discord isn't rate limiting</li>
              <li>Contact support if consistently over 10 seconds</li>
            </ul>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Dashboard loading slowly
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ul className="list-disc list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Clear browser cache and cookies</li>
              <li>Try incognito/private browsing mode</li>
              <li>Disable browser extensions temporarily</li>
              <li>Check internet connection speed</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Integration Problems
        </Heading>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Can't add integration
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ul className="list-disc list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Check you have admin access to workspace</li>
              <li>Ensure webhook URL is valid and accessible</li>
              <li>Try creating integration again</li>
              <li>Check browser console for error messages</li>
            </ul>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Integration deleted accidentally
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ul className="list-disc list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Recreate the integration with same webhook URL</li>
              <li>Update aliases to point to new integration ID</li>
              <li>No email history is lost - only routing configuration</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Ticket Management Issues
        </Heading>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Can't claim ticket
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ul className="list-disc list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Ticket may already be claimed by another team member</li>
              <li>Refresh the page to see latest status</li>
              <li>Check you have agent or admin role</li>
            </ul>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-base font-schibsted font-semibold text-neutral-900 mb-3">
              Problem: Reply not sending
            </h3>
            <Paragraph variant="default" className="mb-3">
              <strong className="font-schibsted font-semibold">Solution:</strong>
            </Paragraph>
            <ul className="list-disc list-inside space-y-2 text-sm font-schibsted font-normal text-neutral-600">
              <li>Verify sender domain is configured correctly</li>
              <li>Check SPF/DKIM records are set up</li>
              <li>Ensure reply-to email address is valid</li>
              <li>Check API error logs in dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Diagnostic Tools
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Use these tools to diagnose issues:
        </Paragraph>

        <div className="space-y-3">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
              Check MX Records
            </h3>
            <CodeBlock
              code="dig MX yourdomain.com"
              language="bash"
            />
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
              Test Webhook
            </h3>
            <CodeBlock
              code={`curl -X POST YOUR_WEBHOOK_URL \\
  -H 'Content-Type: application/json' \\
  -d '{"text":"Test"}'`}
              language="bash"
            />
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
              Verify DNS Propagation
            </h3>
            <Paragraph variant="small" className="text-neutral-600">
              Visit <CustomLink href="https://mxtoolbox.com" className="text-sky-800 hover:text-sky-900 underline">MXToolbox.com</CustomLink> or <CustomLink href="https://dnschecker.org" className="text-sky-800 hover:text-sky-900 underline">DNSChecker.org</CustomLink>
            </Paragraph>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Getting Help
        </Heading>
        <Paragraph variant="default" className="mb-4">
          If you're still experiencing issues:
        </Paragraph>
        <ul className="list-disc list-inside space-y-2 font-schibsted font-normal text-sm text-neutral-600">
          <li>Email support: <CustomLink href="mailto:support@syncsupport.app" className="text-sky-800 hover:text-sky-900 underline">support@syncsupport.app</CustomLink></li>
          <li>Include: domain name, error messages, screenshots</li>
          <li>Response time: Usually within 4 hours</li>
        </ul>
      </div>

      <DocsNavigation
        prev={{ title: "Advanced", href: "/docs/advanced" }}
        next={{ title: "Resources", href: "/docs/resources" }}
      />
    </DocsBody>
    </DocsPage>
  );
}
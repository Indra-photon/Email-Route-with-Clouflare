import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DocsPage, DocsBody } from "fumadocs-ui/page";

export default function AdvancedPage() {
  return (
    <DocsPage toc={[]}>
    <DocsBody className="prose prose-neutral max-w-none">
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Advanced
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Advanced Configuration
        </Heading>
        <Paragraph variant="default" className="text-neutral-600">
          Email forwarding rules, custom domains, team management, analytics, and advanced workflows.
        </Paragraph>
      </div>

      <div className="my-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Email Forwarding Rules
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Create advanced routing rules based on sender, subject, or content:
        </Paragraph>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                Route by Sender Domain
              </h3>
              <Paragraph variant="small" className="text-neutral-600 mb-3">
                Send emails from specific domains to different channels
              </Paragraph>
              <CodeBlock
                code={`{
  "rule": "sender_domain",
  "condition": "@enterprise-customer.com",
  "action": "route_to",
  "integrationId": "int_vip_channel"
}`}
                language="json"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                Route by Subject Keywords
              </h3>
              <Paragraph variant="small" className="text-neutral-600 mb-3">
                Filter emails containing specific words in the subject
              </Paragraph>
              <CodeBlock
                code={`{
  "rule": "subject_contains",
  "condition": ["urgent", "critical", "emergency"],
  "action": "route_to",
  "integrationId": "int_priority_channel"
}`}
                language="json"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                Auto-Assign by Content
              </h3>
              <Paragraph variant="small" className="text-neutral-600 mb-3">
                Automatically assign tickets based on email content
              </Paragraph>
              <CodeBlock
                code={`{
  "rule": "body_contains",
  "condition": ["refund", "cancellation"],
  "action": "assign_to",
  "userId": "user_billing_specialist"
}`}
                language="json"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Custom Domains
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Use your own domain for sending replies:
        </Paragraph>

        <ol className="list-decimal list-inside space-y-3 font-schibsted font-normal text-sm text-neutral-600 mb-6">
          <li>Verify domain ownership via DNS TXT record</li>
          <li>Add DKIM and SPF records for email authentication</li>
          <li>Configure custom sending domain in dashboard</li>
          <li>Replies will come from <Highlight>your-name@yourdomain.com</Highlight></li>
        </ol>

        <CodeBlock
          code={`# DNS Records for Custom Sending Domain

TXT  _domainkey.yourdomain.com    "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY"
TXT  yourdomain.com                "v=spf1 include:spf.resend.dev ~all"
TXT  _dmarc.yourdomain.com         "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"`}
          language="text"
          filename="custom-domain-dns.txt"
        />
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Team Management
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Manage team members and permissions:
        </Paragraph>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                Admin
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs font-schibsted font-normal text-neutral-600">
                <li>Full access</li>
                <li>Manage team</li>
                <li>Configure integrations</li>
                <li>View analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                Agent
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs font-schibsted font-normal text-neutral-600">
                <li>View tickets</li>
                <li>Claim tickets</li>
                <li>Reply to customers</li>
                <li>Update status</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                Viewer
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs font-schibsted font-normal text-neutral-600">
                <li>View tickets</li>
                <li>Read-only access</li>
                <li>No modifications</li>
                <li>View analytics</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Callout type="tip" title="Invite Team Members">
          Go to <CustomLink href="/dashboard/settings/team" className="text-sky-800 hover:text-sky-900 underline">Settings → Team</CustomLink> to invite members and assign roles.
        </Callout>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Analytics & Reporting
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Track key performance metrics:
        </Paragraph>

        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
              Response Time Metrics
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm font-schibsted font-normal text-neutral-600">
              <li>Average first response time</li>
              <li>Average resolution time</li>
              <li>Response time by team member</li>
              <li>Response time trends (daily, weekly, monthly)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
              Volume Metrics
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm font-schibsted font-normal text-neutral-600">
              <li>Total tickets received</li>
              <li>Tickets by status (open, in progress, resolved)</li>
              <li>Tickets by channel/integration</li>
              <li>Peak hours and days</li>
            </ul>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
              Team Performance
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm font-schibsted font-normal text-neutral-600">
              <li>Tickets handled per team member</li>
              <li>Average resolution time per agent</li>
              <li>Customer satisfaction ratings</li>
              <li>Most active agents</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Webhooks
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Configure webhooks to receive real-time notifications:
        </Paragraph>

        <CodeBlock
          code={`POST https://your-server.com/webhooks/emailrouter

Event Types:
- ticket.created
- ticket.claimed
- ticket.resolved
- ticket.replied

Payload:
{
  "event": "ticket.created",
  "timestamp": "2024-02-28T10:00:00Z",
  "data": {
    "ticketId": "ticket_abc123",
    "from": "customer@email.com",
    "subject": "Need help"
  }
}`}
          language="json"
          filename="webhook-events.json"
        />
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          SLA Management
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Set service level agreements for response times:
        </Paragraph>

        <CodeBlock
          code={`{
  "sla_rules": [
    {
      "priority": "high",
      "first_response": "15 minutes",
      "resolution": "2 hours"
    },
    {
      "priority": "normal",
      "first_response": "1 hour",
      "resolution": "24 hours"
    },
    {
      "priority": "low",
      "first_response": "4 hours",
      "resolution": "72 hours"
    }
  ]
}`}
          language="json"
          filename="sla-config.json"
        />

        <Callout type="info" title="SLA Alerts" className="mt-4">
          Get notified in Slack when tickets are approaching SLA breach.
        </Callout>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          API Automation
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Automate workflows with the API:
        </Paragraph>

        <div className="space-y-4">
          <Callout type="tip" title="Auto-Create Tickets from Forms">
            Connect your contact forms to create tickets automatically via API
          </Callout>

          <Callout type="tip" title="Sync with CRM">
            Create tickets in your CRM when resolved in Email Router
          </Callout>

          <Callout type="tip" title="Scheduled Reports">
            Use API to generate weekly/monthly performance reports
          </Callout>
        </div>
      </div>

      <DocsNavigation
        prev={{ title: "API Reference", href: "/docs/api" }}
        next={{ title: "Troubleshooting", href: "/docs/troubleshooting" }}
      />
    </DocsBody>
    </DocsPage>
  );
}
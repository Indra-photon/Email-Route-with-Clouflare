import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";

export default function APIPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          API Reference
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          API Reference
        </Heading>
        <Paragraph variant="default" className="text-neutral-600">
          Integrate Email Router with your applications using our REST API. 
          Automate domain setup, alias creation, and ticket management.
        </Paragraph>
      </div>

      <Callout type="info" title="API Keys">
        API keys are coming soon. For now, use session-based authentication through the dashboard.
      </Callout>

      <div className="my-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Authentication
        </Heading>
        <Paragraph variant="default" className="mb-4">
          All API requests require authentication using your API key:
        </Paragraph>

        <CodeBlock
          code={`curl https://api.emailrouter.com/v1/domains \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
          language="bash"
          filename="auth-example.sh"
        />

        <Callout type="warning" title="Keep It Secret" className="mt-6">
          Never expose your API key in client-side code or public repositories.
        </Callout>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Base URL
        </Heading>
        <CodeBlock
          code="https://api.emailrouter.com/v1"
          language="text"
        />
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Domains API
        </Heading>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              List Domains
            </h3>
            <CodeBlock
              code={`GET /api/domains

Response:
{
  "domains": [
    {
      "id": "dom_abc123",
      "domain": "acme.com",
      "status": "active",
      "verified": true,
      "createdAt": "2024-02-20T10:00:00Z"
    }
  ]
}`}
              language="json"
              filename="list-domains.json"
            />
          </div>

          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              Create Domain
            </h3>
            <CodeBlock
              code={`POST /api/domains

Request:
{
  "domain": "example.com"
}

Response:
{
  "id": "dom_xyz789",
  "domain": "example.com",
  "status": "pending_verification",
  "mxRecords": [
    { "priority": 10, "value": "mx1.resend.dev" },
    { "priority": 20, "value": "mx2.resend.dev" }
  ]
}`}
              language="json"
              filename="create-domain.json"
            />
          </div>

          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              Get Domain
            </h3>
            <CodeBlock
              code={`GET /api/domains/{domainId}

Response:
{
  "id": "dom_abc123",
  "domain": "acme.com",
  "status": "active",
  "verified": true,
  "aliasCount": 5,
  "createdAt": "2024-02-20T10:00:00Z"
}`}
              language="json"
              filename="get-domain.json"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Integrations API
        </Heading>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              List Integrations
            </h3>
            <CodeBlock
              code={`GET /api/integrations

Response:
{
  "integrations": [
    {
      "id": "int_abc123",
      "type": "slack",
      "name": "Customer Support",
      "createdAt": "2024-02-21T15:30:00Z"
    }
  ]
}`}
              language="json"
              filename="list-integrations.json"
            />
          </div>

          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              Create Integration
            </h3>
            <CodeBlock
              code={`POST /api/integrations

Request:
{
  "type": "slack",
  "name": "Sales Team",
  "webhookUrl": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
}

Response:
{
  "id": "int_xyz789",
  "type": "slack",
  "name": "Sales Team",
  "createdAt": "2024-02-28T10:00:00Z"
}`}
              language="json"
              filename="create-integration.json"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Aliases API
        </Heading>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              List Aliases
            </h3>
            <CodeBlock
              code={`GET /api/aliases

Response:
{
  "aliases": [
    {
      "id": "alias_abc123",
      "email": "support@acme.com",
      "localPart": "support",
      "domainId": "dom_abc123",
      "integrationId": "int_abc123",
      "status": "active",
      "createdAt": "2024-02-22T09:00:00Z"
    }
  ]
}`}
              language="json"
              filename="list-aliases.json"
            />
          </div>

          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              Create Alias
            </h3>
            <CodeBlock
              code={`POST /api/aliases

Request:
{
  "domainId": "dom_abc123",
  "localPart": "billing",
  "integrationId": "int_xyz789"
}

Response:
{
  "id": "alias_xyz789",
  "email": "billing@acme.com",
  "localPart": "billing",
  "domainId": "dom_abc123",
  "integrationId": "int_xyz789",
  "status": "active",
  "createdAt": "2024-02-28T10:30:00Z"
}`}
              language="json"
              filename="create-alias.json"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Tickets API
        </Heading>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              List Tickets
            </h3>
            <CodeBlock
              code={`GET /api/emails/tickets/mine

Response:
{
  "tickets": [
    {
      "id": "ticket_abc123",
      "from": "customer@email.com",
      "fromName": "John Doe",
      "subject": "Need help with billing",
      "status": "in_progress",
      "assignedTo": "user_456",
      "receivedAt": "2024-02-28T09:00:00Z"
    }
  ]
}`}
              language="json"
              filename="list-tickets.json"
            />
          </div>

          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              Claim Ticket
            </h3>
            <CodeBlock
              code={`POST /api/emails/tickets/{ticketId}/claim

Response:
{
  "id": "ticket_abc123",
  "status": "in_progress",
  "assignedTo": "user_456",
  "claimedAt": "2024-02-28T10:00:00Z"
}`}
              language="json"
              filename="claim-ticket.json"
            />
          </div>

          <div>
            <h3 className="text-lg font-schibsted font-semibold text-neutral-900 mb-3">
              Update Status
            </h3>
            <CodeBlock
              code={`POST /api/emails/tickets/{ticketId}/status

Request:
{
  "status": "resolved"
}

Response:
{
  "id": "ticket_abc123",
  "status": "resolved",
  "resolvedAt": "2024-02-28T11:00:00Z"
}`}
              language="json"
              filename="update-ticket-status.json"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Error Handling
        </Heading>
        <Paragraph variant="default" className="mb-4">
          The API uses standard HTTP status codes:
        </Paragraph>

        <CodeBlock
          code={`200 - OK
201 - Created
400 - Bad Request (invalid parameters)
401 - Unauthorized (invalid API key)
404 - Not Found
429 - Too Many Requests (rate limited)
500 - Internal Server Error

Error Response:
{
  "error": {
    "code": "invalid_domain",
    "message": "Domain name is invalid"
  }
}`}
          language="json"
          filename="error-responses.json"
        />
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Rate Limits
        </Heading>
        <Paragraph variant="default" className="mb-4">
          API requests are rate limited:
        </Paragraph>
        <ul className="list-disc list-inside space-y-2 font-schibsted font-normal text-sm text-neutral-600 mb-6">
          <li><Highlight>100 requests/minute</Highlight> - Per API key</li>
          <li><Highlight>10,000 requests/day</Highlight> - Per workspace</li>
        </ul>

        <Callout type="tip" title="Rate Limit Headers">
          Check response headers for rate limit status: <Highlight>X-RateLimit-Remaining</Highlight> and <Highlight>X-RateLimit-Reset</Highlight>
        </Callout>
      </div>

      <DocsNavigation
        prev={{ title: "Chatbot Widget", href: "/docs/chatbot" }}
        next={{ title: "Advanced", href: "/docs/advanced" }}
      />
    </article>
  );
}
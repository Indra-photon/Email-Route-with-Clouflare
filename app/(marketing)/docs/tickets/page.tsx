import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function TicketsPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Ticket Management
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Ticket Management
        </Heading>
        <Paragraph variant="default" className="text-neutral-600">
          View, claim, assign, and track customer support tickets. Collaborate with your team to resolve issues faster.
        </Paragraph>
      </div>

      <Callout type="info" title="What Are Tickets?">
        Every inbound email becomes a ticket that can be claimed, tracked, and managed by your team.
      </Callout>

      <div className="my-12">
        <Heading as="h2" className="text-neutral-900 mb-6 text-2xl">
          Ticket Statuses
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-3 rounded-full bg-amber-500"></div>
                <h3 className="text-sm font-schibsted font-semibold text-neutral-900">
                  Open
                </h3>
              </div>
              <Paragraph variant="small" className="text-neutral-600">
                New unassigned tickets waiting to be claimed
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-3 rounded-full bg-sky-500"></div>
                <h3 className="text-sm font-schibsted font-semibold text-neutral-900">
                  In Progress
                </h3>
              </div>
              <Paragraph variant="small" className="text-neutral-600">
                Tickets claimed and actively being worked on
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-3 rounded-full bg-purple-500"></div>
                <h3 className="text-sm font-schibsted font-semibold text-neutral-900">
                  Waiting
                </h3>
              </div>
              <Paragraph variant="small" className="text-neutral-600">
                Waiting for customer response or external action
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-3 rounded-full bg-green-500"></div>
                <h3 className="text-sm font-schibsted font-semibold text-neutral-900">
                  Resolved
                </h3>
              </div>
              <Paragraph variant="small" className="text-neutral-600">
                Tickets successfully closed and resolved
              </Paragraph>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          View Tickets
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Access your tickets from the dashboard:
        </Paragraph>
        <ul className="list-disc list-inside space-y-2 font-schibsted font-normal text-sm text-neutral-600 mb-6">
          <li><CustomLink href="/dashboard/tickets/mine" className="text-sky-800 hover:text-sky-900 underline">My Tickets</CustomLink> - Tickets assigned to you</li>
          <li><CustomLink href="/dashboard/tickets/unassigned" className="text-sky-800 hover:text-sky-900 underline">Unassigned Tickets</CustomLink> - Available tickets to claim</li>
        </ul>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Claim a Ticket
        </Heading>
        <Paragraph variant="default" className="mb-4">
          When you see an unassigned ticket you want to handle:
        </Paragraph>
        <ol className="list-decimal list-inside space-y-3 font-schibsted font-normal text-sm text-neutral-600 mb-6">
          <li>Go to <CustomLink href="/dashboard/tickets/unassigned" className="text-sky-800 hover:text-sky-900 underline">Unassigned Tickets</CustomLink></li>
          <li>Find the ticket you want to handle</li>
          <li>Click "Claim" button</li>
          <li>Ticket is now assigned to you</li>
          <li>Status changes to "In Progress"</li>
        </ol>

        <CodeBlock
          code={`POST /api/emails/tickets/{ticketId}/claim

Response:
{
  "id": "ticket_123",
  "status": "in_progress",
  "assignedTo": "user_456",
  "claimedAt": "2024-02-28T10:30:00Z"
}`}
          language="json"
          filename="claim-ticket.json"
        />
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Reply to Customers
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Respond to customer emails directly from the ticket view:
        </Paragraph>
        <ol className="list-decimal list-inside space-y-3 font-schibsted font-normal text-sm text-neutral-600 mb-6">
          <li>Open the ticket details</li>
          <li>Click "Reply" button</li>
          <li>Compose your response</li>
          <li>Click "Send"</li>
          <li>Customer receives your email</li>
        </ol>

        <Callout type="tip" title="Email Threading">
          Replies automatically maintain the email thread, so customers see your response in context.
        </Callout>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Update Ticket Status
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Change ticket status based on progress:
        </Paragraph>

        <div className="space-y-3">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-1">
              Mark as Waiting
            </h3>
            <Paragraph variant="small" className="text-neutral-600">
              Use when you need customer to provide more information
            </Paragraph>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-1">
              Mark as Resolved
            </h3>
            <Paragraph variant="small" className="text-neutral-600">
              Use when the issue is completely solved
            </Paragraph>
          </div>
        </div>

        <CodeBlock
          code={`POST /api/emails/tickets/{ticketId}/status

{
  "status": "resolved"
}

Response:
{
  "id": "ticket_123",
  "status": "resolved",
  "resolvedAt": "2024-02-28T11:45:00Z"
}`}
          language="json"
          filename="update-status.json"
          className="mt-6"
        />
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Filter Tickets
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Use filters to find specific tickets:
        </Paragraph>
        <ul className="list-disc list-inside space-y-2 font-schibsted font-normal text-sm text-neutral-600 mb-6">
          <li><Highlight>All</Highlight> - View all tickets</li>
          <li><Highlight>Open</Highlight> - Only new unassigned tickets</li>
          <li><Highlight>In Progress</Highlight> - Tickets being actively worked</li>
          <li><Highlight>Waiting</Highlight> - Tickets awaiting customer response</li>
          <li><Highlight>Resolved</Highlight> - Closed tickets</li>
        </ul>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Ticket Metrics
        </Heading>
        <Paragraph variant="default" className="mb-4">
          Track your team's performance:
        </Paragraph>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-xs font-schibsted font-medium text-neutral-600 mb-1">
                Response Time
              </h3>
              <p className="text-2xl font-schibsted font-semibold text-neutral-900">
                12 min
              </p>
              <Paragraph variant="small" className="text-neutral-600">
                Average time to first response
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-xs font-schibsted font-medium text-neutral-600 mb-1">
                Resolution Time
              </h3>
              <p className="text-2xl font-schibsted font-semibold text-neutral-900">
                2.5 hrs
              </p>
              <Paragraph variant="small" className="text-neutral-600">
                Average time to resolve
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-xs font-schibsted font-medium text-neutral-600 mb-1">
                Tickets Resolved
              </h3>
              <p className="text-2xl font-schibsted font-semibold text-neutral-900">
                156
              </p>
              <Paragraph variant="small" className="text-neutral-600">
                This week
              </Paragraph>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Best Practices
        </Heading>
        <div className="space-y-4">
          <Callout type="tip" title="Claim Quickly">
            Claim tickets as soon as possible to show customers you're on it
          </Callout>

          <Callout type="tip" title="Update Status">
            Keep ticket status current so teammates know what's happening
          </Callout>

          <Callout type="tip" title="Use Templates">
            Create response templates for common issues to save time
          </Callout>
        </div>
      </div>

      <DocsNavigation
        prev={{ title: "Email Aliases", href: "/docs/aliases" }}
        next={{ title: "Chatbot Widget", href: "/docs/chatbot" }}
      />
    </article>
  );
}
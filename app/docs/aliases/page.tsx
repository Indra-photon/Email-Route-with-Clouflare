import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AliasesPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Email Aliases
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Create Email Aliases
        </Heading>
        <Paragraph variant="docs-par" className="">
          Map email addresses to Slack or Discord channels. Route support@, sales@, billing@ and more to different teams.
        </Paragraph>
      </div>

      <Callout type="info" title="Before You Start">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Domain must be added and configured</li>
          <li>At least one integration (Slack or Discord) must be set up</li>
        </ul>
      </Callout>

      <div className="my-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Create an Alias
        </Heading>

        <Paragraph variant="docs-par" className="mb-4">
        <ol className="list-decimal list-inside space-y-3 ">
          <li>Go to <CustomLink href="/dashboard/aliases" className="text-sky-800 hover:text-sky-900 underline">Dashboard → Aliases</CustomLink></li>
          <li>Click "Add Alias"</li>
          <li>Select your domain from the dropdown</li>
          <li>Enter the local part (e.g., <Highlight>support</Highlight>, <Highlight>sales</Highlight>, <Highlight>billing</Highlight>).
          Your email address will be <Highlight>localpart@yourdomain.com</Highlight>. (e.g. <Highlight>support@yourdomain.com</Highlight>, <Highlight>sales@yourdomain.com</Highlight>, <Highlight>billing@yourdomain.com</Highlight>)</li>
          <li>Select the target integration (Slack or Discord channel)</li>
          <li>Click the button <Highlight>Create Alias</Highlight></li>
        </ol>
        </Paragraph>
      </div>

      {/* <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Common Alias Examples
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                support@yourdomain.com
              </h3>
              <Paragraph variant="small" className="text-neutral-600">
                Route to #customer-support Slack channel
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                sales@yourdomain.com
              </h3>
              <Paragraph variant="small" className="text-neutral-600">
                Route to #sales-team Slack channel
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                billing@yourdomain.com
              </h3>
              <Paragraph variant="small" className="text-neutral-600">
                Route to #billing Discord channel
              </Paragraph>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
                hello@yourdomain.com
              </h3>
              <Paragraph variant="small" className="text-neutral-600">
                Route to #general Slack channel
              </Paragraph>
            </CardContent>
          </Card>
        </div>
      </div> */}

      {/* <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          How Routing Works
        </Heading>
        <Paragraph variant="docs-par" className="mb-4">
          When someone sends an email to your alias:
        </Paragraph>

        <Paragraph variant="docs-par" className="mb-4">
        <ol className="list-decimal list-inside space-y-2">
          <li>Email arrives at <Highlight>support@yourdomain.com</Highlight></li>
          <li>Email Router receives the email via webhook</li>
          <li>System looks up the alias in the database</li>
          <li>Email is formatted and sent to the linked Slack/Discord channel</li>
          <li>Team sees the email in 2-5 seconds</li>
        </ol>
        </Paragraph>
      </div>

      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Managing Aliases
        </Heading>
        <Paragraph variant="docs-par" className="mb-4">
          View all your aliases in the dashboard:
        </Paragraph>
        <Paragraph variant="docs-par" className="mb-4">
        <ul className="list-disc list-inside space-y-2 ">
          <li>See which email addresses are configured</li>
          <li>Check which integration each alias routes to</li>
          <li>View alias status (active)</li>
          <li>Edit or delete aliases (coming soon)</li>
        </ul>
        </Paragraph>
      </div> */}

      <DocsNavigation
        prev={{
          title: "Discord Integration",
          href: "/docs/integrations/discord",
        }}
        next={{
          title: "Ticket Management",
          href: "/docs/tickets",
        }}
      />
    </article>
  );
}
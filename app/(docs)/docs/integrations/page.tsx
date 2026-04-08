import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { CustomLink } from "@/components/CustomLink";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IconSlack, IconDiscord } from "@/constants/icons";
import { Icon } from "lucide-react";

import { DocsPage, DocsBody } from "fumadocs-ui/page";

export default function IntegrationsPage() {
  return (
    <DocsPage toc={[]}>
    <DocsBody className="prose prose-neutral max-w-none">
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Integrations
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Integrations Overview
        </Heading>
        <Paragraph variant="docs-par" className="">
          Connect Email Router to your team communication platforms. Route emails to Slack, Discord, or Microsoft Teams channels.
        </Paragraph>
      </div>

      {/* <Callout type="info" title="Available Integrations">
        Currently supported: Slack and Discord. Microsoft Teams coming soon.
      </Callout> */}

      <div className="my-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Choose Your Platform
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomLink href="/docs/integrations/slack">
            <Card>
              <CardContent className=" ">
                <Paragraph variant="muted" className="text-base font-schibsted font-bold text-sky-800 mb-2">
                  <div className="flex items-center gap-2">
                    <IconSlack className="size-5 inline-block mr-2 text-sky-800" />
                    Slack Integration
                  </div>
                </Paragraph>
                <Paragraph variant="docs-par" className="">
                  Route emails to Slack channels 
                </Paragraph>
              </CardContent>
            </Card>
          </CustomLink>

          <CustomLink href="/docs/integrations/discord">
            <Card>
              <CardContent className="">
                <Paragraph variant="muted" className="text-base font-schibsted font-bold text-sky-800 mb-2">
                  <div className="flex items-center gap-2">
                    <IconDiscord className="size-5 inline-block mr-2 text-sky-800" />
                    Discord Integration
                  </div>
                </Paragraph>
                <Paragraph variant="docs-par" className="">
                  Send email notifications to Discord channels
                </Paragraph>
              </CardContent>
            </Card>
          </CustomLink>
        </div>
      </div>

      <DocsNavigation
        prev={{
          title: "Add Your Domain",
          href: "/docs/domains",
        }}
        next={{
          title: "Slack Integration",
          href: "/docs/integrations/slack",
        }}
      />
    </DocsBody>
    </DocsPage>
  );
}
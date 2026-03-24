'use client';

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Zap, Users, BarChart3, Icon } from "lucide-react";
import { AnalyticsIcon, IconMail, IconZap, UsersIcon } from "@/constants/icons";
import { useState } from "react";

export default function DocsPage() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  return (
    <article className="prose prose-neutral max-w-none">
      {/* Hero Section */}
      <div className="mb-12">
        <Heading as="h1" className="text-neutral-900 mb-4">
          Welcome to Email Router
        </Heading>
        <Paragraph variant="docs-par" className="">
          Email Router helps teams manage customer support emails directly in Slack or Discord. 
          Route emails to channels, assign tickets, and respond faster—all without leaving your workspace.
        </Paragraph>
      </div>

      {/* Key Features */}
      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 tracking-tighter mb-6 text-2xl">
          Key Features
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
        {
          icon: IconMail,
          bgColor: "bg-sky-100",
          iconColor: "text-sky-800",
          title: "Email to Slack Routing",
          description: "Automatically route support@, sales@, and billing@ emails to dedicated Slack channels",
        },
        {
          icon: IconZap,
          bgColor: "bg-sky-100",
          iconColor: "text-sky-800",
          title: "Instant Notifications",
          description: "Team sees every email in 2-5 seconds, no more checking email clients",
        },
        {
          icon: UsersIcon,
          bgColor: "bg-sky-100",
          iconColor: "text-sky-800",
          title: "Ticket Management",
          description: "Claim tickets, track status, assign to team members, and collaborate",
        },
        {
          icon: AnalyticsIcon,
          bgColor: "bg-sky-100",
          iconColor: "text-amber-800",
          title: "Performance Analytics",
          description: "Track response times, ticket volume, and team performance metrics",
        },
          ].map((feature) => {
        const Icon = feature.icon;
        return (
          <Card
          onMouseEnter={() => setHoveredIcon(feature.title)}
                onMouseLeave={() => setHoveredIcon(null)}
          
          key={feature.title}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                className={`rounded-lg ${feature.bgColor} p-3`}>
                  <Icon isAnimating={hoveredIcon === feature.title} className={`size-6 ${feature.iconColor}`} />
                </div>
                <div>
                  <Paragraph variant="muted" className="text-base font-schibsted font-bold text-sky-800 mb-2">
                    {feature.title}
                  </Paragraph>
                  <Paragraph variant="docs-par" className="">
                    {feature.description}
                  </Paragraph>
                </div>
              </div>
            </CardContent>
          </Card>
        );
          })}
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Quick Start
        </Heading>
        <Paragraph variant="docs-par" className="mb-6">
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
          <Paragraph variant="docs-par" className="mb-4 underline">
            Follow these steps to get started:
          </Paragraph>
          <ol className="">
            <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
            <li>Create a Slack or Discord webhook</li>
            <li>Add the integration in Email Router</li>
            <li>Configure your domain</li>
            <li>Create email aliases</li>
            <li>Send a test email</li>
            </Paragraph>
          </ol>
        </div>

        <div className="mt-6">
          <CustomLink
            href="/docs/domains"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-800 px-6 py-3 text-sm font-schibsted font-semibold text-white hover:bg-sky-900 transition-colors"
          >
            How to add your domain →
          </CustomLink>
        </div>
      </div>

      {/* Popular Guides */}
      {/* <div className="mb-12">
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
      </div> */}

      {/* Navigation */}
      <DocsNavigation
        next={{
          title: "Add Your Domain",
          href: "/docs/domains",
        }}
      />
    </article>
  );
}
"use client";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function DomainsPage() {
   const { isSignedIn, user } = useUser();
  const [domains, setDomains] = useState<Array<{
  domain: string;
  status: string;
  receivingMxRecords?: Array<{
    type: string;
    name: string;
    value: string;
    priority: number;
  }>;
}>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<'cloudflare' | 'godaddy' | 'namecheap'>('cloudflare');

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/domains')
        .then(res => res.json())
        .then(data => {
          setDomains(data.domains || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  // Dummy data for non-logged-in users
  const dummyRecords = [
    { type: "MX", name: "@", value: "mx1.resend.dev", priority: 10 },
    { type: "MX", name: "@", value: "mx2.resend.dev", priority: 20 },
  ];

  // Get records to display
  const displayRecords = isSignedIn && domains.length > 0
    ? [
        { type: "MX", name: "@", value: "mx1.resend.dev", priority: 10 },
        { type: "MX", name: "@", value: "mx2.resend.dev", priority: 20 },
      ]
    : dummyRecords;

  const displayDomain = isSignedIn && domains.length > 0 
    ? domains[0].domain 
    : "yourdomain.com";


  return (
    <article className="prose prose-neutral max-w-none">
      {/* Header */}
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-bold uppercase tracking-wide">
          Domain Setup
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Add Your Domain
        </Heading>
        <Paragraph variant="docs-par" className="">
          Configure your domain to receive and route emails through Email Router. 
          Choose between direct MX setup or email forwarding based on your needs.
        </Paragraph>
      </div>

      {/* Add Domain */}
      <div className="my-12">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Step 1: Add Domain in Dashboard
        </Heading>
        <Paragraph variant="docs-par" className="mb-4">
          First, add your domain to Email Router:
        </Paragraph>


        <ol className="">
          <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
            <li>Go to <CustomLink href="/dashboard/domains" className="text-sky-800 hover:text-sky-900 font-semibold underline">Dashboard → Domains</CustomLink></li>
            <li>Click "Add Domain"</li>
            <li>Enter your domain name (e.g., <Highlight>acme.com</Highlight>)</li>
            <li>Click "Add Domain". You can see the domain added to your list with status as <Highlight>"Pending Verification"</Highlight></li>
            <li>Tap the domain card and modal opens with the button <Highlight>Add to Resend</Highlight>. Click the 
            button to add your domain to our database to get the MX records.</li>
            <li>Once added, you will see the MX records displayed in the modal.</li>
          </Paragraph>
        </ol>
      </div>

      {/* DNS Configuration Options */}
      <div className="mb-4">
        <Heading as="h2" variant="muted" className="text-neutral-900 ">
          Step 2: Add MX Records to DNS
        </Heading>
      </div>

      {/* Option 1: MX Records */}
      <div className="">
        
        <Paragraph variant="docs-par" className="mb-6">
          Copy the records provided in the dashboard and add them to your DNS provider.
        </Paragraph>

        {/* <div className="overflow-x-auto mb-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-600 font-schibsted">Loading...</p>
            </div>
          ) : (
            <>
              {isSignedIn && domains.length > 0 && (
                <Callout type="info" title="Your Domain" className="mb-4">
                  Showing MX records for <Highlight>{displayDomain}</Highlight>
                </Callout>
              )}
              <table className="min-w-full border border-neutral-200 rounded-lg">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-schibsted font-semibold text-neutral-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-schibsted font-semibold text-neutral-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-schibsted font-semibold text-neutral-900">Value</th>
                    <th className="px-4 py-3 text-left text-sm font-schibsted font-semibold text-neutral-900">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {displayRecords.map((record, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                      <td className="px-4 py-3 text-sm font-schibsted font-normal text-neutral-900">{record.type}</td>
                      <td className="px-4 py-3 text-sm font-mono text-neutral-600">{record.name}</td>
                      <td className="px-4 py-3 text-sm font-mono text-neutral-600">{record.value}</td>
                      <td className="px-4 py-3 text-sm font-schibsted font-normal text-neutral-900">{record.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div> */}

        {/* <Callout type="warning" title="Important">
          Adding MX records will route ALL email for your domain through Email Router. 
          Only do this if you're not using the domain for other email services.
        </Callout> */}

        <div className="mt-6">
          <Heading as="h2" variant="muted" className="text-neutral-900 mb-6 underline">
            DNS Provider Examples
          </Heading>

          {/* Provider Badges */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setSelectedProvider('cloudflare')}
              className={`px-4 py-2 rounded-lg text-sm font-schibsted font-medium transition-colors ${
                selectedProvider === 'cloudflare'
                  ? 'bg-sky-100 text-sky-800 font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              Cloudflare
            </button>
            <button
              onClick={() => setSelectedProvider('godaddy')}
              className={`px-4 py-2 rounded-lg text-sm font-schibsted font-medium transition-colors ${
                selectedProvider === 'godaddy'
                  ? 'bg-sky-100 text-sky-800 font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              GoDaddy
            </button>
            <button
              onClick={() => setSelectedProvider('namecheap')}
              className={`px-4 py-2 rounded-lg text-sm font-schibsted font-medium transition-colors ${
                selectedProvider === 'namecheap'
                  ? 'bg-sky-100 text-sky-800 font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              Namecheap
            </button>
          </div>

          {/* Provider Content with Animation */}
          <Card className="border border-neutral-400 border-dashed rounded-lg shadow-none bg-neutral-100">
            <CardContent className="px-6 py-3 min-h-[380px]">
              <AnimatePresence mode="wait">
                {selectedProvider === 'cloudflare' && (
                  <motion.div
                    key="cloudflare"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: [.25, .46, .45, .94] }}
                  >
                    <ol>
                      <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
                        <li>Log in to Cloudflare dashboard</li>
                        <li>Select your domain</li>
                        <li>Go to DNS → Records</li>
                        <li>Click "Add record"</li>
                        <li>Copy the records from your dashboard and paste them into the appropriate fields.</li>
                      </Paragraph>
                    </ol>
                  </motion.div>
                )}

                {selectedProvider === 'godaddy' && (
                  <motion.div
                    key="godaddy"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: [.25, .46, .45, .94] }}
                  >
                    <ol>
                      <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
                        <li>Log in to GoDaddy</li>
                        <li>Go to My Products → Domains</li>
                        <li>Click DNS next to your domain</li>
                        <li>Scroll to MX Records section</li>
                        <li>Click "Add"</li>
                        <li>Copy the records from your dashboard and paste them into the appropriate fields.</li>
                        <li>Save changes</li>
                      </Paragraph>
                    </ol>
                  </motion.div>
                )}

                {selectedProvider === 'namecheap' && (
                  <motion.div
                    key="namecheap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: [.25, .46, .45, .94] }}
                  >
                    <ol>
                      <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
                        <li>Log in to Namecheap</li>
                        <li>Go to Domain List → Manage</li>
                        <li>Select "Advanced DNS"</li>
                        <li>Find "Mail Settings"</li>
                        <li>Copy the records from your dashboard and paste them into the appropriate fields.</li>
                        <li>Save changes</li>
                      </Paragraph>
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>


      {/* Verification */}
      <div className="mb-12 mt-10">
        <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
          Step 3: Verify Configuration
        </Heading>

        <Paragraph variant="docs-par" className="mb-4">
          After adding MX records, verify your domain in the Email Router dashboard by clicking 
          <Highlight>{" "}Check Verification</Highlight> button. 
          Make sure the status of every record changes to <Highlight>Verified</Highlight>.
          Once all the records are verified, you can start creating email aliases and routing emails to Slack or Discord.
        </Paragraph>

        <Paragraph variant="docs-par" className="mb-4 font-bold">
          DNS changes can take 10-30 minutes to propagate. Use <CustomLink href="https://mxtoolbox.com" className="text-sky-800 hover:text-sky-900 underline">MXToolbox.com</CustomLink> to check your records.
        </Paragraph>

        {/* <Callout type="tip" title="DNS Propagation" className="mt-4">
          DNS changes can take 10-30 minutes to propagate. Use <CustomLink href="https://mxtoolbox.com" className="text-sky-800 hover:text-sky-900 underline">MXToolbox.com</CustomLink> to check your records.
        </Callout> */}
      </div>

      {/* Troubleshooting */}
      {/* <div className="mb-12">
        <Heading as="h2" className="text-neutral-900 mb-4 text-2xl">
          Troubleshooting
        </Heading>

        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
              Emails not arriving?
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm font-schibsted font-normal text-neutral-600">
              <li>Wait 30 minutes for DNS propagation</li>
              <li>Check MX records with dig or nslookup</li>
              <li>Verify domain status in dashboard</li>
              <li>Check spam folder in Slack</li>
            </ul>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-schibsted font-semibold text-neutral-900 mb-2">
              MX records not updating?
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm font-schibsted font-normal text-neutral-600">
              <li>Remove old MX records first</li>
              <li>Clear DNS cache on your computer</li>
              <li>Contact your DNS provider support</li>
            </ul>
          </div>
        </div>
      </div> */}

      {/* Navigation */}
      <DocsNavigation
        prev={{
          title: "Introduction",
          href: "/docs",
        }}
        next={{
          title: "Slack Integration",
          href: "/docs/integrations",
        }}
      />
    </article>
  );
}
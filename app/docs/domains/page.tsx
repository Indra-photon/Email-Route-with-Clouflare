// "use client";

// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { CustomLink } from "@/components/CustomLink";
// import { CodeBlock } from "@/components/docs/CodeBlock";
// import { Callout } from "@/components/docs/Callout";
// import { DocsNavigation } from "@/components/docs/DocsNavigation";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import { AnimatePresence, motion } from "motion/react";

// export default function DomainsPage() {
//    const { isSignedIn, user } = useUser();
//   const [domains, setDomains] = useState<Array<{
//   domain: string;
//   status: string;
//   receivingMxRecords?: Array<{
//     type: string;
//     name: string;
//     value: string;
//     priority: number;
//   }>;
// }>>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProvider, setSelectedProvider] = useState<'cloudflare' | 'godaddy' | 'namecheap'>('cloudflare');

//   useEffect(() => {
//     if (isSignedIn) {
//       fetch('/api/domains')
//         .then(res => res.json())
//         .then(data => {
//           setDomains(data.domains || []);
//           setLoading(false);
//         })
//         .catch(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [isSignedIn]);

//   // Dummy data for non-logged-in users
//   const dummyRecords = [
//     { type: "MX", name: "@", value: "mx1.resend.dev", priority: 10 },
//     { type: "MX", name: "@", value: "mx2.resend.dev", priority: 20 },
//   ];

//   // Get records to display
//   const displayRecords = isSignedIn && domains.length > 0
//     ? [
//         { type: "MX", name: "@", value: "mx1.resend.dev", priority: 10 },
//         { type: "MX", name: "@", value: "mx2.resend.dev", priority: 20 },
//       ]
//     : dummyRecords;

//   const displayDomain = isSignedIn && domains.length > 0 
//     ? domains[0].domain 
//     : "yourdomain.com";


//   return (
//     <article className="prose prose-neutral max-w-none">
//       {/* Header */}
//       <div className="mb-8">
//         <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-bold uppercase tracking-wide">
//           Domain Setup
//         </Badge>
//         <Heading as="h1" className="text-neutral-900 mb-4">
//           Add Your Domain
//         </Heading>
//         <Paragraph variant="docs-par" className="">
//           Configure your domain to receive and route emails through Email Router. 
//           Choose between direct MX setup or email forwarding based on your needs.
//         </Paragraph>
//       </div>

//       {/* Add Domain */}
//       <div className="my-12">
//         <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
//           Step 1: Add Domain in Dashboard
//         </Heading>
//         <Paragraph variant="docs-par" className="mb-4">
//           First, add your domain to Email Router:
//         </Paragraph>


//         <ol className="">
//           <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
//             <li>Go to <CustomLink href="/dashboard/domains" className="text-sky-800 hover:text-sky-900 font-semibold underline">Dashboard → Domains</CustomLink></li>
//             <li>Click "Add Domain"</li>
//             <li>Enter your domain name (e.g., <Highlight>acme.com</Highlight>)</li>
//             <li>Click "Add Domain". You can see the domain added to your list with status as <Highlight>"Pending Verification"</Highlight></li>
//             <li>Tap the domain card and modal opens with the button <Highlight>Add to Resend</Highlight>. Click the 
//             button to add your domain to our database to get the MX records.</li>
//             <li>Once added, you will see the MX records displayed in the modal.</li>
//           </Paragraph>
//         </ol>
//       </div>

//       {/* DNS Configuration Options */}
//       <div className="mb-4">
//         <Heading as="h2" variant="muted" className="text-neutral-900 ">
//           Step 2: Add MX Records to DNS
//         </Heading>
//       </div>

//       {/* Option 1: MX Records */}
//       <div className="">
        
//         <Paragraph variant="docs-par" className="mb-6">
//           Copy the records provided in the dashboard and add them to your DNS provider.
//         </Paragraph>

//         <div className="mt-6">
//           <Heading as="h2" variant="muted" className="text-neutral-900 mb-6 underline">
//             DNS Provider Examples
//           </Heading>

//           {/* Provider Badges */}
//           <div className="flex gap-3 mb-6">
//             <button
//               onClick={() => setSelectedProvider('cloudflare')}
//               className={`px-4 py-2 rounded-lg text-sm font-schibsted font-medium transition-colors ${
//                 selectedProvider === 'cloudflare'
//                   ? 'bg-sky-100 text-sky-800 font-semibold'
//                   : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
//               }`}
//             >
//               Cloudflare
//             </button>
//             <button
//               onClick={() => setSelectedProvider('godaddy')}
//               className={`px-4 py-2 rounded-lg text-sm font-schibsted font-medium transition-colors ${
//                 selectedProvider === 'godaddy'
//                   ? 'bg-sky-100 text-sky-800 font-semibold'
//                   : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
//               }`}
//             >
//               GoDaddy
//             </button>
//             <button
//               onClick={() => setSelectedProvider('namecheap')}
//               className={`px-4 py-2 rounded-lg text-sm font-schibsted font-medium transition-colors ${
//                 selectedProvider === 'namecheap'
//                   ? 'bg-sky-100 text-sky-800 font-semibold'
//                   : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
//               }`}
//             >
//               Namecheap
//             </button>
//           </div>

//           {/* Provider Content with Animation */}
//           <Card className="border border-neutral-400 border-dashed rounded-lg shadow-none bg-neutral-100">
//             <CardContent className="px-6 py-3 min-h-[380px]">
//               <AnimatePresence mode="wait">
//                 {selectedProvider === 'cloudflare' && (
//                   <motion.div
//                     key="cloudflare"
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2, ease: [.25, .46, .45, .94] }}
//                   >
//                     <ol>
//                       <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
//                         <li>Log in to Cloudflare dashboard</li>
//                         <li>Select your domain</li>
//                         <li>Go to DNS → Records</li>
//                         <li>Click "Add record"</li>
//                         <li>Copy the records from your dashboard and paste them into the appropriate fields.</li>
//                       </Paragraph>
//                     </ol>
//                   </motion.div>
//                 )}

//                 {selectedProvider === 'godaddy' && (
//                   <motion.div
//                     key="godaddy"
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2, ease: [.25, .46, .45, .94] }}
//                   >
//                     <ol>
//                       <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
//                         <li>Log in to GoDaddy</li>
//                         <li>Go to My Products → Domains</li>
//                         <li>Click DNS next to your domain</li>
//                         <li>Scroll to MX Records section</li>
//                         <li>Click "Add"</li>
//                         <li>Copy the records from your dashboard and paste them into the appropriate fields.</li>
//                         <li>Save changes</li>
//                       </Paragraph>
//                     </ol>
//                   </motion.div>
//                 )}

//                 {selectedProvider === 'namecheap' && (
//                   <motion.div
//                     key="namecheap"
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2, ease: [.25, .46, .45, .94] }}
//                   >
//                     <ol>
//                       <Paragraph variant="docs-par" className="list-decimal list-inside space-y-2">
//                         <li>Log in to Namecheap</li>
//                         <li>Go to Domain List → Manage</li>
//                         <li>Select "Advanced DNS"</li>
//                         <li>Find "Mail Settings"</li>
//                         <li>Copy the records from your dashboard and paste them into the appropriate fields.</li>
//                         <li>Save changes</li>
//                       </Paragraph>
//                     </ol>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </CardContent>
//           </Card>
//         </div>
//       </div>


//       {/* Verification */}
//       <div className="mb-12 mt-10">
//         <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
//           Step 3: Verify Configuration
//         </Heading>

//         <Paragraph variant="docs-par" className="mb-4">
//           After adding MX records, verify your domain in the Email Router dashboard by clicking 
//           <Highlight>{" "}Check Verification</Highlight> button. 
//           Make sure the status of every record changes to <Highlight>Verified</Highlight>.
//           Once all the records are verified, you can start creating email aliases and routing emails to Slack or Discord.
//         </Paragraph>

//         <Paragraph variant="docs-par" className="mb-4 font-bold">
//           DNS changes can take 10-30 minutes to propagate. Use <CustomLink href="https://mxtoolbox.com" className="text-sky-800 hover:text-sky-900 underline">MXToolbox.com</CustomLink> to check your records.
//         </Paragraph>

//         {/* <Callout type="tip" title="DNS Propagation" className="mt-4">
//           DNS changes can take 10-30 minutes to propagate. Use <CustomLink href="https://mxtoolbox.com" className="text-sky-800 hover:text-sky-900 underline">MXToolbox.com</CustomLink> to check your records.
//         </Callout> */}
//       </div>

//       {/* Navigation */}
//       <DocsNavigation
//         prev={{
//           title: "Introduction",
//           href: "/docs",
//         }}
//         next={{
//           title: "Slack Integration",
//           href: "/docs/integrations",
//         }}
//       />
//     </article>
//   );
// }



"use client";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function DomainsPage() {
  const { isSignedIn } = useUser();
  const [selectedProvider, setSelectedProvider] = useState<'cloudflare' | 'godaddy' | 'namecheap'>('cloudflare');

  return (
    <article className="prose prose-neutral max-w-none">

      {/* ── Header ── */}
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Domain Setup
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          How to Add and Configure Your Domain
        </Heading>
        <Paragraph variant="default" className="text-neutral-600 font-schibsted leading-relaxed">
          Configure your domain to receive and route emails through Email
          Router. Follow the steps below to add your domain, set up DNS
          records, and verify your configuration.
        </Paragraph>
      </div>

      {/* ── Prerequisites ── */}
      <div className="mb-8">
        <Callout type="info" title="Before You Start">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              You need access to your domain's DNS settings through your DNS
              provider (Cloudflare, GoDaddy, Namecheap, etc.).
            </li>
            <li>
              At least one integration (Slack or Discord) must be set up.{" "}
              <CustomLink
                href="/docs/integrations"
                className="text-sky-800 hover:text-sky-900 underline"
              >
                How to set up an integration
              </CustomLink>
            </li>
          </ul>
        </Callout>
      </div>

      {/* ── Steps ── */}
      <div className="relative mb-12">

        {/* Vertical connecting line */}
        <div className="absolute left-[19px] top-10 bottom-10 w-px bg-gradient-to-b from-sky-800 to-cyan-700 z-0" />

        {/* ── Step 1 ── */}
        <div className="relative flex gap-4 pb-3">
          <div className="relative z-10 flex-shrink-0 pt-1">
            <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-semibold font-schibsted">
              1
            </span>
          </div>
          <Card className="flex-1">
            <CardContent className="px-0 py-2">
              
              <Heading as="h2" variant="small" className="text-neutral-900 mb-4">
                Add Domain in Dashboard
              </Heading>
              <Paragraph variant="docs-par" className="mb-0 pl-8">
                <ol className="list-decimal list-inside space-y-2 font-schibsted">
                  <li>
                    Go to{" "}
                    <CustomLink
                      href="/dashboard/domains"
                      className="text-sky-800 hover:text-sky-900"
                    >
                      Dashboard → Domains
                    </CustomLink>
                    .
                  </li>
                  <li>
                    Click <Highlight>Add Domain</Highlight>.
                  </li>
                  <li>
                    Enter your domain name (e.g.,{" "}
                    <Highlight>acme.com</Highlight>).
                  </li>
                  <li>
                    Click <Highlight>Add Domain</Highlight>. You will see the
                    domain added to your list with status{" "}
                    <Highlight>Pending Verification</Highlight>.
                  </li>
                  <li>
                    Tap the domain card — a modal opens with the button{" "}
                    <Highlight>Add to Resend</Highlight>. Click it to register
                    your domain and retrieve the MX records.
                  </li>
                  <li>
                    Once added, the MX records will be displayed in the modal.
                    Copy them for the next step.
                  </li>
                </ol>
              </Paragraph>
            </CardContent>
          </Card>
        </div>

        {/* ── Step 2 ── */}
        <div className="relative flex gap-4 pb-3">
          <div className="relative z-10 flex-shrink-0 pt-1">
            <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-semibold font-schibsted">
              2
            </span>
          </div>
          <Card className="flex-1">
            <CardContent className="px-0 py-2">
              <Heading as="h2" variant="small" className="text-neutral-900 mb-4">
                Add MX Records to Your DNS Provider
              </Heading>
              <Paragraph variant="docs-par" className="mb-4 pl-8">
                Copy the MX records from the dashboard modal and add them to
                your DNS provider. Select your provider below for specific
                instructions.
              </Paragraph>

              <div className="pl-8">
                {/* Provider Tabs */}
                <div className="flex gap-3 mb-4">
                  {(
                    [
                      { key: "cloudflare", label: "Cloudflare" },
                      { key: "godaddy", label: "GoDaddy" },
                      { key: "namecheap", label: "Namecheap" },
                    ] as const
                  ).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedProvider(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-schibsted font-medium transition-colors ${
                        selectedProvider === key
                          ? "bg-sky-100 text-sky-800 font-semibold"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Provider Instructions */}
                <Card className="border border-neutral-400 border-dashed rounded-lg shadow-none bg-neutral-100">
                  <CardContent className="px-6 py-3 min-h-[200px]">
                    <AnimatePresence mode="wait">
                      {selectedProvider === "cloudflare" && (
                        <motion.div
                          key="cloudflare"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <Paragraph variant="docs-par" className="mb-0">
                            <ol className="list-decimal list-inside space-y-2 font-schibsted">
                              <li>Log in to your Cloudflare dashboard.</li>
                              <li>Select your domain.</li>
                              <li>Go to <Highlight>DNS → Records</Highlight>.</li>
                              <li>Click <Highlight>Add record</Highlight>.</li>
                              <li>Paste the MX records copied from your dashboard into the appropriate fields and save.</li>
                            </ol>
                          </Paragraph>
                        </motion.div>
                      )}

                      {selectedProvider === "godaddy" && (
                        <motion.div
                          key="godaddy"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <Paragraph variant="docs-par" className="mb-0">
                            <ol className="list-decimal list-inside space-y-2 font-schibsted">
                              <li>Log in to GoDaddy.</li>
                              <li>Go to <Highlight>My Products → Domains</Highlight>.</li>
                              <li>Click <Highlight>DNS</Highlight> next to your domain.</li>
                              <li>Scroll to the MX Records section and click <Highlight>Add</Highlight>.</li>
                              <li>Paste the MX records copied from your dashboard and save changes.</li>
                            </ol>
                          </Paragraph>
                        </motion.div>
                      )}

                      {selectedProvider === "namecheap" && (
                        <motion.div
                          key="namecheap"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <Paragraph variant="docs-par" className="mb-0">
                            <ol className="list-decimal list-inside space-y-2 font-schibsted">
                              <li>Log in to Namecheap.</li>
                              <li>Go to <Highlight>Domain List → Manage</Highlight>.</li>
                              <li>Select <Highlight>Advanced DNS</Highlight>.</li>
                              <li>Find <Highlight>Mail Settings</Highlight>.</li>
                              <li>Paste the MX records copied from your dashboard and save changes.</li>
                            </ol>
                          </Paragraph>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Step 3 ── */}
        <div className="relative flex gap-4">
          <div className="relative z-10 flex-shrink-0 pt-1">
            <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-semibold font-schibsted">
              3
            </span>
          </div>
          <Card className="flex-1">
            <CardContent className="px-0 py-2">
              <Heading as="h2" variant="small" className="text-neutral-900 mb-4">
                Verify Your Configuration
              </Heading>
              <Paragraph variant="docs-par" className="mb-4 pl-8">
                After adding MX records, verify your domain in the Email Router
                dashboard by clicking the{" "}
                <Highlight>Check Verification</Highlight> button. Make sure the
                status of every record changes to{" "}
                <Highlight>Verified</Highlight>.
              </Paragraph>

              <div className="pl-8 mb-4">
                <div className="inline-flex items-center mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-1">
                  <p className="font-schibsted font-semibold text-white text-sm">
                    DNS Propagation
                  </p>
                </div>
                <Paragraph variant="docs-par" className="mb-0">
                  <ul className="list-disc list-inside space-y-2 font-schibsted">
                    <li>
                      DNS changes can take{" "}
                      <strong>10–30 minutes</strong> to propagate.
                    </li>
                    <li>
                      Use{" "}
                      <CustomLink
                        href="https://mxtoolbox.com"
                        className="text-sky-800 hover:text-sky-900 underline"
                      >
                        MXToolbox.com
                      </CustomLink>{" "}
                      to check your MX records are live.
                    </li>
                    <li>
                      Once all records show <Highlight>Verified</Highlight>,
                      you can start creating email aliases and routing emails to
                      Slack or Discord.
                    </li>
                  </ul>
                </Paragraph>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* ── Navigation ── */}
      <DocsNavigation
        prev={{ title: "Introduction", href: "/docs" }}
        next={{ title: "Integrations", href: "/docs/integrations" }}
      />

    </article>
  );
}
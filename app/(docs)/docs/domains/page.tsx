// "use client";

// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { CustomLink } from "@/components/CustomLink";
// import { Callout } from "@/components/docs/Callout";
// import { DocsNavigation } from "@/components/docs/DocsNavigation";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { useState } from "react";
// import { AnimatePresence, motion } from "motion/react";
// import { DocsBody } from "fumadocs-ui/page";

// export default function DomainsPage() {
//   const [selectedProvider, setSelectedProvider] = useState<'cloudflare' | 'godaddy' | 'namecheap'>('cloudflare');

//   return (
//     <DocsPage toc={[]}>
//     <DocsBody className="">

//       {/* ── Header ── */}
//       <div className="mb-8">
//         {/* <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
//           Domain Setup
//         </Badge> */}
//         <Heading as="h1" className="!text-white !text-2xl !sm:text-2xl !md:text-3xl !lg:text-4xl !xl:text-5xl
//         inset-shadow-sm inset-shadow-black/70 text-shadow-3xl bg-gradient-to-b from-sky-800 to-cyan-700 mb-4
//         rounded-lg uppercase tracking-tight px-4 py-2">
//           How to Add and Configure Your Domain
//         </Heading>
//         <Paragraph variant="default" className="text-neutral-600 font-schibsted leading-relaxed">
//           Configure your domain to receive and route emails through Email
//           Router. Follow the steps below to add your domain, set up DNS
//           records, and verify your configuration.
//         </Paragraph>
//       </div>

//       {/* ── Prerequisites ── */}
//       <div className="mb-8">
//         <Callout type="info" title="Before You Start">
//           <ul className="list-disc list-inside space-y-1 text-sm">
//             <li>
//               You need access to your domain's DNS settings through your DNS
//               provider (Cloudflare, GoDaddy, Namecheap, etc.).
//             </li>
//             <li>
//               At least one integration (Slack or Discord) must be set up.{" "}
//               <CustomLink
//                 href="/docs/integrations"
//                 className="text-sky-800 hover:text-sky-900 underline"
//               >
//                 How to set up an integration
//               </CustomLink>
//             </li>
//           </ul>
//         </Callout>
//       </div>

//       {/* ── Steps ── */}
//       <div className="relative mb-12">

//         {/* Vertical connecting line */}
//         <div className="absolute left-[19px] top-10 bottom-10 w-px bg-gradient-to-b from-sky-800 to-cyan-700 z-0" />

//         {/* ── Step 1 ── */}
//         <div className="relative flex gap-4 pb-3">
//           <div className="relative z-10 flex-shrink-0">
//             <span className="inline-flex inset-shadow-sm inset-shadow-black/70 text-shadow-3xl items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-schibsted font-bold">
//               1
//             </span>
//           </div>
//           <Card className="">
//             <CardContent className="px-0 py-0">
//               <div className="font-schibsted text-lg sm:text-lg md:text-lg lg:text-xl xl:text-2xl font-regular leading-tight text-neutral-100 items-center w-full mb-2 inset-shadow-sm inset-shadow-black/70 text-shadow-3xl bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
//                   Add Domain in Dashboard
//                 </div>
//               <Paragraph variant="docs-par" className="mb-0">
//                 <ol className="list-decimal list-inside space-y-2 font-schibsted">
//                   <li>
//                     Go to{" "}
//                     <CustomLink href="/dashboard/domains" className="text-sky-800 hover:text-sky-900">
//                       Dashboard → Domains
//                     </CustomLink>
//                     .
//                   </li>
//                   <li>Click <Highlight>Add Domain</Highlight>.</li>
//                   <li>Enter your domain name (e.g., <Highlight>acme.com</Highlight>).</li>
//                   <li>
//                     Click <Highlight>Add Domain</Highlight>. You will see the domain added
//                     to your list with status <Highlight>Pending Verification</Highlight>.
//                   </li>
//                   <li>
//                     Tap the domain card — a modal opens with the button{" "}
//                     <Highlight>Add to Resend</Highlight>. Click it to register your domain
//                     and retrieve the MX records.
//                   </li>
//                   <li>
//                     Once added, the MX records will be displayed in the modal. Copy them
//                     for the next step.
//                   </li>
//                 </ol>
//               </Paragraph>
//             </CardContent>
//           </Card>
//         </div>

//         {/* ── Step 2 ── */}
//         <div className="relative flex gap-4 pb-3">
//           <div className="relative z-10 flex-shrink-0 pt-1">
//             <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-schibsted font-bold">
//               2
//             </span>
//           </div>
//           <Card className="flex-1 overflow-hidden">
//             <CardContent className="px-0 py-0">
//               <div className="font-schibsted text-lg sm:text-lg md:text-lg lg:text-xl xl:text-2xl font-regular leading-tight text-neutral-100 items-center w-full mb-2 inset-shadow-sm inset-shadow-black/70 text-shadow-3xl bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
//                 Add MX Records to Your DNS Provider
//               </div>
//               <div className="px-6 py-4">
//                 <Paragraph variant="docs-par" className="mb-4 pl-2">
//                   Copy the MX records from the dashboard modal and add them to your DNS
//                   provider. Select your provider below for specific instructions.
//                 </Paragraph>

//                 <div className="pl-2">
//                 {/* Provider Tabs */}
//                 <div className="flex gap-3 mb-4">
//                   {(
//                     [
//                       { key: "cloudflare", label: "Cloudflare" },
//                       { key: "godaddy", label: "GoDaddy" },
//                       { key: "namecheap", label: "Namecheap" },
//                     ] as const
//                   ).map(({ key, label }) => (
//                     <button
//                       key={key}
//                       onClick={() => setSelectedProvider(key)}
//                       className={`px-4 py-2 rounded-lg text-sm font-schibsted font-medium transition-colors ${
//                         selectedProvider === key
//                           ? "bg-sky-100 text-sky-800 font-semibold"
//                           : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
//                       }`}
//                     >
//                       {label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Provider Instructions */}
//                 <Card className="border border-neutral-400 border-dashed rounded-lg shadow-none bg-neutral-100">
//                   <CardContent className="px-6 py-3 min-h-[200px]">
//                     <AnimatePresence mode="wait">
//                       {selectedProvider === "cloudflare" && (
//                         <motion.div
//                           key="cloudflare"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -10 }}
//                           transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
//                         >
//                           <Paragraph variant="docs-par" className="mb-0">
//                             <ol className="list-decimal list-inside space-y-2 font-schibsted">
//                               <li>Log in to your Cloudflare dashboard.</li>
//                               <li>Select your domain.</li>
//                               <li>Go to <Highlight>DNS → Records</Highlight>.</li>
//                               <li>Click <Highlight>Add record</Highlight>.</li>
//                               <li>Paste the MX records copied from your dashboard into the appropriate fields and save.</li>
//                             </ol>
//                           </Paragraph>
//                         </motion.div>
//                       )}
//                       {selectedProvider === "godaddy" && (
//                         <motion.div
//                           key="godaddy"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -10 }}
//                           transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
//                         >
//                           <Paragraph variant="docs-par" className="mb-0">
//                             <ol className="list-decimal list-inside space-y-2 font-schibsted">
//                               <li>Log in to GoDaddy.</li>
//                               <li>Go to <Highlight>My Products → Domains</Highlight>.</li>
//                               <li>Click <Highlight>DNS</Highlight> next to your domain.</li>
//                               <li>Scroll to the MX Records section and click <Highlight>Add</Highlight>.</li>
//                               <li>Paste the MX records copied from your dashboard and save changes.</li>
//                             </ol>
//                           </Paragraph>
//                         </motion.div>
//                       )}
//                       {selectedProvider === "namecheap" && (
//                         <motion.div
//                           key="namecheap"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -10 }}
//                           transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
//                         >
//                           <Paragraph variant="docs-par" className="mb-0">
//                             <ol className="list-decimal list-inside space-y-2 font-schibsted">
//                               <li>Log in to Namecheap.</li>
//                               <li>Go to <Highlight>Domain List → Manage</Highlight>.</li>
//                               <li>Select <Highlight>Advanced DNS</Highlight>.</li>
//                               <li>Find <Highlight>Mail Settings</Highlight>.</li>
//                               <li>Paste the MX records copied from your dashboard and save changes.</li>
//                             </ol>
//                           </Paragraph>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </CardContent>
//                 </Card>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* ── Step 3 ── */}
//         <div className="relative flex gap-4">
//           <div className="relative z-10 flex-shrink-0 pt-1">
//             <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-schibsted font-bold">
//               3
//             </span>
//           </div>
//           <Card className="flex-1">
//             <CardContent className="px-0 py-0">
//               <div className="font-schibsted text-lg sm:text-lg md:text-lg lg:text-xl xl:text-2xl font-regular leading-tight text-neutral-100 items-center w-full mb-2 inset-shadow-sm inset-shadow-black/70 text-shadow-3xl bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
//                 Verify Your Configuration
//               </div>
//               <div className="px-6 py-4">
//                 <Paragraph variant="docs-par" className="mb-4 pl-2">
//                   After adding MX records, verify your domain in the Email Router dashboard
//                   by clicking the <Highlight>Check Verification</Highlight> button. Make sure
//                   the status of every record changes to <Highlight>Verified</Highlight>.
//                 </Paragraph>

//                 <div className="mb-4 pl-2">
//                   <div className="inline-flex items-center mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-1">
//                     <p className="font-schibsted font-semibold text-white text-sm">
//                       DNS Propagation
//                     </p>
//                   </div>
//                   <Paragraph variant="docs-par" className="mb-0 pl-4">
//                     <ul className="list-disc list-inside space-y-2 font-schibsted">
//                       <li>DNS changes can take <strong>10–30 minutes</strong> to propagate.</li>
//                       <li>
//                         Use{" "}
//                         <CustomLink
//                           href="https://mxtoolbox.com"
//                           className="text-sky-800 hover:text-sky-900 underline"
//                         >
//                           MXToolbox.com
//                         </CustomLink>{" "}
//                         to check your MX records are live.
//                       </li>
//                       <li>
//                         Once all records show <Highlight>Verified</Highlight>, you can start
//                         creating email aliases and routing emails to Slack or Discord.
//                       </li>
//                     </ul>
//                   </Paragraph>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//       </div>

//       {/* ── Navigation ── */}
//       <DocsNavigation
//         prev={{ title: "Introduction", href: "/docs" }}
//         next={{ title: "Integrations", href: "/docs/integrations" }}
//       />

//     </DocsBody>
//     </DocsPage>
//   );
// }


// "use client";

// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { CustomLink } from "@/components/CustomLink";
// import { Callout } from "@/components/docs/Callout";
// import { DocsNavigation } from "@/components/docs/DocsNavigation";
// import { DocsBody } from "fumadocs-ui/page";
// import { useState } from "react";
// import { AnimatePresence, motion } from "motion/react";

// /* ═══════════════════════════════════════════════════════════════
//    1. CONTENT — all raw data lives here, no JSX yet
//    ═══════════════════════════════════════════════════════════════ */

// // ── Section 1: Add Domain in Dashboard ──────────────────────────
// const DASHBOARD_STEPS: { title: string; body: React.ReactNode }[] = [
//   {
//     title: "Add your domain",
//     body: (
//     <Paragraph variant="docs-par">
//       After you sign in and navigate to the dashboard, select{" "}
//       <CustomLink href="/dashboard/domains" className="text-sky-800 hover:text-sky-900 underline">
//         Domains
//       </CustomLink>{" "}
//       from the sidebar. Select the <Highlight>Add Domain</Highlight> tab, enter your
//       domain name (e.g., <Highlight>acme.com</Highlight>), and click{" "}
//       <Highlight>Add Domain</Highlight>.
//     </Paragraph>
//   )
//   },
//   {
//     title: "Retrieve MX records",
//     body: (
//     <Paragraph variant="docs-par">
//       After you click <Highlight>Add domain</Highlight>, if successfull you will be redirected to <Highlight>Domains</Highlight> tab. There you will see 
//       all your listed domain. Click any domain card and click <Highlight>Add to Resend</Highlight>. This will register your domain and generate the MX records you need to add to your DNS provider.
//       Make sure to copy the MX records from the modal — you'll need them next.
//     </Paragraph>
//   ),
//   },
// ];

// // ── Section 2: DNS provider sub-steps ───────────────────────────
// type Provider = "cloudflare" | "godaddy" | "namecheap";

// const PROVIDERS: { key: Provider; label: string }[] = [
//   { key: "cloudflare", label: "Cloudflare" },
//   { key: "godaddy",    label: "GoDaddy"    },
//   { key: "namecheap",  label: "Namecheap"  },
// ];

// const PROVIDER_STEPS: Record<Provider, { title: string; body: string; highlight?: string }[]> = {
//   cloudflare: [
//     { title: "Log in",         body: "Log in to your Cloudflare dashboard." },
//     { title: "Select domain",  body: "Click on the domain you want to configure." },
//     { title: "DNS Records",    body: "Go to DNS → Records in the left navigation.", highlight: "DNS → Records" },
//     { title: "Add record",     body: "Click Add record.",                            highlight: "Add record" },
//     { title: "Paste & save",   body: "Paste the MX records copied from your dashboard into the appropriate fields and save." },
//   ],
//   godaddy: [
//     { title: "Log in",         body: "Log in to your GoDaddy account." },
//     { title: "My Products",    body: "Go to My Products → Domains.",               highlight: "My Products → Domains" },
//     { title: "DNS",            body: "Click DNS next to your domain.",              highlight: "DNS" },
//     { title: "MX Records",     body: "Scroll to the MX Records section and click Add.", highlight: "Add" },
//     { title: "Paste & save",   body: "Paste the MX records copied from your dashboard and save changes." },
//   ],
//   namecheap: [
//     { title: "Log in",         body: "Log in to your Namecheap account." },
//     { title: "Domain List",    body: "Go to Domain List → Manage.",                highlight: "Domain List → Manage" },
//     { title: "Advanced DNS",   body: "Select Advanced DNS.",                        highlight: "Advanced DNS" },
//     { title: "Mail Settings",  body: "Locate Mail Settings.",                       highlight: "Mail Settings" },
//     { title: "Paste & save",   body: "Paste the MX records copied from your dashboard and save changes." },
//   ],
// };

// // ── Section 3: Verify ────────────────────────────────────────────
// const VERIFY_STEPS: {
//   title: string;
//   body: React.ReactNode;
// }[] = [
//   {
//     title: "Verify your MX records",
//     body:  (
//       <Paragraph variant="docs-par">
//         After adding MX records, verify your domain in the dashboard
//         by clicking the <Highlight>Check Verification</Highlight> button. Make sure
//         the status of every record changes to <Highlight>Verified</Highlight>.
//       </Paragraph>
//     ),
//   },
// ];

// /* ═══════════════════════════════════════════════════════════════
//    2. PRIMITIVES — tiny reusable UI pieces
//    ═══════════════════════════════════════════════════════════════ */

// function StepBadge({ n }: { n: number }) {
//   return (
//     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-800 to-cyan-700 border-2 border-sky-100 text-white text-sm font-bold font-schibsted flex-shrink-0 select-none">
//       {n}
//     </span>
//   );
// }

// function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
//   return (
//     <div className="flex gap-4 items-start">
//       <div className="pt-0.5">
//         <StepBadge n={step} />
//       </div>
//       <div className="flex-1 rounded-xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
//         <div className="px-4 py-2.5 bg-gradient-to-r from-sky-800 to-cyan-700">
//           <span className="font-schibsted font-semibold text-white text-sm tracking-wide">{title}</span>
//         </div>
//         <div className="px-5 py-3.5 text-sm text-neutral-700 font-schibsted leading-relaxed">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// function Connector() {
//   return (
//     <div className="flex gap-4">
//       <div className="flex justify-center w-8 flex-shrink-0">
//         <div className="w-px bg-gradient-to-b from-sky-300 to-cyan-300" style={{ minHeight: 16 }} />
//       </div>
//     </div>
//   );
// }

// function SectionHeading({ children }: { children: React.ReactNode }) {
//   return (
//     <h2 className="font-schibsted font-bold py-4 mb-3 mt-8 flex items-center gap-3 uppercase tracking-widest text-xs">
//       <span className="rounded-full px-4 py-2  bg-sky-800 text-white">{children}</span>
//     </h2>
//   );
// }

// function InlineNote({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50/60 px-4 py-3">
//       <p className="text-xs font-schibsted font-semibold text-sky-700 mb-1 uppercase tracking-wide">{label}</p>
//       <div className="text-sm text-neutral-700 font-schibsted leading-relaxed space-y-1">{children}</div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════
//    3. PROVIDER TABS — animated provider switcher
//    ═══════════════════════════════════════════════════════════════ */

// function ProviderSteps() {
//   const [active, setActive] = useState<Provider>("cloudflare");
//   const steps = PROVIDER_STEPS[active];

//   return (
//     <div>
//       {/* Tab bar */}
//       <div className="flex gap-1.5 mb-4 flex-wrap">
//         {PROVIDERS.map(({ key, label }) => (
//           <button
//             key={key}
//             onClick={() => setActive(key)}
//             className={`px-3 py-1 rounded-md text-xs font-schibsted font-medium transition-all border ${
//               active === key
//                 ? "bg-sky-50 border-sky-300 text-sky-800 shadow-sm"
//                 : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-sky-200 hover:text-sky-700"
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* Sub-steps rendered via map */}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={active}
//           initial={{ opacity: 0, y: 6 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -6 }}
//           transition={{ duration: 0.18 }}
//         >
//           {steps.map((s, i) => (
//             <div key={i}>
//               <div className="flex gap-3 items-start">
//                 <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold font-schibsted flex-shrink-0 mt-0.5 select-none">
//                   {String.fromCharCode(97 + i)}
//                 </span>
//                 <div className="flex-1 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-700 font-schibsted">
//                   <span className="font-semibold text-neutral-800">{s.title} — </span>
//                   {s.highlight
//                     ? s.body.split(s.highlight).flatMap((part, pi, arr) =>
//                         pi < arr.length - 1
//                           ? [part, <Highlight key={pi}>{s.highlight}</Highlight>]
//                           : [part]
//                       )
//                     : s.body}
//                 </div>
//               </div>
//               {i < steps.length - 1 && (
//                 <div className="flex gap-3">
//                   <div className="flex justify-center w-6 flex-shrink-0">
//                     <div className="w-px bg-cyan-200" style={{ minHeight: 10 }} />
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════
//    4. PAGE — renders everything via .map()
//    ═══════════════════════════════════════════════════════════════ */

// export default function DomainsPage() {
//   // Running step counter across all three sections
//   let globalStep = 0;

//   return (
//     <DocsPage toc={[]}>
//       <DocsBody className="prose prose-neutral max-w-none">

//         {/* ── Header ── */}
//         <div className="mb-8">
//           <Heading
//             as="h1"
//             className="!text-white !text-2xl !sm:text-2xl !md:text-3xl !lg:text-4xl !xl:text-5xl
//               inset-shadow-sm inset-shadow-black/70 text-shadow-3xl bg-gradient-to-b from-sky-800 to-cyan-700 mb-4
//               rounded-lg px-4 py-2"
//           >
//             How to Add and Configure Your Domain
//           </Heading>
//           <Paragraph variant="default" className="text-neutral-600 font-schibsted leading-relaxed">
//             Configure your domain to receive and route emails through Email Router.
//             Follow the steps below to add your domain, set up DNS records, and verify
//             your configuration.
//           </Paragraph>
//         </div>

//         {/* ── Prerequisites ── */}
//         <div className="mb-8">
//           <Callout type="info" title="Before You Start">
//             <ul className="list-disc list-inside space-y-1 text-sm">
//               <li>You need access to your domain's DNS settings through your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.).</li>
//               <li>
//                 At least one integration (Slack or Discord) must be set up.{" "}
//                 <CustomLink href="/docs/integrations" className="text-sky-800 hover:text-sky-900 underline">
//                   How to set up an integration
//                 </CustomLink>
//               </li>
//             </ul>
//           </Callout>
//         </div>

//         {/* ══ SECTION 1 ══ */}
//         {/* <SectionHeading>Add Domain in Dashboard</SectionHeading> */}
//         <div className="mb-2">
//           {DASHBOARD_STEPS.map((s, i) => {
//             globalStep++;
//             const stepNum = globalStep;
//             return (
//               <div key={i}>
//                 <StepCard step={stepNum} title={s.title}>
//                   {s.body}
//                 </StepCard>
//                 {i < DASHBOARD_STEPS.length - 1 && <Connector />}
//               </div>
//             );
//           })}
//         </div>

//         {/* ══ SECTION 2 ══ */}
//         {/* <SectionHeading>Add MX Records to Your DNS Provider</SectionHeading> */}
//         <div className="mb-2">
//           {(() => {
//             globalStep++;
//             return (
//               <StepCard step={globalStep} title="Paste MX records in your DNS provider">
//                 <Paragraph variant="docs-par" className="mb-4">
//                   Copy the MX records from the dashboard domain card and add them to your DNS
//                   provider. There will be 4 records in total. 
//                 </Paragraph>
//                 {/* <div className="mt-4">
//                   <ProviderSteps />
//                 </div> */}
//               </StepCard>
//             );
//           })()}
//         </div>

//         {/* ══ SECTION 3 ══ */}
//         {/* <SectionHeading>Verify Your Configuration</SectionHeading> */}
//         <div className="mb-12">
//           {VERIFY_STEPS.map((s, i) => {
//             globalStep++;
//             const stepNum = globalStep;
//             return (
//               <div key={i}>
//                 <StepCard step={stepNum} title={s.title}>
//                   {s.body}
//                 </StepCard>
//                 {i < VERIFY_STEPS.length - 1 && <Connector />}
//               </div>
//             );
//           })}
//         </div>

//         {/* ── Navigation ── */}
//         {/* <DocsNavigation
//           prev={{ title: "Introduction", href: "/docs" }}
//           next={{ title: "Integrations", href: "/docs/integrations" }}
//         /> */}

//       </DocsBody>
//     </DocsPage>
//   );
// }



"use client";

import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DocVideo } from "@/components/docs/DocVideo";

/* ═══════════════════════════════════════════════════════════════
   1. CONTENT — all raw data lives here, no JSX yet
   ═══════════════════════════════════════════════════════════════ */

// ── Section 1: Add Domain in Dashboard ──────────────────────────
const DASHBOARD_STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Add your domain",
    body: (
      <Paragraph variant="docs-par">
        After you sign in and navigate to the dashboard, select{" "}
        <CustomLink href="/dashboard/domains" className="text-sky-800 hover:text-sky-900 underline">
          Domains
        </CustomLink>{" "}
        from the sidebar. Select the <Highlight>Add Domain</Highlight> tab, enter your
        domain name (e.g., <Highlight>acme.com</Highlight>), and click{" "}
        <Highlight>Add Domain</Highlight>.
      </Paragraph>
    ),
  },
  {
    title: "Retrieve MX records",
    body: (
      <Paragraph variant="docs-par">
        After you click <Highlight>Add domain</Highlight>, if successfull you will be redirected to <Highlight>Domains</Highlight> tab. There you will see
        all your listed domain. Click any domain card and click <Highlight>Add to Resend</Highlight>. This will register your domain and generate the MX records you need to add to your DNS provider.
        Make sure to copy the MX records from the modal — you'll need them next.
      </Paragraph>
    ),
  },
];

// ── Section 2: DNS provider sub-steps ───────────────────────────
type Provider = "cloudflare" | "godaddy" | "namecheap";

const PROVIDERS: { key: Provider; label: string }[] = [
  { key: "cloudflare", label: "Cloudflare" },
  { key: "godaddy",    label: "GoDaddy"    },
  { key: "namecheap",  label: "Namecheap"  },
];

const PROVIDER_STEPS: Record<Provider, { title: string; body: string; highlight?: string }[]> = {
  cloudflare: [
    { title: "Log in",        body: "Log in to your Cloudflare dashboard." },
    { title: "Select domain", body: "Click on the domain you want to configure." },
    { title: "DNS Records",   body: "Go to DNS → Records in the left navigation.", highlight: "DNS → Records" },
    { title: "Add record",    body: "Click Add record.",                            highlight: "Add record" },
    { title: "Paste & save",  body: "Paste the MX records copied from your dashboard into the appropriate fields and save." },
  ],
  godaddy: [
    { title: "Log in",        body: "Log in to your GoDaddy account." },
    { title: "My Products",   body: "Go to My Products → Domains.",               highlight: "My Products → Domains" },
    { title: "DNS",           body: "Click DNS next to your domain.",              highlight: "DNS" },
    { title: "MX Records",   body: "Scroll to the MX Records section and click Add.", highlight: "Add" },
    { title: "Paste & save",  body: "Paste the MX records copied from your dashboard and save changes." },
  ],
  namecheap: [
    { title: "Log in",        body: "Log in to your Namecheap account." },
    { title: "Domain List",   body: "Go to Domain List → Manage.",                highlight: "Domain List → Manage" },
    { title: "Advanced DNS",  body: "Select Advanced DNS.",                        highlight: "Advanced DNS" },
    { title: "Mail Settings", body: "Locate Mail Settings.",                       highlight: "Mail Settings" },
    { title: "Paste & save",  body: "Paste the MX records copied from your dashboard and save changes." },
  ],
};

// ── Section 3: Verify ────────────────────────────────────────────
const VERIFY_STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Verify your MX records",
    body: (
      <Paragraph variant="docs-par">
        After adding MX records, verify your domain in the dashboard
        by clicking the <Highlight>Check Verification</Highlight> button. Make sure
        the status of every record changes to <Highlight>Verified</Highlight>.
      </Paragraph>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════════
   2. PRIMITIVES — tiny reusable UI pieces
   ═══════════════════════════════════════════════════════════════ */

function StepBadge({ n }: { n: number }) {
  return (
    <span className="relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-800 to-cyan-700 border-2 border-sky-100 text-white text-sm font-bold font-schibsted flex-shrink-0 select-none">
      {n}
    </span>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start mb-4">
      <div className="pt-3">
        <StepBadge n={step} />
      </div>
      <div className="flex-1 rounded-xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-sky-800 to-cyan-700">
          <span className="font-schibsted font-semibold text-white text-sm tracking-wide">{title}</span>
        </div>
        <div className="px-5 py-3.5 text-sm text-neutral-700 font-schibsted leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-schibsted font-bold py-4 mb-3 mt-8 flex items-center gap-3 uppercase tracking-widest text-xs">
      <span className="rounded-full px-4 py-2 bg-sky-800 text-white">{children}</span>
    </h2>
  );
}

function InlineNote({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50/60 px-4 py-3">
      <p className="text-xs font-schibsted font-semibold text-sky-700 mb-1 uppercase tracking-wide">{label}</p>
      <div className="text-sm text-neutral-700 font-schibsted leading-relaxed space-y-1">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. PROVIDER TABS — animated provider switcher
   ═══════════════════════════════════════════════════════════════ */

function ProviderSteps() {
  const [active, setActive] = useState<Provider>("cloudflare");
  const steps = PROVIDER_STEPS[active];

  return (
    <div>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {PROVIDERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-3 py-1 rounded-md text-xs font-schibsted font-medium transition-all border ${
              active === key
                ? "bg-sky-50 border-sky-300 text-sky-800 shadow-sm"
                : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-sky-200 hover:text-sky-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {steps.map((s, i) => (
            <div key={i}>
              <div className="flex gap-3 items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold font-schibsted flex-shrink-0 mt-0.5 select-none">
                  {String.fromCharCode(97 + i)}
                </span>
                <div className="flex-1 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-700 font-schibsted">
                  <span className="font-semibold text-neutral-800">{s.title} — </span>
                  {s.highlight
                    ? s.body.split(s.highlight).flatMap((part, pi, arr) =>
                        pi < arr.length - 1
                          ? [part, <Highlight key={pi}>{s.highlight}</Highlight>]
                          : [part]
                      )
                    : s.body}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex gap-3">
                  <div className="flex justify-center w-6 flex-shrink-0">
                    <div className="w-px bg-cyan-200" style={{ minHeight: 10 }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. PAGE — renders everything via .map()
   ═══════════════════════════════════════════════════════════════ */

export default function DomainsPage() {
  let globalStep = 0;

  return (
    <DocsPage toc={[
      { title: "Prerequisites", url: "#prerequisites", depth: 2 },
      { title: "Add your domain", url: "#add-your-domain", depth: 2 },
      { title: "Configure DNS records", url: "#configure-dns", depth: 2 },
      { title: "Verify your domain", url: "#verify-domain", depth: 2 },
    ]}
    tableOfContent={{
    style: 'clerk',
  }}>
      <DocsBody className="prose prose-neutral max-w-none">

        {/* ── Header ── */}
        <div className="mb-8">
          <Heading
            as="h1"
            className="!text-white !text-2xl !sm:text-2xl !md:text-3xl !lg:text-4xl !xl:text-5xl
              inset-shadow-sm inset-shadow-black/70 text-shadow-3xl bg-gradient-to-b from-sky-800 to-cyan-700 mb-4
              rounded-lg px-4 py-2"
          >
            How to Add and Configure Your Domain
          </Heading>
          <Paragraph variant="home-par" className="text-neutral-600 font-schibsted leading-relaxed">
            Configure your domain to receive and route emails through Email Router.
            Follow the steps below to add your domain, set up DNS records, and verify
            your configuration.
          </Paragraph>
        </div>

        <DocVideo
          url="https://youtu.be/-Z3luBBqEM8"
          label="Watch overview · 2 min"
        />

        {/* ── Prerequisites ── */}
        <div className="mb-8" id="prerequisites">
          <Callout type="info" title="Before You Start">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>You need access to your domain's DNS settings through your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.).</li>
              {/* <li>
                At least one integration of slack must be set up.{" "}
                <CustomLink href="/docs/integrations" className="text-sky-800 hover:text-sky-900 underline">
                  How to set up an integration
                </CustomLink>
              </li> */}
            </ul>
          </Callout>
        </div>

        {/* ══ ALL STEPS — single relative wrapper, absolute line runs full height ══ */}
        <div className="relative mb-12">

          {/* Absolute vertical line behind all badges */}
          <div className="absolute left-[15px] top-10 bottom-4 w-px bg-gradient-to-b from-sky-800 to-cyan-100 z-0" />

          {/* ── Section 1: Dashboard steps ── */}
          <div id="add-your-domain" />
          {DASHBOARD_STEPS.map((s, i) => {
            globalStep++;
            return (
              <StepCard key={`dashboard-${i}`} step={globalStep} title={s.title}>
                {s.body}
              </StepCard>
            );
          })}

          {/* ── Section 2: DNS step (standalone) ── */}
          <div id="configure-dns" />
          {(() => {
            globalStep++;
            return (
              <StepCard key="dns" step={globalStep} title="Paste MX records in your DNS provider">
                <Paragraph variant="docs-par">
                  Copy the MX records from the dashboard domain card and add them to your DNS
                  provider. There will be 4 records in total.
                </Paragraph>
                {/* <div className="mt-4">
                  <ProviderSteps />
                </div> */}
              </StepCard>
            );
          })()}

          {/* ── Section 3: Verify steps ── */}
          {VERIFY_STEPS.map((s, i) => {
            globalStep++;
            return (
              <StepCard key={`verify-${i}`} step={globalStep} title={s.title}>
                {s.body}
              </StepCard>
            );
          })}

        </div>

        {/* ── Navigation ── */}
        {/* <DocsNavigation
          prev={{ title: "Introduction", href: "/docs" }}
          next={{ title: "Integrations", href: "/docs/integrations" }}
        /> */}

      </DocsBody>
    </DocsPage>
  );
}
// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { CustomLink } from "@/components/CustomLink";
// import { CodeBlock } from "@/components/docs/CodeBlock";
// import { Callout } from "@/components/docs/Callout";
// import { DocsNavigation } from "@/components/docs/DocsNavigation";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";

// export default function AliasesPage() {
//   return (
//     <article className="prose prose-neutral max-w-none">
//       <div className="mb-8">
//         <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
//           Email Aliases
//         </Badge>
//         <Heading as="h1" className="text-neutral-900 mb-4">
//           Create Email Aliases
//         </Heading>
//         <Paragraph variant="docs-par" className="">
//           Map email addresses to Slack or Discord channels. Route support@, sales@, billing@ and more to different teams.
//         </Paragraph>
//       </div>

//       <Callout type="info" title="Before You Start">
//         <ul className="list-disc list-inside space-y-1 text-sm">
//           <li>Domain must be added and configured</li>
//           <li>At least one integration (Slack or Discord) must be set up</li>
//         </ul>
//       </Callout>

//       <div className="my-12">
//         <Heading as="h2" variant="muted" className="text-neutral-900 mb-4">
//           Create an Alias
//         </Heading>

//         <Paragraph variant="docs-par" className="mb-4">
//         <ol className="list-decimal list-inside space-y-3 ">
//           <li>Go to <CustomLink href="/dashboard/aliases" className="text-sky-800 hover:text-sky-900 underline">Dashboard → Aliases</CustomLink></li>
//           <li>Click "Add Alias"</li>
//           <li>Select your domain from the dropdown</li>
//           <li>Enter the local part (e.g., <Highlight>support</Highlight>, <Highlight>sales</Highlight>, <Highlight>billing</Highlight>).
//           Your email address will be <Highlight>localpart@yourdomain.com</Highlight>. (e.g. <Highlight>support@yourdomain.com</Highlight>, <Highlight>sales@yourdomain.com</Highlight>, <Highlight>billing@yourdomain.com</Highlight>)</li>
//           <li>Select the target integration (Slack or Discord channel)</li>
//           <li>Click the button <Highlight>Create Alias</Highlight></li>
//         </ol>
//         </Paragraph>
//       </div>

//       <DocsNavigation
//         prev={{
//           title: "Discord Integration",
//           href: "/docs/integrations/discord",
//         }}
//         next={{
//           title: "Ticket Management",
//           href: "/docs/tickets",
//         }}
//       />
//     </article>
//   );
// }


import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { Callout } from "@/components/docs/Callout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AliasesPage() {
  return (
    <article className="prose prose-neutral max-w-none">

      {/* ── Header ── */}
      <div className="mb-8">
        <Badge className="mb-4 bg-sky-100 text-sky-800 font-schibsted font-medium">
          Email Aliases
        </Badge>
        <Heading as="h1" className="text-neutral-900 mb-4">
          Create Email Aliases
        </Heading>
        <Paragraph variant="default" className="text-neutral-600 font-schibsted leading-relaxed">
          Map email addresses to Slack or Discord channels. Route support@,
          sales@, billing@ and more to different teams.
        </Paragraph>
      </div>

      {/* ── Prerequisites ── */}
      <div className="mb-8">
        <Callout type="info" title="Before You Start">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Domain must be added and configured.{" "}
              <CustomLink
                href="/docs/domains"
                className="text-sky-800 hover:text-sky-900 underline"
              >
                How to add a domain
              </CustomLink>
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
        <div className="relative flex gap-4">
          <div className="relative z-10 flex-shrink-0 pt-1">
            <span className="inline-flex items-center justify-center bg-gradient-to-b from-sky-800 to-cyan-700 text-white rounded-full w-10 h-10 text-sm font-schibsted font-bold">
              1
            </span>
          </div>
          <Card className="flex-1">
            <CardContent className="px-0">
              <Heading as="h2" variant="small" className="text-neutral-100 mb-4">
                <div className="inline-flex items-center w-full mb-2 bg-gradient-to-b from-sky-800 to-cyan-700 rounded px-2.5 py-2">
                  Create an Alias
                </div>
              </Heading>
              <Paragraph variant="docs-par" className="mb-0 pl-8">
                <ol className="list-decimal list-inside space-y-2 font-schibsted">
                  <li>
                    Go to{" "}
                    <CustomLink
                      href="/dashboard/aliases"
                      className="text-sky-800 hover:text-sky-900 underline"
                    >
                      Dashboard → Aliases
                    </CustomLink>
                    .
                  </li>
                  <li>Click <Highlight>Add Alias</Highlight>.</li>
                  <li>Select your domain from the dropdown.</li>
                  <li>
                    Enter the local part (e.g.,{" "}
                    <Highlight>support</Highlight>,{" "}
                    <Highlight>sales</Highlight>,{" "}
                    <Highlight>billing</Highlight>). Your email address will be{" "}
                    <Highlight>localpart@yourdomain.com</Highlight> (e.g.{" "}
                    <Highlight>support@yourdomain.com</Highlight>,{" "}
                    <Highlight>sales@yourdomain.com</Highlight>,{" "}
                    <Highlight>billing@yourdomain.com</Highlight>).
                  </li>
                  <li>Select the target integration (Slack or Discord channel).</li>
                  <li>Click <Highlight>Create Alias</Highlight>.</li>
                </ol>
              </Paragraph>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* ── Navigation ── */}
      <DocsNavigation
        prev={{ title: "Discord Integration", href: "/docs/integrations/discord" }}
        next={{ title: "Ticket Management", href: "/docs/tickets" }}
      />

    </article>
  );
}
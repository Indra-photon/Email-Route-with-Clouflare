// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { Suspense } from "react";
// import dbConnect from "@/lib/dbConnect";
// import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
// import { Domain } from "@/app/api/models/DomainModel";
// import DomainAddForm from "@/components/dashboard/DomainAddForm";
// import DomainsTable from "@/components/dashboard/DomainsTable";
// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";

// export type DomainRow = {
//   id: string;
//   domain: string;
//   status: string;
//   verifiedForSending: boolean;
//   receivingEnabled: boolean;
//   createdAt: string;
// };

// export default async function DomainsPage() {
//   const { userId } = await auth();
//   if (!userId) redirect("/sign-in");

//   await dbConnect();
//   const workspace = await getOrCreateWorkspaceForCurrentUser();

//   const rawDomains = await Domain.find({ workspaceId: workspace._id })
//     .select("domain status verifiedForSending receivingEnabled createdAt")
//     .sort({ createdAt: -1 })
//     .lean();

//   const domains: DomainRow[] = rawDomains.map((d) => ({
//     id: d._id.toString(),
//     domain: d.domain,
//     status: d.status,
//     verifiedForSending: d.verifiedForSending ?? false,
//     receivingEnabled: d.receivingEnabled ?? false,
//     createdAt: d.createdAt.toISOString(),
//   }));

//   return (
//     <DomainsTable initialDomains={domains} />
//   );
// }


import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { Domain } from "@/app/api/models/DomainModel";
import DomainsTable from "@/components/dashboard/DomainsTable";
import DomainsTableSkeleton from "@/components/dashboard/DomainsTableSkeleton";
import { Paragraph } from "@/components/Paragraph";
import { Heading } from "@/components/Heading";

export type DomainRow = {
  id: string;
  domain: string;
  status: string;
  verifiedForSending: boolean;
  receivingEnabled: boolean;
  createdAt: string;
};

// ── This component does the blocking DB work ──────────────────────────────────
async function DomainListLoader() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await dbConnect();
  const workspace = await getOrCreateWorkspaceForCurrentUser();

  const rawDomains = await Domain.find({ workspaceId: workspace._id })
    .select("domain status verifiedForSending receivingEnabled createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const domains: DomainRow[] = rawDomains.map((d) => ({
    id: d._id.toString(),
    domain: d.domain,
    status: d.status,
    verifiedForSending: d.verifiedForSending ?? false,
    receivingEnabled: d.receivingEnabled ?? false,
    createdAt: d.createdAt.toISOString(),
  }));

  return <DomainsTable initialDomains={domains} />;
}

// ── Page renders instantly — skeleton shows while loader fetches ──────────────
export default function DomainsPage() {
  return (
    <div className="border border-neutral-400 rounded-lg p-4 min-h-screen">
        <div className="mb-6 ">
          <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">Add Your Domains</Heading>
          <Paragraph className="text-sm text-neutral-600 dark:text-neutral-400">
            Add and verify your domains to use for email aliases.
          </Paragraph>
        </div>
      

        <Suspense fallback={<DomainsTableSkeleton />}>
          <DomainListLoader />
        </Suspense>
      </div>
  );
}
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { Domain } from "@/app/api/models/DomainModel";
import DomainAddForm from "@/components/dashboard/DomainAddForm";
import DomainsTable from "@/components/dashboard/DomainsTable";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

export type DomainRow = {
  id: string;
  domain: string;
  status: string;
  verifiedForSending: boolean;
  receivingEnabled: boolean;
  createdAt: string;
};

export default async function DomainsPage() {
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

  return (
    <DomainsTable initialDomains={domains} />
  );
}
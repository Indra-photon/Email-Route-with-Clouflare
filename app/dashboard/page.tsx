// import Link from "next/link";
// import { auth } from "@clerk/nextjs/server";
// import dbConnect from "@/lib/dbConnect";
// import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
// import { Alias } from "@/app/api/models/AliasModel";
// import { Domain } from "@/app/api/models/DomainModel";
// import { Integration } from "@/app/api/models/IntegrationModel";

// export const revalidate = 30;

// export default async function DashboardPage() {
//   const { userId } = await auth();
//   if (!userId) return null;

//   await dbConnect();
//   const workspace = await getOrCreateWorkspaceForCurrentUser();
//   const workspaceId = workspace._id;

//   const [totalDomains, verifiedDomains, totalAliases, activeAliases, totalIntegrations] =
//     await Promise.all([
//       Domain.countDocuments({ workspaceId }),
//       Domain.countDocuments({ workspaceId, $or: [{ status: "verified" }, { verifiedForSending: true }] }),
//       Alias.countDocuments({ workspaceId }),
//       Alias.countDocuments({ workspaceId, status: "active" }),
//       Integration.countDocuments({ workspaceId }),
//     ]);

//   const recentDomains = await Domain.find({ workspaceId })
//     .sort({ createdAt: -1 })
//     .limit(3)
//     .lean();

//   const recentAliases = await Alias.find({ workspaceId })
//     .populate("domainId")
//     .sort({ createdAt: -1 })
//     .limit(3)
//     .lean();

//   const stats = [
//     {
//       label: "Total Domains",
//       value: totalDomains,
//       sub: `${verifiedDomains} verified`,
//       icon: "🌐",
//       color: "indigo",
//       href: "/dashboard/domains",
//     },
//     {
//       label: "Total Aliases",
//       value: totalAliases,
//       sub: `${activeAliases} active`,
//       icon: "📮",
//       color: "violet",
//       href: "/dashboard/aliases",
//     },
//     {
//       label: "Integrations",
//       value: totalIntegrations,
//       sub: totalIntegrations === 0 ? "Add Slack/Discord" : "connected",
//       icon: "🔗",
//       color: "sky",
//       href: "/dashboard/integrations",
//     },
//   ];

//   const colorMap: Record<string, string> = {
//     indigo: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300",
//     violet: "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/20 dark:border-violet-800 dark:text-violet-300",
//     sky: "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-300",
//   };

//   return (
//     <div className="space-y-8">
//       {/* Welcome */}
//       <div>
//         <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
//           Dashboard
//         </h1>
//         <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
//           Welcome to your Email Router workspace.
//         </p>
//       </div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {stats.map((s) => (
//           <Link
//             key={s.label}
//             href={s.href}
//             className={`border rounded-xl p-5 transition-shadow hover:shadow-md ${colorMap[s.color]}`}
//           >
//             <p className="text-3xl mb-1">{s.icon}</p>
//             <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{s.value}</p>
//             <p className="text-sm font-medium mt-1">{s.label}</p>
//             <p className="text-xs mt-0.5 opacity-75">{s.sub}</p>
//           </Link>
//         ))}
//       </div>

//       {/* Quick actions */}
//       <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5">
//         <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
//           Quick Actions
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//           {totalDomains === 0 && (
//             <Link
//               href="/dashboard/domains"
//               className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
//             >
//               <span className="text-2xl">🌐</span>
//               <div>
//                 <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Add your first domain</p>
//                 <p className="text-xs text-neutral-500">Connect a domain to start routing</p>
//               </div>
//             </Link>
//           )}
//           {totalDomains > 0 && totalAliases === 0 && (
//             <Link
//               href="/dashboard/aliases"
//               className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
//             >
//               <span className="text-2xl">📮</span>
//               <div>
//                 <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Create your first alias</p>
//                 <p className="text-xs text-neutral-500">Route emails to integrations</p>
//               </div>
//             </Link>
//           )}
//           {totalIntegrations === 0 && (
//             <Link
//               href="/dashboard/integrations"
//               className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
//             >
//               <span className="text-2xl">🔗</span>
//               <div>
//                 <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Add an integration</p>
//                 <p className="text-xs text-neutral-500">Slack or Discord webhook</p>
//               </div>
//             </Link>
//           )}
//           <Link
//             href="/dashboard/tickets/unassigned"
//             className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
//           >
//             <span className="text-2xl">📥</span>
//             <div>
//               <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">View unassigned tickets</p>
//               <p className="text-xs text-neutral-500">Claim and reply to incoming emails</p>
//             </div>
//           </Link>
//           <Link
//             href="/dashboard/tickets/mine"
//             className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
//           >
//             <span className="text-2xl">📧</span>
//             <div>
//               <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">My tickets</p>
//               <p className="text-xs text-neutral-500">Tickets assigned to you</p>
//             </div>
//           </Link>
//         </div>
//       </div>

//       {/* Recent domains */}
//       {recentDomains.length > 0 && (
//         <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
//             <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Recent Domains</h2>
//             <Link href="/dashboard/domains" className="text-xs text-indigo-600 hover:underline">View all →</Link>
//           </div>
//           <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
//             {recentDomains.map((d: any) => (
//               <li key={d._id.toString()} className="flex items-center justify-between px-5 py-3">
//                 <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100">{d.domain}</span>
//                 <span
//                   className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.status === "verified" || d.verifiedForSending
//                       ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//                       : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
//                     }`}
//                 >
//                   {d.verifiedForSending ? "Verified" : d.status?.replace("_", " ")}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Recent aliases */}
//       {recentAliases.length > 0 && (
//         <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
//             <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Recent Aliases</h2>
//             <Link href="/dashboard/aliases" className="text-xs text-indigo-600 hover:underline">View all →</Link>
//           </div>
//           <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
//             {recentAliases.map((a: any) => (
//               <li key={a._id.toString()} className="flex items-center justify-between px-5 py-3">
//                 <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100">{a.email}</span>
//                 <span
//                   className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.status === "active"
//                       ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//                       : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
//                     }`}
//                 >
//                   {a.status}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Empty state */}
//       {totalDomains === 0 && totalAliases === 0 && (
//         <div className="text-center py-12 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
//           <p className="text-4xl mb-3">✉️</p>
//           <p className="text-neutral-700 dark:text-neutral-300 font-medium">No domains yet</p>
//           <p className="text-sm text-neutral-500 mt-1 mb-4">
//             Add your first domain and create aliases to start routing emails.
//           </p>
//           <Link
//             href="/dashboard/domains"
//             className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
//           >
//             Add Domain →
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }



import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Custom components
import { Heading } from "@/components/Heading";
import { Container } from "@/components/Container";

// Shadcn UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import optimized components (we'll create these next)
import StatsCards from "@/components/dashboard/StatsCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

// Import skeletons
import StatsCardsSkeleton from "@/components/dashboard/StatsCardsSkeleton";
import RecentActivitySkeleton from "@/components/dashboard/RecentActivitySkeleton";

// ✅ ISR: Revalidate every 60 seconds
// Dashboard is pre-rendered and cached at edge
// Background refresh happens every 60s automatically
export const revalidate = 60;

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-dvh">
      <Container className="py-0">
        {/* Header */}
        <div className="mb-8">
          <Heading as="h1" className="text-foreground">
            Dashboard
          </Heading>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base font-schibsted">
            Welcome to your Email Router workspace
          </p>
        </div>

        {/* Stats Cards Section - Loads independently */}
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards />
        </Suspense>

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Recent Activity (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <Suspense fallback={<RecentActivitySkeleton />}>
              <RecentActivity />
            </Suspense>
          </div>

          {/* Right Column - Quick Actions (1/3 width on large screens) */}
          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>

        {/* Bottom CTA Card */}
        <Card className="mt-12">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex-1">
              <CardTitle className="text-lg">
                Need help getting started?
              </CardTitle>
              <CardDescription className="mt-1">
                Check out our documentation or connect with support
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/docs">View Docs</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
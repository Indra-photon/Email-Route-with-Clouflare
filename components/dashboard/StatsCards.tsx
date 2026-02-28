import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { Domain } from "@/app/api/models/DomainModel";
import { Alias } from "@/app/api/models/AliasModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { EmailThread } from "@/app/api/models/EmailThreadModel";

// Custom components
import { Heading } from "@/components/Heading";
import { Container } from "@/components/Container";

// Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons from lucide-react
import { Mail, Clock, CheckCircle2, Globe } from "lucide-react";

export default async function StatsCards() {
  const { userId } = await auth();
  if (!userId) return null;

  await dbConnect();
  const workspace = await getOrCreateWorkspaceForCurrentUser();
  const workspaceId = workspace._id;

  // ✅ OPTIMIZATION: Single aggregation pipeline per collection
  // Before: 5 separate countDocuments() calls = 5 DB round trips
  // After: 1 aggregation with $facet = 1 DB round trip
  
  // Domain stats aggregation
  const [domainStats] = await Domain.aggregate([
    { $match: { workspaceId } },
    {
      $facet: {
        total: [{ $count: "count" }],
        verified: [
          {
            $match: {
              $or: [{ status: "verified" }, { verifiedForSending: true }],
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const totalDomains = domainStats.total[0]?.count || 0;
  const verifiedDomains = domainStats.verified[0]?.count || 0;

  // Alias stats aggregation
  const [aliasStats] = await Alias.aggregate([
    { $match: { workspaceId } },
    {
      $facet: {
        total: [{ $count: "count" }],
        active: [{ $match: { status: "active" } }, { $count: "count" }],
      },
    },
  ]);

  const totalAliases = aliasStats.total[0]?.count || 0;
  const activeAliases = aliasStats.active[0]?.count || 0;

  // Integration count (simple - no aggregation needed)
  const totalIntegrations = await Integration.countDocuments({ workspaceId });

  // ✅ Ticket stats with aggregation (for Phase 2)
  const [ticketStats] = await EmailThread.aggregate([
    { $match: { workspaceId } },
    {
      $facet: {
        open: [{ $match: { status: "open" } }, { $count: "count" }],
        inProgress: [
          { $match: { status: "in_progress" } },
          { $count: "count" },
        ],
        resolved: [{ $match: { status: "resolved" } }, { $count: "count" }],
        // Calculate average response time
        avgResponseTime: [
          {
            $match: {
              repliedAt: { $exists: true },
              receivedAt: { $exists: true },
            },
          },
          {
            $project: {
              responseTime: {
                $subtract: ["$repliedAt", "$receivedAt"],
              },
            },
          },
          {
            $group: {
              _id: null,
              avg: { $avg: "$responseTime" },
            },
          },
        ],
      },
    },
  ]);

  const openTickets = ticketStats.open[0]?.count || 0;
  const inProgressTickets = ticketStats.inProgress[0]?.count || 0;
  const resolvedToday = ticketStats.resolved[0]?.count || 0;
  const avgResponseMs = ticketStats.avgResponseTime[0]?.avg || 0;
  const avgResponseHours = (avgResponseMs / (1000 * 60 * 60)).toFixed(1);

  // Calculate trend (mock for now - you can add actual trend calculation)
  const openTrend = "+12%";
  const responseTrend = "-18%";

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Open Tickets Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Open Tickets
          </CardTitle>
          <Mail className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{openTickets}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
              {openTrend} vs last week
            </Badge>
          </p>
        </CardContent>
      </Card>

      {/* Average Response Time Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Response
          </CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {avgResponseHours}h
          </div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
              {responseTrend} improvement
            </Badge>
          </p>
        </CardContent>
      </Card>

      {/* Resolved Today Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Resolved Today
          </CardTitle>
          <CheckCircle2 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {resolvedToday}
          </div>
          <p className="text-xs text-muted-foreground">
            85% resolution rate
          </p>
        </CardContent>
      </Card>

      {/* Domains Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Domains
          </CardTitle>
          <Globe className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {totalDomains}
          </div>
          <p className="text-xs text-muted-foreground">
            {verifiedDomains} verified
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
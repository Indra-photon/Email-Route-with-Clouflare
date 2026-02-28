import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import Link from "next/link";

// Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Icons
import { ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default async function RecentActivity() {
  const { userId } = await auth();
  if (!userId) return null;

  await dbConnect();
  const workspace = await getOrCreateWorkspaceForCurrentUser();
  const workspaceId = workspace._id;

  // ✅ OPTIMIZATION: Use .lean() for faster queries (plain objects, not Mongoose docs)
  // ✅ Select only needed fields to reduce data transfer
  // ✅ Limit to 10 most recent items
  const recentTickets = await EmailThread.find({ workspaceId })
    .select("from subject status assignedToName createdAt direction")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: {
        label: "Open",
        className: "bg-amber-100 text-amber-700 font-schibsted font-medium",
        icon: AlertCircle,
      },
      in_progress: {
        label: "In Progress",
        className: "bg-sky-100 text-sky-700 font-schibsted font-medium",
        icon: Clock,
      },
      waiting: {
        label: "Waiting",
        className: "bg-purple-100 text-purple-700 font-schibsted font-medium",
        icon: Clock,
      },
      resolved: {
        label: "Resolved",
        className: "bg-green-100 text-green-700 font-schibsted font-medium",
        icon: CheckCircle2,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    const Icon = config.icon;

    return (
      <Badge variant="secondary" className={config.className}>
        <Icon className="mr-1 size-3" />
        {config.label}
      </Badge>
    );
  };

  // Helper function to format time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-neutral-900 font-schibsted">
          Recent Tickets
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link 
            href="/dashboard/tickets" 
            className="text-sky-800 font-schibsted font-medium hover:text-sky-900"
          >
            View All
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-neutral-100 p-4">
              <AlertCircle className="size-8 text-neutral-400" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-neutral-900 font-schibsted">
              No tickets yet
            </h3>
            <p className="text-sm text-neutral-600 font-schibsted font-normal">
              When you receive emails, they'll appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {recentTickets.map((ticket) => (
              <Link
                key={ticket._id.toString()}
                href={`/dashboard/tickets/${ticket._id}`}
                className="block py-4 transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* From */}
                    <p className="text-sm font-medium text-neutral-900 font-schibsted truncate">
                      {ticket.from}
                    </p>
                    {/* Subject */}
                    <p className="mt-1 text-sm text-neutral-600 font-schibsted font-normal truncate">
                      {ticket.subject}
                    </p>
                    {/* Meta info */}
                    <div className="mt-2 flex items-center gap-3">
                      {getStatusBadge(ticket.status)}
                      <span className="text-xs text-neutral-500 font-schibsted font-normal">
                        {getTimeAgo(ticket.createdAt)}
                      </span>
                      {ticket.assignedToName && (
                        <span className="text-xs text-neutral-600 font-schibsted font-normal">
                          Assigned to {ticket.assignedToName}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Arrow icon */}
                  <ArrowRight className="size-5 shrink-0 text-neutral-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
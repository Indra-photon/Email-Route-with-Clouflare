import Link from "next/link";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/dbConnect";
import ReceivingRequest from "@/app/api/models/ReceivingRequestModel";
import { Domain } from "@/app/api/models/DomainModel";

export default async function AdminDashboardPage() {
  await dbConnect();

  // Get stats
  const totalPending = await ReceivingRequest.countDocuments({ status: "pending" });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const approvedThisWeek = await ReceivingRequest.countDocuments({
    status: "approved",
    reviewedAt: { $gte: oneWeekAgo },
  });

  const rejectedThisWeek = await ReceivingRequest.countDocuments({
    status: "rejected",
    reviewedAt: { $gte: oneWeekAgo },
  });

  // Get recent activity
  const recentRequests = await ReceivingRequest.find()
    .sort({ requestedAt: -1 })
    .limit(10)
    .populate("domainId")
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Admin Dashboard
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Overview of receiving requests and system status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pending Requests */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Pending Requests
              </p>
              <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">
                {totalPending}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-200 dark:bg-amber-800 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <Link href="/admin/receiving-requests?status=pending" className="mt-4 block">
            <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700">
              Review Now
            </Button>
          </Link>
        </div>

        {/* Approved This Week */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Approved This Week
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                {approvedThisWeek}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* Rejected This Week */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Rejected This Week
              </p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">
                {rejectedThisWeek}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-200 dark:bg-red-800 rounded-lg flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/admin/receiving-requests?status=pending">
            <Button variant="outline" className="w-full justify-start">
              📋 View Pending Requests
            </Button>
          </Link>
          <Link href="/admin/receiving-requests">
            <Button variant="outline" className="w-full justify-start">
              📬 All Receiving Requests
            </Button>
          </Link>
          <Link href="/admin/domains">
            <Button variant="outline" className="w-full justify-start">
              🌐 View All Domains
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Recent Activity
        </h2>
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Domain
                </th>
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Requested By
                </th>
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Status
                </th>
                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-500">
                    No requests yet
                  </td>
                </tr>
              ) : (
                recentRequests.map((request: any) => (
                  <tr
                    key={request._id.toString()}
                    className="border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="p-3 font-mono text-neutral-900 dark:text-neutral-100">
                      {request.domainId?.domain || "N/A"}
                    </td>
                    <td className="p-3 text-neutral-700 dark:text-neutral-300">
                      {request.requestedBy}
                    </td>
                    <td className="p-3">
                      {request.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          ⏳ Pending
                        </span>
                      )}
                      {request.status === "approved" && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          ✅ Approved
                        </span>
                      )}
                      {request.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          ❌ Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-400 text-xs">
                      {new Date(request.requestedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

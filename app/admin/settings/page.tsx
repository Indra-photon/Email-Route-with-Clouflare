import dbConnect from "@/lib/dbConnect";
import ReceivingRequest from "@/app/api/models/ReceivingRequestModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

export const revalidate = 60;

export default async function AdminSettingsPage() {
    await dbConnect();

    // System stats
    const [totalDomains, totalRequests, totalWorkspaces, pendingRequests] = await Promise.all([
        Domain.countDocuments(),
        ReceivingRequest.countDocuments(),
        Workspace.countDocuments(),
        ReceivingRequest.countDocuments({ status: "pending" }),
    ]);

    // Env config (read-only display)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "Not set";
    const notificationEmail = process.env.NOTIFICATION_FROM_EMAIL || "Not set";
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
    const mongoConnected = !!process.env.MONGODB_URI;
    const resendConfigured = !!process.env.RESEND_API_KEY;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Settings</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    System configuration and admin management
                </p>
            </div>

            {/* System Stats */}
            <section>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    📊 System Stats
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalWorkspaces}</p>
                        <p className="text-xs text-neutral-500 mt-1">Workspaces</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalDomains}</p>
                        <p className="text-xs text-neutral-500 mt-1">Domains</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalRequests}</p>
                        <p className="text-xs text-neutral-500 mt-1">Total Requests</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{pendingRequests}</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Pending Reviews</p>
                    </div>
                </div>
            </section>

            {/* Integration Status */}
            <section>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    🔌 Integration Status
                </h2>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-700">
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">MongoDB</p>
                            <p className="text-xs text-neutral-500">Database connection</p>
                        </div>
                        <span className={`text-sm font-medium ${mongoConnected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            {mongoConnected ? "✅ Connected" : "❌ Not configured"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Resend</p>
                            <p className="text-xs text-neutral-500">Email sending service</p>
                        </div>
                        <span className={`text-sm font-medium ${resendConfigured ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            {resendConfigured ? "✅ Configured" : "❌ Not configured"}
                        </span>
                    </div>
                </div>
            </section>

            {/* Admin Access */}
            <section>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    🛡️ Admin Access
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    Managed via the <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">ADMIN_EMAILS</code> environment variable. Restart the server after changes.
                </p>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                    {adminEmails.length === 0 ? (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            ⚠️ No admin emails configured. Set <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">ADMIN_EMAILS</code> in your .env.local file.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {adminEmails.map((email, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 text-xs font-bold flex-shrink-0">
                                        {email[0].toUpperCase()}
                                    </span>
                                    <span className="font-mono text-neutral-900 dark:text-neutral-100">{email}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* Site Config */}
            <section>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    ⚙️ Site Configuration
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    Read from environment variables. Edit <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">.env.local</code> to update.
                </p>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-700">
                    <div className="flex items-center justify-between p-4 gap-4">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Site URL</p>
                            <p className="text-xs text-neutral-500 font-mono truncate">NEXT_PUBLIC_SITE_URL</p>
                        </div>
                        <code className="text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 max-w-xs truncate">
                            {siteUrl}
                        </code>
                    </div>
                    <div className="flex items-center justify-between p-4 gap-4">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Notification Email</p>
                            <p className="text-xs text-neutral-500 font-mono truncate">NOTIFICATION_FROM_EMAIL</p>
                        </div>
                        <code className="text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 max-w-xs truncate">
                            {notificationEmail}
                        </code>
                    </div>
                </div>
            </section>

            <p className="text-xs text-neutral-400 text-center">
                Changes to environment variables require a server restart to take effect.
            </p>
        </div>
    );
}

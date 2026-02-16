import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/admin-auth";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is admin
  const authCheck = await checkAdminAuth();

  if (!authCheck.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950">
      {/* Admin Header */}
      <header className="bg-purple-600 dark:bg-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-purple-200">Email Router Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-purple-100 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Admin Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 rounded-lg transition-colors"
                  >
                    📊 Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/receiving-requests"
                    className="block px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 rounded-lg transition-colors"
                  >
                    📬 Receiving Requests
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/domains"
                    className="block px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 rounded-lg transition-colors"
                  >
                    🌐 All Domains
                  </Link>
                </li>
                <li className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <Link
                    href="/admin/settings"
                    className="block px-4 py-2 text-sm font-medium text-neutral-500 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    ⚙️ Settings
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Admin Info Card */}
            <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">
                Admin Access
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-400">
                {authCheck.user?.emailAddresses?.[0]?.emailAddress || "Admin"}
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

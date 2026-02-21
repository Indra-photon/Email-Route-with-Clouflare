import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/admin-auth";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authCheck = await checkAdminAuth();

  if (!authCheck.isAdmin) {
    redirect("/dashboard");
  }

  const adminEmail =
    authCheck.user?.emailAddresses?.[0]?.emailAddress || "Admin";

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950">
      {/* Admin Header */}
      <header className="bg-purple-600 dark:bg-purple-700 text-white shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 pl-10 lg:pl-0">
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
                className="text-sm text-purple-100 hover:text-white transition-colors hidden sm:block"
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
          {/* Sidebar — rendered by AdminNav (handles mobile + desktop) */}
          <AdminNav />

          {/* Main Content */}
          <main className="flex-1 min-w-0 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            {children}
          </main>
        </div>

        {/* Admin info below sidebar on mobile */}
        <div className="lg:hidden mt-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">
            Admin Access
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-400 truncate">{adminEmail}</p>
        </div>
      </div>
    </div>
  );
}

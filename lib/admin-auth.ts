import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Check if the current user is an admin
 * Uses Clerk's publicMetadata to check for admin role
 *
 * To set a user as admin in Clerk:
 * 1. Go to Clerk Dashboard > Users
 * 2. Select user
 * 3. Go to "Metadata" tab
 * 4. Add to Public Metadata: { "role": "admin" }
 *
 * Or use environment variable for simple admin check:
 * Set ADMIN_EMAIL in .env.local
 */
export async function checkAdminAuth() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        isAdmin: false,
        error: "Unauthorized",
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    const user = await currentUser();

    if (!user) {
      return {
        isAdmin: false,
        error: "User not found",
        response: NextResponse.json({ error: "User not found" }, { status: 404 }),
      };
    }

    // Check if user email matches admin email (env variable method)
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user.emailAddresses?.[0]?.emailAddress;

    if (adminEmail && userEmail === adminEmail) {
      return {
        isAdmin: true,
        user,
        userId,
      };
    }

    // Check if user has admin role in public metadata (Clerk metadata method)
    const userRole = user.publicMetadata?.role;

    if (userRole === "admin") {
      return {
        isAdmin: true,
        user,
        userId,
      };
    }

    // Not an admin
    return {
      isAdmin: false,
      error: "Forbidden - Admin access required",
      response: NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      ),
    };
  } catch (error) {
    console.error("Admin auth check error:", error);
    return {
      isAdmin: false,
      error: "Internal server error",
      response: NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Middleware helper for admin-only API routes
 * Returns null if authorized, or NextResponse if unauthorized
 */
export async function requireAdmin() {
  const authCheck = await checkAdminAuth();

  if (!authCheck.isAdmin) {
    return authCheck.response;
  }

  return null; // Authorized
}

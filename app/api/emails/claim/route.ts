import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get threadId from request body
    const body = await request.json();
    const { threadId } = body;

    // Validate threadId
    if (!threadId) {
      return NextResponse.json(
        { error: "threadId is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the email thread
    const thread = await EmailThread.findById(threadId);

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if already claimed
    if (thread.assignedTo) {
      return NextResponse.json(
        {
          error: "This ticket is already claimed",
          claimedBy: {
            name: thread.assignedToName,
            email: thread.assignedToEmail,
            claimedAt: thread.claimedAt,
          },
        },
        { status: 400 }
      );
    }

    // Get user details from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    const userEmail = user.emailAddresses[0]?.emailAddress || "Unknown";
    const userName = user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : userEmail;

    // Update thread with assignment
    thread.assignedTo = userId;
    thread.assignedToEmail = userEmail;
    thread.assignedToName = userName;
    thread.claimedAt = new Date();
    await thread.save();

    return NextResponse.json(
      {
        success: true,
        message: "Ticket claimed successfully",
        thread: {
          id: thread._id.toString(),
          assignedTo: thread.assignedTo,
          assignedToEmail: thread.assignedToEmail,
          assignedToName: thread.assignedToName,
          claimedAt: thread.claimedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error claiming ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

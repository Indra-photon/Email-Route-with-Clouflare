import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

    // Check if ticket is claimed
    if (!thread.assignedTo) {
      return NextResponse.json(
        { error: "This ticket is not claimed" },
        { status: 400 }
      );
    }

    // Check if user is the one who claimed it
    if (thread.assignedTo !== userId) {
      return NextResponse.json(
        { error: "You can only unclaim tickets assigned to you" },
        { status: 403 }
      );
    }

    // Remove assignment
    thread.assignedTo = undefined;
    thread.assignedToEmail = undefined;
    thread.assignedToName = undefined;
    thread.claimedAt = undefined;
    await thread.save();

    return NextResponse.json(
      {
        success: true,
        message: "Ticket unclaimed successfully",
        thread: {
          id: thread._id.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unclaiming ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get workspace
    const workspace = await getOrCreateWorkspaceForCurrentUser();
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find all threads assigned to this user
    const myTickets = await EmailThread.find({
      workspaceId: workspace._id,
      direction: "inbound",
      assignedTo: userId,
    })
      .sort({ receivedAt: -1 })
      .limit(100)
      .lean();

    // Format response
    const formattedTickets = myTickets.map((ticket) => ({
      id: ticket._id.toString(),
      from: ticket.from,
      fromName: ticket.fromName,
      subject: ticket.subject,
      status: ticket.status,
      receivedAt: ticket.receivedAt,
      repliedAt: ticket.repliedAt,
      assignedTo: ticket.assignedTo,
      assignedToEmail: ticket.assignedToEmail,
      assignedToName: ticket.assignedToName,
      claimedAt: ticket.claimedAt,
    }));

    return NextResponse.json(
      {
        tickets: formattedTickets,
        total: formattedTickets.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching my tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

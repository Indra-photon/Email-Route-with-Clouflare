import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { Integration } from "@/app/api/models/IntegrationModel";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    const integrations = await Integration.find({ workspaceId: workspace._id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(
      integrations.map((i) => ({
        id: i._id.toString(),
        type: i.type,
        name: i.name,
        webhookUrl: i.webhookUrl,
        createdAt: i.createdAt,
      }))
    );
  } catch (error) {
    console.error("Error fetching integrations", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { type, name, webhookUrl } = body as {
      type?: string;
      name?: string;
      webhookUrl?: string;
    };

    if (type !== "slack" && type !== "discord") {
      return NextResponse.json(
        { error: "type must be 'slack' or 'discord'" },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!webhookUrl || !webhookUrl.trim()) {
      return NextResponse.json(
        { error: "Webhook URL is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    const doc = await Integration.create({
      workspaceId: workspace._id,
      type,
      name: name.trim(),
      webhookUrl: webhookUrl.trim(),
    });

    return NextResponse.json(
      {
        id: doc._id.toString(),
        type: doc.type,
        name: doc.name,
        webhookUrl: doc.webhookUrl,
        createdAt: doc.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating integration", error);
    return NextResponse.json(
      { error: "Failed to create integration" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { Domain } from "@/app/api/models/DomainModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    const domains = await Domain.find({ workspaceId: workspace._id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(
      domains.map((d) => ({
        id: d._id.toString(),
        domain: d.domain,
        status: d.status,
        createdAt: d.createdAt,
      }))
    );
  } catch (error) {
    console.error("Error fetching domains", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { domain } = body as { domain?: string };

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    const doc = await Domain.create({
      workspaceId: workspace._id,
      domain: domain.toLowerCase().trim(),
      status: "pending_verification",
    });

    return NextResponse.json(
      {
        id: doc._id.toString(),
        domain: doc.domain,
        status: doc.status,
        createdAt: doc.createdAt,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating domain", error);

    return NextResponse.json(
      { error: "Failed to create domain" },
      { status: 500 }
    );
  }
}


const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'update-customization');
fs.mkdirSync(dir, { recursive: true });

const routeContent = `import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Domain } from "@/app/api/models/DomainModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import connectDB from "@/app/api/utils/connectDB";

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { domainId, botName, botAvatar, botDescription } = body;

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required" },
        { status: 400 }
      );
    }

    // Find domain
    const domain = await Domain.findById(domainId);
    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // Verify user owns this domain's workspace
    const workspace = await Workspace.findOne({
      _id: domain.workspaceId,
      clerkUserId: userId,
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Forbidden - you don't own this domain" },
        { status: 403 }
      );
    }

    // Update bot customization fields (allow setting to null to clear)
    if (botName !== undefined) {
      domain.botName = botName || null;
    }
    if (botAvatar !== undefined) {
      domain.botAvatar = botAvatar || null;
    }
    if (botDescription !== undefined) {
      domain.botDescription = botDescription || null;
    }

    await domain.save();

    return NextResponse.json({
      success: true,
      domain: {
        _id: domain._id,
        domain: domain.domain,
        botName: domain.botName,
        botAvatar: domain.botAvatar,
        botDescription: domain.botDescription,
      },
    });
  } catch (error) {
    console.error("PATCH /api/domains/update-customization error:", error);
    return NextResponse.json(
      { error: "Failed to update customization" },
      { status: 500 }
    );
  }
}`;

fs.writeFileSync(path.join(dir, 'route.ts'), routeContent);
console.log('Route file created successfully');

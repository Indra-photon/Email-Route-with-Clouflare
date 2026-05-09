/**
 * /api/workspace/ai-tags
 * ──────────────────────────────────────────────────────────────────
 * Lets a workspace owner manage their AI tag list stored in DB.
 *
 * GET    → returns the workspace's full tag list (seeds defaults on first call)
 * POST   → adds a new tag  { tag: string }
 * DELETE → removes a tag   { tag: string }
 * ──────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { DEFAULT_AI_TAGS } from "@/lib/groqTagging";

async function getWorkspace(ownerUserId: string) {
  return Workspace.findOne({ ownerUserId }).exec();
}

// ── GET: Return current tag list ──────────────────────────────────
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const workspace = await getWorkspace(userId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  // Seed on first call if empty
  if (workspace.aiTags.length === 0) {
    workspace.aiTags = [...DEFAULT_AI_TAGS];
    await workspace.save();
  }

  return NextResponse.json({
    tags: workspace.aiTags,
    defaults: [...DEFAULT_AI_TAGS],
  });
}

// ── POST: Add a new tag ───────────────────────────────────────────
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const tag = typeof body?.tag === "string" ? body.tag.trim().toLowerCase().replace(/\s+/g, "-") : null;

  if (!tag || tag.length < 2 || tag.length > 40) {
    return NextResponse.json({ error: "Invalid tag. Must be 2–40 characters." }, { status: 400 });
  }

  await dbConnect();
  const workspace = await getWorkspace(userId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  // Seed defaults if first time
  if (workspace.aiTags.length === 0) {
    workspace.aiTags = [...DEFAULT_AI_TAGS];
  }

  if (workspace.aiTags.includes(tag)) {
    return NextResponse.json({ error: "Tag already exists" }, { status: 409 });
  }

  if (workspace.aiTags.length >= 20) {
    return NextResponse.json({ error: "Maximum 20 tags allowed" }, { status: 400 });
  }

  workspace.aiTags.push(tag);
  await workspace.save();

  return NextResponse.json({ tags: workspace.aiTags, added: tag });
}

// ── DELETE: Remove a tag ──────────────────────────────────────────
export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const tag = typeof body?.tag === "string" ? body.tag.trim().toLowerCase() : null;

  if (!tag) {
    return NextResponse.json({ error: "Tag is required" }, { status: 400 });
  }

  await dbConnect();
  const workspace = await getWorkspace(userId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const before = workspace.aiTags.length;
  workspace.aiTags = workspace.aiTags.filter((t) => t !== tag);

  if (workspace.aiTags.length === before) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 });
  }

  await workspace.save();

  return NextResponse.json({ tags: workspace.aiTags, removed: tag });
}

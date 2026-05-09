/**
 * /api/workspace/members
 * ──────────────────────────────────────────────────────────────────
 * Lets a workspace owner manage their team member list stored in DB.
 *
 * GET    → returns the workspace's full member list
 * POST   → adds a new member  { name: string }
 * DELETE → removes a member   { name: string }
 * ──────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";

async function getWorkspace(ownerUserId: string) {
  return Workspace.findOne({ ownerUserId }).exec();
}

// ── GET: Return current member list ──────────────────────────────────
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const workspace = await getWorkspace(userId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  return NextResponse.json({ members: workspace.members ?? [] });
}

// ── POST: Add a new member ───────────────────────────────────────────
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const rawName = typeof body?.name === "string" ? body.name.trim() : null;

  if (!rawName || rawName.length < 2 || rawName.length > 50) {
    return NextResponse.json(
      { error: "Invalid name. Must be 2–50 characters." },
      { status: 400 }
    );
  }

  await dbConnect();
  const workspace = await getWorkspace(userId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  // Case-insensitive duplicate check
  const exists = (workspace.members ?? []).some(
    (m: string) => m.toLowerCase() === rawName.toLowerCase()
  );
  if (exists) {
    return NextResponse.json({ error: "Member already exists" }, { status: 409 });
  }

  if ((workspace.members ?? []).length >= 50) {
    return NextResponse.json({ error: "Maximum 50 members allowed" }, { status: 400 });
  }

  workspace.members = [...(workspace.members ?? []), rawName];
  await workspace.save();

  return NextResponse.json({ members: workspace.members, added: rawName });
}

// ── DELETE: Remove a member ──────────────────────────────────────────
export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : null;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  await dbConnect();
  const workspace = await getWorkspace(userId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const before = (workspace.members ?? []).length;
  workspace.members = (workspace.members ?? []).filter(
    (m: string) => m.toLowerCase() !== name.toLowerCase()
  );

  if (workspace.members.length === before) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  await workspace.save();

  return NextResponse.json({ members: workspace.members, removed: name });
}

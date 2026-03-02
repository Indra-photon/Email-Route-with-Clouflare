import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/chat/ws-token
// Returns the push secret for authenticated agents to join socket rooms.
// Safe because it's protected by Clerk auth — never exposed as NEXT_PUBLIC.
export async function GET() {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const secret = process.env.RENDER_PUSH_SECRET || "";
    if (!secret) {
        return NextResponse.json({ error: "WS secret not configured" }, { status: 500 });
    }

    return NextResponse.json({ secret });
}

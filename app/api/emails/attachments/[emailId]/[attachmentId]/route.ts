import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

type Params = { emailId: string; attachmentId: string };

// GET /api/emails/attachments/[emailId]/[attachmentId]
// Proxies an attachment download from Resend's API, enforcing workspace auth.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { emailId, attachmentId } = await params;

  // Auth check
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const workspace = await getOrCreateWorkspaceForCurrentUser();

  // Verify the email thread belongs to this workspace
  const thread = await EmailThread.findById(emailId).lean();
  if (!thread) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (thread.workspaceId.toString() !== workspace._id.toString()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Find the attachment metadata stored on the thread
  const attachmentMeta = thread.attachments?.find((a) => a.id === attachmentId);
  if (!attachmentMeta) {
    return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
  }

  // Fetch the attachment content from Resend using the stored download_url
  // (NOT /attachments/{id} which returns JSON metadata — use the download_url directly)
  if (!attachmentMeta.download_url) {
    return NextResponse.json({ error: "No download URL stored for this attachment" }, { status: 404 });
  }

  const resendRes = await fetch(attachmentMeta.download_url, {
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
  });

  if (!resendRes.ok) {
    console.error("❌ Resend attachment fetch failed:", resendRes.status, resendRes.statusText);
    return NextResponse.json({ error: "Failed to fetch attachment from Resend" }, { status: 502 });
  }

  const contentType = attachmentMeta.content_type || "application/octet-stream";
  const filename = encodeURIComponent(attachmentMeta.filename);

  return new NextResponse(resendRes.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}

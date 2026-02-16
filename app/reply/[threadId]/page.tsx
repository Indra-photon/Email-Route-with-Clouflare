import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { checkThreadAccess } from "@/lib/authHelpers";
import ReplyForm from "@/components/ReplyForm";

type PageProps = {
  params: Promise<{ threadId: string }>;
};

export default async function ReplyPage({ params }: PageProps) {
  const { threadId } = await params;
  const { userId } = await auth();

  const result = await checkThreadAccess(threadId);

  if (!result.access) {
    if (result.reason === "not_authenticated") {
      redirect(`/sign-in?redirect_url=/reply/${threadId}`);
    }
    return (
      <div className="min-h-dvh flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4" aria-hidden>🚫</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              {result.reason === "not_found" ? "Not Found" : "Access Denied"}
            </h1>
            <p className="text-neutral-600 mb-6">{result.error}</p>
            <Link
              href="/dashboard"
              className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-neutral-800 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const thread = result.thread;
  if (!thread) return null;

  // Determine claim status badge
  let claimStatusBadge = null;

  if (!thread.assignedTo) {
    // Unclaimed
    claimStatusBadge = (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-yellow-800 font-medium">⚠️ Not claimed yet</span>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          This ticket hasn't been assigned to anyone. Replying will auto-assign it to you.
        </p>
      </div>
    );
  } else if (thread.assignedTo === userId) {
    // Claimed by current user
    claimStatusBadge = (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-blue-800 font-medium">👤 Assigned to you</span>
        </div>
        <p className="text-xs text-blue-700 mt-1">
          Claimed {thread.claimedAt ? new Date(thread.claimedAt).toLocaleString() : ""}
        </p>
      </div>
    );
  } else {
    // Claimed by someone else
    claimStatusBadge = (
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-neutral-800 font-medium">
            👤 Assigned to: {thread.assignedToName || thread.assignedToEmail}
          </span>
        </div>
        <p className="text-xs text-neutral-600 mt-1">
          Claimed {thread.claimedAt ? new Date(thread.claimedAt).toLocaleString() : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 text-balance">
            Reply to Email
          </h1>
          <p className="text-neutral-600 mt-1 text-pretty">
            Send a response to this customer email
          </p>
        </div>

        {claimStatusBadge}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Original Email
          </h2>
          <div className="space-y-3">
            <div className="flex border-b border-neutral-200 pb-2">
              <span className="font-medium text-neutral-700 w-24 shrink-0">From:</span>
              <span className="text-neutral-900">{thread.from}</span>
            </div>
            <div className="flex border-b border-neutral-200 pb-2">
              <span className="font-medium text-neutral-700 w-24 shrink-0">To:</span>
              <span className="text-neutral-900">{thread.to}</span>
            </div>
            <div className="flex border-b border-neutral-200 pb-2">
              <span className="font-medium text-neutral-700 w-24 shrink-0">Subject:</span>
              <span className="text-neutral-900">{thread.subject}</span>
            </div>
            <div className="flex border-b border-neutral-200 pb-2">
              <span className="font-medium text-neutral-700 w-24 shrink-0">Date:</span>
              <span className="text-neutral-900 tabular-nums">
                {new Date(thread.receivedAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-medium text-neutral-700 mb-2">Message:</h3>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <pre className="whitespace-pre-wrap font-sans text-neutral-900 text-sm text-pretty">
                {thread.textBody || thread.htmlBody || "(No content)"}
              </pre>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Your Reply
          </h2>
          <ReplyForm
            threadId={threadId}
            thread={{ from: thread.from, subject: thread.subject }}
          />
        </div>
      </div>
    </div>
  );
}

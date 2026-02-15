import { redirect } from "next/navigation";
import Link from "next/link";
import { checkThreadAccess } from "@/lib/authHelpers";
import ReplyForm from "@/components/ReplyForm";

type PageProps = {
  params: Promise<{ threadId: string }>;
};

export default async function ReplyPage({ params }: PageProps) {
  const { threadId } = await params;

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

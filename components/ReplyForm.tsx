"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ReplyFormProps {
  threadId: string;
  thread: {
    from: string;
    subject: string;
  };
}

export default function ReplyForm({ threadId, thread }: ReplyFormProps) {
  const router = useRouter();
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim()) {
      setError("Please enter a reply message");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/emails/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          replyText: replyText.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send reply");
      }

      setSuccess(true);
      setReplyText("");

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4" aria-hidden>✅</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          Reply Sent Successfully!
        </h3>
        <p className="text-neutral-600 mb-4 text-pretty">
          Your reply has been sent to {thread.from}
        </p>
        <p className="text-sm text-neutral-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reply-to" className="block text-sm font-medium text-neutral-700 mb-2">
          To:
        </label>
        <input
          id="reply-to"
          type="text"
          value={thread.from}
          readOnly
          aria-readonly
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-700"
        />
      </div>

      <div>
        <label htmlFor="reply-subject" className="block text-sm font-medium text-neutral-700 mb-2">
          Subject:
        </label>
        <input
          id="reply-subject"
          type="text"
          value={`Re: ${thread.subject}`}
          readOnly
          aria-readonly
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-700"
        />
      </div>

      <div>
        <label htmlFor="reply-body" className="block text-sm font-medium text-neutral-700 mb-2">
          Your Reply: <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reply-body"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply here..."
          rows={10}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          disabled={sending}
          aria-invalid={!!error}
          aria-describedby={error ? "reply-error" : undefined}
        />
        <p className="text-sm text-neutral-500 mt-1 tabular-nums">
          {replyText.length} characters
        </p>
      </div>

      {error && (
        <div id="reply-error" className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={sending || !replyText.trim()}
          className="flex-1"
        >
          {sending ? "Sending..." : "Send Reply"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
          disabled={sending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

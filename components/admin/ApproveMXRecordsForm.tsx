"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ApproveMXRecordsFormProps {
  requestId: string;
  domainName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ApproveMXRecordsForm({
  requestId,
  domainName,
  onSuccess,
  onCancel,
}: ApproveMXRecordsFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [mxPriority1, setMxPriority1] = useState("10");
  const [mxValue1, setMxValue1] = useState("");
  const [mxPriority2, setMxPriority2] = useState("20");
  const [mxValue2, setMxValue2] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mxValue1.trim()) {
      toast.error("Please enter at least one MX record value");
      return;
    }

    setSubmitting(true);

    try {
      const mxRecords = [
        {
          type: "MX",
          name: "@",
          value: mxValue1.trim(),
          priority: parseInt(mxPriority1),
          ttl: "Auto",
        },
      ];

      // Add second MX record if provided
      if (mxValue2.trim()) {
        mxRecords.push({
          type: "MX",
          name: "@",
          value: mxValue2.trim(),
          priority: parseInt(mxPriority2),
          ttl: "Auto",
        });
      }

      const res = await fetch(`/api/admin/receiving-requests/${requestId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mxRecords,
          notes: adminNotes || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to approve request");
      }

      toast.success("Request approved successfully!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Failed to approve request:", error);
      toast.error(error.message || "Failed to approve request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 text-sm text-green-800 dark:text-green-300">
        <p className="font-medium mb-2">📋 Instructions:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Open Resend dashboard and go to Domains</li>
          <li>Find and click on {domainName}</li>
          <li>Enable "Receiving" in the settings</li>
          <li>Copy the MX record values shown</li>
          <li>Paste them below and approve</li>
        </ol>
        <a
          href="https://resend.com/domains"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-green-700 dark:text-green-400 underline hover:no-underline"
        >
          Open Resend Dashboard →
        </a>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          MX Record 1 (Required)
        </label>
        <div className="grid grid-cols-4 gap-2">
          <Input
            type="number"
            placeholder="Priority"
            value={mxPriority1}
            onChange={(e) => setMxPriority1(e.target.value)}
            className="col-span-1"
            required
          />
          <Input
            type="text"
            placeholder="MX record value (e.g., inbound-smtp.us-east-1.amazonaws.com)"
            value={mxValue1}
            onChange={(e) => setMxValue1(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          MX Record 2 (Optional)
        </label>
        <div className="grid grid-cols-4 gap-2">
          <Input
            type="number"
            placeholder="Priority"
            value={mxPriority2}
            onChange={(e) => setMxPriority2(e.target.value)}
            className="col-span-1"
          />
          <Input
            type="text"
            placeholder="MX record value (optional)"
            value={mxValue2}
            onChange={(e) => setMxValue2(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Admin Notes (Optional)
        </label>
        <Textarea
          placeholder="Add any notes about this approval..."
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={submitting || !mxValue1.trim()}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {submitting ? "Approving..." : "✅ Approve & Enable Receiving"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MarkResolvedButtonProps {
  threadId: string;
  currentStatus: string;
  onResolved?: () => void;
  size?: "sm" | "default" | "lg";
}

export default function MarkResolvedButton({
  threadId,
  currentStatus,
  onResolved,
  size = "sm"
}: MarkResolvedButtonProps) {
  const [resolving, setResolving] = useState(false);
  const router = useRouter();

  // Don't show if already resolved
  if (currentStatus === 'resolved') {
    return null;
  }

  const handleResolve = async () => {
    setResolving(true);

    try {
      const response = await fetch("/api/emails/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          status: "resolved"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to resolve ticket");
        return;
      }

      toast.success("Ticket marked as resolved!");

      if (onResolved) {
        onResolved();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast.error("Failed to resolve ticket. Please try again.");
    } finally {
      setResolving(false);
    }
  };

  return (
    <Button
      onClick={handleResolve}
      disabled={resolving}
      size={size}
      variant="outline"
      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
    >
      {resolving ? "Resolving..." : "✅ Mark Resolved"}
    </Button>
  );
}

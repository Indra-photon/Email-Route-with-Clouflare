"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ClaimButtonProps {
  threadId: string;
  onClaimed?: () => void;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export default function ClaimButton({
  threadId,
  onClaimed,
  size = "sm",
  variant = "default",
}: ClaimButtonProps) {
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    setClaiming(true);

    try {
      const response = await fetch("/api/emails/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to claim ticket");
        return;
      }

      toast.success("Ticket claimed successfully!");

      if (onClaimed) {
        onClaimed();
      }
    } catch (error) {
      console.error("Error claiming ticket:", error);
      toast.error("Failed to claim ticket. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Button
      onClick={handleClaim}
      disabled={claiming}
      size={size}
      variant={variant}
    >
      {claiming ? "Claiming..." : "Claim"}
    </Button>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UnclaimButtonProps {
  threadId: string;
  onUnclaimed?: () => void;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export default function UnclaimButton({
  threadId,
  onUnclaimed,
  size = "sm",
  variant = "outline",
}: UnclaimButtonProps) {
  const [unclaiming, setUnclaiming] = useState(false);
  const [open, setOpen] = useState(false);

  const handleUnclaim = async () => {
    setUnclaiming(true);

    try {
      const response = await fetch("/api/emails/unclaim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to unclaim ticket");
        return;
      }

      toast.success("Ticket unclaimed successfully!");
      setOpen(false);

      if (onUnclaimed) {
        onUnclaimed();
      }
    } catch (error) {
      console.error("Error unclaiming ticket:", error);
      toast.error("Failed to unclaim ticket. Please try again.");
    } finally {
      setUnclaiming(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={size} variant={variant}>
          Unclaim
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unclaim this ticket?</AlertDialogTitle>
          <AlertDialogDescription>
            This ticket will be moved back to the unassigned list and become
            available for others to claim.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnclaim} disabled={unclaiming}>
            {unclaiming ? "Unclaiming..." : "Unclaim"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

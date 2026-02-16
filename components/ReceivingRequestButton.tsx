"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ReceivingRequestButtonProps {
  domainId: string;
  isDisabled?: boolean;
  onRequestCreated?: () => void;
}

export default function ReceivingRequestButton({
  domainId,
  isDisabled = false,
  onRequestCreated,
}: ReceivingRequestButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReceiving = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/receiving-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domainId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to submit request");
        return;
      }

      toast.success("Receiving access requested successfully!", {
        description: "You'll receive an email when approved (typically 1-2 hours).",
      });

      // Call the callback if provided
      if (onRequestCreated) {
        onRequestCreated();
      }
    } catch (error) {
      console.error("Error requesting receiving access:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRequestReceiving}
      disabled={isDisabled || isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting Request...
        </>
      ) : (
        "Request Receiving Access"
      )}
    </Button>
  );
}

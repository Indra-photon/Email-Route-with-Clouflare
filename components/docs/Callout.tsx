"use client";

import { AlertCircle, CheckCircle2, Info, Lightbulb, XCircle } from "lucide-react";
import { Paragraph } from "@/components/Paragraph";
import { IconBulb } from "@/constants/icons";
import { useState } from "react";

interface CalloutProps {
  type?: "info" | "warning" | "success" | "error" | "tip";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  type = "info",
  title,
  children,
  className = "",
}: CalloutProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = {
    info: {
      icon: Info,
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      iconColor: "text-sky-600",
      titleColor: "text-sky-900",
      textColor: "text-sky-800",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
      titleColor: "text-amber-900",
      textColor: "text-amber-800",
    },
    success: {
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
      textColor: "text-green-800",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      textColor: "text-red-800",
    },
    tip: {
      icon: IconBulb,
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      iconColor: "text-sky-600",
      titleColor: "text-sky-900",
      textColor: "text-sky-800",
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor, textColor } =
    config[type];

  return (
    <div
      className={`rounded-lg border ${borderColor} ${bgColor} p-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3">
        {type === "tip" ? (
          <IconBulb isActive={isHovered} className={`size-5 shrink-0 mt-0.5 ${iconColor}`} />
        ) : (
          <Icon className={`size-5 shrink-0 mt-0.5 ${iconColor}`} />
        )}
        <div className="flex-1">
          {title && (
            <Paragraph variant="small" className={`font-semibold mb-2 ${titleColor}`}>
              {title}
            </Paragraph>
          )}
          <Paragraph variant="small" className={` ${textColor}`}>
            {children}
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
"use client";

import { AlertCircle, CheckCircle2, Info, Lightbulb, XCircle } from "lucide-react";
import { Paragraph } from "@/components/Paragraph";
import { IconBulb } from "@/constants/icons";
import { useState } from "react";
import { InfoIconAnimated } from "@/constants/icons";



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
      ringColor: "ring-sky-400",
      titleColor: "text-sky-900",
      textColor: "text-sky-800",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
      ringColor: "ring-amber-400",
      titleColor: "text-amber-900",
      textColor: "text-amber-800",
    },
    success: {
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      ringColor: "ring-green-400",
      titleColor: "text-green-900",
      textColor: "text-green-800",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      ringColor: "ring-red-400",
      titleColor: "text-red-900",
      textColor: "text-red-800",
    },
    tip: {
      icon: Lightbulb,
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      iconColor: "text-sky-600",
      ringColor: "ring-sky-400",
      titleColor: "text-sky-900",
      textColor: "text-sky-800",
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor, ringColor, titleColor, textColor } =
    config[type];

  return (
    <div
      className={`relative rounded-lg border ${borderColor} ${bgColor} pt-6 px-4 pb-4 mt-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Inset badge icon on top-left corner */}
      <div
        className={`absolute -top-3 left-4 flex items-center justify-center border-b border-sky-200 size-6 rounded-full ${bgColor}`}
      >
        {type === "tip" ? (
          <IconBulb isActive={isHovered} className={`size-4 ${iconColor}`} />
        ) : (
          <Icon className={`size-4 ${iconColor}`} />
        )}
      </div>

      {/* Content */}
      <div>
        {title && (
          <Paragraph variant="small" className={`font-semibold mb-2 ${titleColor}`}>
            {title}
          </Paragraph>
        )}
        <Paragraph variant="small" className={textColor}>
          {children}
        </Paragraph>
      </div>
    </div>
  );
}
import React from "react";
import { twMerge } from "tailwind-merge";

type ParagraphProps<T extends React.ElementType = "p"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
  variant?: "default" | "muted" | "small" | "docs-par" | "home-par";
};

export const Paragraph = <T extends React.ElementType = "p">({
  className,
  children,
  as,
  variant = "default",
}: ParagraphProps<T>) => {
  const Tag = as || "p";
  
  const variants = {
    default: "text-sm sm:text-base md:text-lg text-neutral-900 font-schibsted font-regular leading-relaxed",
    muted: "text-xs sm:text-sm md:text-base text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed",
    small: "text-xs sm:text-sm md:text-base text-neutral-900 font-schibsted font-regular leading-relaxed",
    "docs-par": "text-sm sm:text-base md:text-lg text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed",
    "home-par": "text-base md:text-xl text-neutral-900 font-schibsted font-regular",
  };
  
  return (
    <Tag
      className={twMerge(
        variants[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
};
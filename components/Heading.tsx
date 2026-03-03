import React from "react";
import { twMerge } from "tailwind-merge";

type HeadingProps<T extends React.ElementType = "h1"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
  variant?: "default" | "muted" | "small";
};

export const Heading = <T extends React.ElementType = "h1">({
  className,
  children,
  as,
  variant = "default",
}: HeadingProps<T>) => {
  const Tag = as || "h1";

    const variants = {
      default: "text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight text-white",
      muted: "text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-regular leading-tight text-white",
      small: "text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-regular leading-tight text-white",
    };
  
  return (
    
    <Tag
      className={twMerge(
        "font-schibsted",
        variants[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
};
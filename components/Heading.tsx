import React from "react";
import { twMerge } from "tailwind-merge";

type HeadingProps<T extends React.ElementType = "h1"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
};

export const Heading = <T extends React.ElementType = "h1">({
  className,
  children,
  as,
}: HeadingProps<T>) => {
  const Tag = as || "h1";
  
  return (
    <Tag
      className={twMerge(
        "font-schibsted",
        "text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight text-white",
        className
      )}
    >
      {children}
    </Tag>
  );
};
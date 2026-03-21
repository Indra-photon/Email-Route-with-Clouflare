"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { IconExternalLink } from "@tabler/icons-react";

interface CustomLinkProps {
  href: string;
  LinkTitle?: string;
  className?: string;
  children: ReactNode;
}

export const CustomLink = ({ href, LinkTitle, className, children }: CustomLinkProps) => {
  const handleClick = () => {};

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`
        group relative inline-flex items-center
        ${className ?? ""}
      `}
    >
      {children}

      <span
        className="
          inline-flex items-center overflow-hidden
          w-0 opacity-0 blur-md ml-0
          transition-[width,opacity,filter,margin-left]
          duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          group-hover:w-4 group-hover:opacity-100 group-hover:blur-none group-hover:ml-1
        "
      >
        <IconExternalLink size={14} stroke={1.5} className="shrink-0" />
      </span>
    </Link>
  );
};
"use client";

import Link from "next/link";
import { Logo } from "@/constants/Logo";
import {
  IconInfoCircle,
  IconTag,
  IconBook2,
  IconExternalLink,
  IconWorld,
  IconAt,
  IconTicket,
  IconBrandSlack,
  IconMessageChatbot,
  IconWriting,
  IconShieldLock,
  IconFileText,
  IconHelpCircle,
  IconMail,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

interface FooterLink {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "About Us", href: "/about", icon: IconInfoCircle },
      { label: "Pricing", href: "/pricing", icon: IconTag },
      { label: "Documentation", href: "/docs", icon: IconBook2 },
      { label: "AI Visibility Audit", href: "https://webaudits.dev", icon: IconExternalLink },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs", icon: IconBook2 },
      { label: "Domains", href: "/docs/domains", icon: IconWorld },
      { label: "Email Aliases", href: "/docs/aliases", icon: IconAt },
      { label: "Tickets", href: "/docs/tickets", icon: IconTicket },
      { label: "Slack Integration", href: "/docs/integrations/slack", icon: IconBrandSlack },
      { label: "Live Chat", href: "/docs/chatbot", icon: IconMessageChatbot },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog", icon: IconWriting },
      { label: "Privacy Policy", href: "/privacy", icon: IconShieldLock },
      { label: "Terms of Service", href: "/terms-of-service", icon: IconFileText },
      { label: "Terms and Conditions", href: "/terms-and-conditions", icon: IconFileText },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/frequently-asked-questions", icon: IconHelpCircle },
      { label: "Contact Support", href: "mailto:support@syncsupport.app", icon: IconMail },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sky-800 border-t border-sky-700">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="mb-4">
              <Link href="/" className="flex items-center gap-2 group w-fit">
                <Logo />
                <span className="font-schibsted text-lg font-semibold text-white transition-colors duration-150">SyncSupport</span>
              </Link>
              <p className="text-sm font-schibsted font-normal text-white mt-2 max-w-xs">
                Route your support emails directly to Slack. Fast, collaborative,
                and built for teams who want to work smarter.
              </p>
            </div>
          </div>

          {/* Footer Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-sm font-schibsted font-semibold text-sky-200 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  const inner = (
                    <span className="flex items-center gap-2 text-sm font-schibsted font-normal text-white transition-colors">
                      <Icon size={14} className="flex-shrink-0" />
                      {link.label}
                    </span>
                  );
                  return (
                    <li key={link.label}>
                      {link.href.startsWith("http") || link.href.startsWith("mailto") ? (
                        <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                          {inner}
                        </a>
                      ) : (
                        <Link href={link.href}>{inner}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sky-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-schibsted font-normal text-sky-300">
              © {currentYear} SyncSupport. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms-of-service" className="text-xs font-schibsted font-normal text-sky-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-xs font-schibsted font-normal text-sky-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="hidden sm:block text-xs font-schibsted font-normal text-neutral-100 hover:text-white transition-colors">
              Built by <Link href="https://x.com/Nil_phy_dreamer" className="hover:underline">Indranil</Link> and <Link href="" className="hover:underline">Aditya</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

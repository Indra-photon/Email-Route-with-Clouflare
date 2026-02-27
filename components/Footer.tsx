"use client";

import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "/roadmap" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Getting Started", href: "/docs/getting-started" },
      { label: "Setup Guides", href: "/docs/guides" },
      { label: "API Reference", href: "/docs/api" },
      { label: "Integrations", href: "/integrations" },
      { label: "Status", href: "https://status.emailrouter.com" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact Support", href: "mailto:support@galearen.resend.app" },
      { label: "Report Bug", href: "/report-bug" },
      { label: "Feature Request", href: "/feature-request" }
    ]
  }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-schibsted font-bold text-neutral-900 flex items-center gap-2">
                <span className="text-sky-600">✉</span>
                Email Router
              </h3>
              <p className="text-sm font-schibsted font-normal text-neutral-600 mt-2 max-w-xs">
                Route your support emails directly to Slack. Fast, collaborative, 
                and built for teams who want to work smarter.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://twitter.com/emailrouter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center hover:border-sky-300 hover:bg-sky-50 transition-colors group"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 text-neutral-600 group-hover:text-sky-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://github.com/emailrouter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center hover:border-sky-300 hover:bg-sky-50 transition-colors group"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 text-neutral-600 group-hover:text-sky-700" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/emailrouter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center hover:border-sky-300 hover:bg-sky-50 transition-colors group"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 text-neutral-600 group-hover:text-sky-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://slack.com/emailrouter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center hover:border-sky-300 hover:bg-sky-50 transition-colors group"
                aria-label="Slack Community"
              >
                <svg className="w-4 h-4 text-neutral-600 group-hover:text-sky-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-sm font-schibsted font-semibold text-neutral-900 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-schibsted font-normal text-neutral-600 hover:text-sky-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs font-schibsted font-normal text-neutral-500">
              © {currentYear} Email Router. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-xs font-schibsted font-normal text-neutral-500 hover:text-sky-700 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs font-schibsted font-normal text-neutral-500 hover:text-sky-700 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="text-xs font-schibsted font-normal text-neutral-500 hover:text-sky-700 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Built with badge */}
          <div className="mt-6 flex items-center justify-center">
            <p className="text-xs font-schibsted font-normal text-neutral-400">
              Built with{" "}
              <span className="text-sky-600">♥</span> for teams who love Slack
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
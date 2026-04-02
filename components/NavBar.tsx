"use client"

import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { navlinks } from "@/constants/navlinks"
import { useUserStore } from "@/lib/store"
import { useClerk } from "@clerk/nextjs"
import { LogOut, User as UserIcon } from "lucide-react"
import { Logo } from "@/constants/Logo"
import { Container } from "./Container"

// ─── Custom easing from globals.css ──────────────────────────────────────────
const EASE_OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1]
const EASE_OUT_CUBIC: [number, number, number, number] = [0.215, 0.61, 0.355, 1]
const EASE_IN_OUT_QUART: [number, number, number, number] = [0.77, 0, 0.175, 1]

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  position?: "sticky" | "fixed" | "relative"
  items?: NavItem[]
}

const DOC_LINKS = [
  {
    title: "Getting Started",
    description: "Install and set up in 5 minutes",
    href: "/docs",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
      </svg>
    ),
  },
  {
    title: "Domain Setup",
    description: "Configure DNS and MX records",
    href: "/docs/domains",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    title: "Integrations",
    description: "Connect Slack, Discord and more",
    href: "/docs/integrations/slack",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
      </svg>
    ),
  },
  {
    title: "Email Aliases",
    description: "Route emails to the right channel",
    href: "/docs/aliases",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    title: "Ticket Management",
    description: "Claim, reply and resolve tickets",
    href: "/docs/tickets",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    title: "Chatbot",
    description: "Embed the live chat widget",
    href: "/docs/chatbot",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
]

const QUICK_LINKS = [
  { title: "Quick Start", href: "/docs" },
  { title: "API Reference", href: "/docs/api" },
  { title: "Changelog", href: "/docs/changelog" },
]

function DocsDropdown() {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enter = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(true)
  }
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 100)
  }

  return (
    <li
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {/* Trigger — same style as NavLink */}
      <Link
        href="/docs"
        className="font-schibsted font-bold text-sm text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-1 flex items-center gap-1"
      >
        Docs
        <motion.svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_IN_OUT_QUART }}
          className="text-neutral-400"
        >
          <path d="M1 3.5L5 7.5L9 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </motion.svg>
      </Link>

      {/* Underline — matches NavLink indicator */}
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -bottom-0.5 left-0 right-0 h-px bg-sky-800"
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.4 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
      </AnimatePresence>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            onMouseEnter={enter}
            onMouseLeave={leave}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
            style={{ transformOrigin: "top center" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-white rounded-2xl border border-neutral-200/80 shadow-xl shadow-neutral-900/8 overflow-hidden"
          >
            {/* Arrow notch */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 bg-white border-l border-t border-neutral-200/80 rotate-45" />

            <div className="flex">
              {/* Left — doc categories */}
              <div className="flex-1 p-3">
                {DOC_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.22,
                      // delay: i * 0.04 + 0.06,
                      ease: EASE_OUT_CUBIC,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors duration-150 group"
                    >
                      <div className="mt-0.5 size-6 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0 text-sky-700 group-hover:bg-sky-100 transition-colors duration-150">
                        {link.icon}
                      </div>
                      <div>
                        <p className="font-schibsted font-semibold text-sm text-neutral-900 leading-tight">
                          {link.title}
                        </p>
                        <p className="font-schibsted text-xs text-neutral-500 mt-0.5 leading-snug">
                          {link.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Right — quick links */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.1, ease: EASE_OUT_CUBIC }}
                className="w-36 border-l border-neutral-100 bg-neutral-50/60 p-4 flex flex-col justify-between"
              >
                <div>
                  <p className="font-schibsted font-semibold text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
                    Quick Links
                  </p>
                  <div className="flex flex-col gap-1">
                    {QUICK_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="font-schibsted text-sm text-neutral-600 hover:text-neutral-900 hover:translate-x-0.5 transition-all duration-150 py-1"
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href="/docs"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex items-center gap-1.5 font-schibsted font-semibold text-xs text-sky-800 hover:text-sky-900 transition-colors duration-150"
                >
                  View all docs
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </motion.div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

// ─── Logo Mark ────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Logo />
    </Link>
  )
}

// ─── Nav Link with animated underline ────────────────────────────────────────
function NavLink({ item, index, hoveredIndex, onHover, onLeave }: {
  item: NavItem
  index: number
  hoveredIndex: number | null
  onHover: (i: number) => void
  onLeave: () => void
}) {
  return (
    <li
      className="relative"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      <Link
        href={item.href}
        className="font-schibsted font-bold text-sm text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-1 block"
      >
        {item.label}
      </Link>

      {/* Sliding dot indicator */}
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -bottom-0.5 left-0 right-0 h-px bg-sky-800"
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.4 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
            }}
          />
        )}
      </AnimatePresence>
    </li>
  )
}

// ─── Sign In Button ───────────────────────────────────────────────────────────
function SignInButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href="/sign-in">
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.97 }}
        className="relative flex items-center justify-between gap-0 overflow-hidden rounded-full bg-gradient-to-b from-sky-900 to-cyan-700 shadow-lg cursor-pointer"
      >
        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
          animate={
            hovered
              ? { backgroundPositionX: ["200%", "-200%"] }
              : { backgroundPositionX: "200%" }
          }
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        {/* Text */}
        <span className="relative z-10 font-schibsted font-semibold text-white text-sm uppercase tracking-wide select-none flex items-center justify-center flex-1 px-6 py-2.5">
          Sign In
        </span>
      </motion.button>
    </Link>
  );
}

// ─── User Dropdown ────────────────────────────────────────────────────────────
function UserMenu({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { signOut } = useClerk()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-schibsted font-medium text-sm text-neutral-700 hover:text-neutral-900 transition-colors duration-150 py-1"
      >
        <div className="size-7 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-sky-800 font-schibsted">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        {userName}
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_IN_OUT_QUART }}
          className="text-neutral-400"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, transformOrigin: "top right" }}
            animate={{ opacity: 1, scale: 1, transformOrigin: "top right" }}
            exit={{ opacity: 0, scale: 0.97, transformOrigin: "top right" }}
            transition={{ duration: 0.18, ease: EASE_OUT_QUART }}
            className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-neutral-200/80 py-1 z-50 overflow-hidden"
          >
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-schibsted font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-150"
            >
              <UserIcon size={14} className="text-neutral-400" />
              Profile
            </Link>

            <div className="h-px bg-neutral-100 mx-2 my-1" />

            <button
              onClick={() => { signOut(); setOpen(false) }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-schibsted font-medium text-red-500 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main NavBar ──────────────────────────────────────────────────────────────
export function NavBar({
  position = "sticky",
  items = navlinks.map(link => ({ label: link.label, href: link.url })),
}: NavbarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const user = useUserStore((state) => state.user)

  const positionClasses = {
    sticky: "sticky top-0",
    fixed: "fixed top-0 left-0 right-0",
    relative: "relative",
  }

  return (
    <div className="">
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
        className={`${positionClasses[position]} z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/70 `}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <LogoMark />

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-7">
              {items.map((item, index) =>
                item.label === "Docs" ? (
                  <DocsDropdown key={item.href} />
                ) : (
                  <NavLink
                    key={item.href}
                    item={item}
                    index={index}
                    hoveredIndex={hoveredIndex}
                    onHover={setHoveredIndex}
                    onLeave={() => setHoveredIndex(null)}
                  />
                )
              )}
            </ul>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-4">
              {user !== null ? (
                <UserMenu userName={user.name ?? ""} />
              ) : (
                <SignInButton />
              )}
            </div>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden size-9 flex items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.15, ease: EASE_OUT_CUBIC }}
                  >
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.15, ease: EASE_OUT_CUBIC }}
                  >
                    <Menu size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT_CUBIC }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white border-l border-neutral-200 z-50 md:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                <LogoMark />
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="size-8 flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 px-4 py-5 overflow-y-auto">
                <ul className="flex flex-col gap-1">
                  {items.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.28,
                        delay: index * 0.05,
                        ease: EASE_OUT_CUBIC,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl font-schibsted font-medium text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-150"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Drawer CTA */}
              <div className="px-4 pb-6 pt-2 border-t border-neutral-100">
                {user !== null ? (
                  <div className="flex items-center gap-3 px-3 py-3">
                    <div className="size-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-sky-800 font-schibsted">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-schibsted font-medium text-sm text-neutral-900">{user.name}</span>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2, ease: EASE_OUT_QUART }}
                  >
                    <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-3 rounded-xl bg-gradient-to-b from-sky-900 to-cyan-700 font-schibsted font-semibold text-sm text-white transition-opacity hover:opacity-90 active:scale-[0.98]">
                        Sign In
                      </button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
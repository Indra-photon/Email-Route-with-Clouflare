"use client"

import React from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { useRef, useState, useEffect, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { navlinks } from "@/constants/navlinks"
import { useUserStore } from "@/lib/store"
import { useClerk } from "@clerk/nextjs"
import { LogOut, User as UserIcon } from "lucide-react"
import {
  IconUser,
  IconBook2,
  IconRocket,
  IconWorld,
  IconPlug,
  IconAt,
  IconTicket,
  IconMessageChatbot,
} from "@tabler/icons-react"
import { Logo } from "@/constants/Logo"
import { Container } from "./Container"
import type { Post } from "@/lib/blog/hashnode"
import Image from "next/image"

// ─── Easings ──────────────────────────────────────────────────────────────────
const EASE_OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1]
const EASE_OUT_CUBIC: [number, number, number, number] = [0.215, 0.61, 0.355, 1]
const EASE_IN_OUT_QUART: [number, number, number, number] = [0.77, 0, 0.175, 1]
const SPRING = { type: "spring" as const, stiffness: 500, damping: 40 }

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

interface NavbarProps {
  position?: "sticky" | "fixed" | "relative"
  items?: NavItem[]
  initialBlogPosts?: Post[]
}

// ─── Doc links data ───────────────────────────────────────────────────────────
const DOC_LINKS = [
  {
    title: "Getting Started",
    description: "Install and set up in 5 minutes",
    href: "/docs",
    icon: <IconRocket size={18} className="text-sky-800" />,
  },
  {
    title: "Domain Setup",
    description: "Configure DNS and MX records",
    href: "/docs/domains",
    icon: <IconWorld size={18} className="text-sky-800" />,
  },
  {
    title: "Integrations",
    description: "Connect Slack, Discord and more",
    href: "/docs/integrations/slack",
    icon: <IconPlug size={18} className="text-sky-800" />,
  },
  {
    title: "Email Aliases",
    description: "Route emails to the right channel",
    href: "/docs/aliases",
    icon: <IconAt size={18} className="text-sky-800" />,
  },
  {
    title: "Ticket Management",
    description: "Claim, reply and resolve tickets",
    href: "/docs/tickets",
    icon: <IconTicket size={18} className="text-sky-800" />,
  },
  {
    title: "Chatbot",
    description: "Embed the live chat widget",
    href: "/docs/chatbot",
    icon: <IconMessageChatbot size={18} className="text-sky-800" />,
  },
]

// ─── Squiggle underline ───────────────────────────────────────────────────────
function SquiggleUnderline({ visible }: { visible: boolean }) {
  const PATH = "M0,4 C5,0 10,8 15,4 C20,0 25,8 30,4 C35,0 40,8 45,4 C50,0 55,8 60,4"
  return (
    <svg
      width="60" height="6" viewBox="0 0 60 6" fill="none"
      className="absolute -bottom-1 left-1/2 -translate-x-1/2"
      aria-hidden
    >
      <motion.path
        d={PATH}
        stroke="#0c4a6e"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
      />
    </svg>
  )
}

// ─── Docs dropdown content ────────────────────────────────────────────────────
function DocsContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-3 grid grid-cols-3 gap-0.5 w-[600px]">
      {DOC_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors duration-150 group"
        >
          <div className="mt-0.5 flex-shrink-0">
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
      ))}
    </div>
  )
}

// ─── Blog dropdown content ────────────────────────────────────────────────────
function BlogContent({ posts, onClose }: { posts: Post[]; onClose: () => void }) {
  return (
    <div className="p-3 w-[380px]">
      {posts.length === 0 ? (
        <div className="py-8 flex items-center justify-center">
          <div className="size-4 rounded-full border-2 border-sky-300 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {posts.slice(0, 6).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              onClick={onClose}
              className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors duration-150 group"
            >
              {/* Thumbnail */}
              {post.coverImage?.url ? (
                <div className="relative size-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                  <Image
                    src={post.coverImage.url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="size-10 rounded-lg bg-sky-50 flex-shrink-0" />
              )}

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-schibsted font-semibold text-sm text-neutral-900 leading-tight line-clamp-1 group-hover:text-sky-800 transition-colors">
                  {post.title}
                </p>
                <p className="font-schibsted text-xs text-neutral-500 mt-0.5 line-clamp-1">
                  {post.brief}
                </p>
                <p className="font-schibsted text-xs text-neutral-400 mt-0.5">
                  {post.readTimeInMinutes} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-2 pt-2 border-t border-neutral-100 px-3">
        <Link
          href="/blog"
          onClick={onClose}
          className="flex items-center gap-1.5 font-schibsted font-semibold text-xs text-sky-800 hover:text-sky-900 transition-colors duration-150"
        >
          View all posts
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}

// ─── Shared morphing dropdown ─────────────────────────────────────────────────
function SharedDropdown({
  active,
  dropdownX,
  onEnter,
  onLeave,
  blogPosts,
  onClose,
}: {
  active: "docs" | "blog" | null
  dropdownX: number
  onEnter: () => void
  onLeave: () => void
  blogPosts: Post[]
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {active && (
        // Position wrapper — slides x under the active trigger
        <motion.div
          style={{ position: "absolute", top: "100%", left: 0, zIndex: 50, pointerEvents: "auto" }}
          initial={{ x: dropdownX }}
          animate={{ x: dropdownX }}
          transition={SPRING}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {/* Size morph wrapper */}
          <motion.div
            layout="size"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{
              opacity: { duration: 0.15, ease: EASE_OUT_QUART },
              scale: { duration: 0.15, ease: EASE_OUT_QUART },
              y: { duration: 0.15, ease: EASE_OUT_QUART },
              layout: SPRING,
            }}
            style={{ translateX: "-50%", marginTop: "12px", transformOrigin: "top center" }}
            className="bg-white rounded-2xl shadow-xl shadow-neutral-900/8 overflow-hidden relative"
          >
            {/* Arrow notch */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 bg-white border-l border-t border-neutral-200/80 rotate-45 z-10" />

            {/* Content crossfade */}
            <AnimatePresence mode="wait">
              {active === "docs" && (
                <motion.div
                  key="docs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <DocsContent onClose={onClose} />
                </motion.div>
              )}
              {active === "blog" && (
                <motion.div
                  key="blog"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <BlogContent posts={blogPosts} onClose={onClose} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Logo mark ────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Logo />
      <span className="font-schibsted text-lg font-medium tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors duration-150">SyncSupport</span>
    </Link>
  )
}

// ─── Nav link with squiggle ───────────────────────────────────────────────────
function NavLink({ item, index, hoveredIndex, onHover, onLeave }: {
  item: NavItem
  index: number
  hoveredIndex: number | null
  onHover: (i: number) => void
  onLeave: () => void
}) {
  const Icon = item.icon
  return (
    <li
      className="relative"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      <Link
        href={item.href}
        className="flex items-center gap-2.5 font-schibsted font-bold text-sm text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-1"
      >
        {Icon && <Icon size={18} className="text-sky-800" />}
        {item.label}
      </Link>
      <SquiggleUnderline visible={hoveredIndex === index} />
    </li>
  )
}

// ─── Gradient pill button ─────────────────────────────────────────────────────
function GradientPillButton({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={href}>
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.97 }}
        className="relative flex items-center overflow-hidden rounded-full bg-gradient-to-b from-sky-900 to-cyan-700 shadow-lg cursor-pointer"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
          animate={hovered ? { backgroundPositionX: ["200%", "-200%"] } : { backgroundPositionX: "200%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
        <span className="relative z-10 font-schibsted font-semibold text-white text-sm uppercase tracking-wide select-none px-6 py-2.5">
          {label}
        </span>
      </motion.button>
    </Link>
  )
}

// ─── User dropdown ────────────────────────────────────────────────────────────
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
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-xl shadow-neutral-900/8 hover:shadow-neutral-900/12 transition-shadow duration-150 cursor-pointer"
        aria-label="User menu"
      >
        <IconUser size={15} className="text-neutral-500" />
        <span className="font-schibsted font-medium text-sm text-neutral-700">{userName}</span>
        <motion.svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_IN_OUT_QUART }}
          className="text-neutral-400"
        >
          <path d="M1 3.5L5 7.5L9 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18, ease: EASE_OUT_QUART }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl shadow-neutral-900/8 py-1 z-50 overflow-hidden"
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
  items = navlinks.map(link => ({ label: link.label, href: link.url, icon: link.icon })),
  initialBlogPosts = [],
}: NavbarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<"docs" | "blog" | null>(null)
  const [dropdownX, setDropdownX] = useState(0)

  const user = useUserStore((state) => state.user)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)
  const docsRef = useRef<HTMLLIElement>(null)
  const blogRef = useRef<HTMLLIElement>(null)

  const updateDropdownX = useCallback((ref: React.RefObject<HTMLLIElement | null>) => {
    const el = ref.current
    const nav = navContainerRef.current
    if (!el || !nav) return
    const elRect = el.getBoundingClientRect()
    const navRect = nav.getBoundingClientRect()
    setDropdownX(elRect.left - navRect.left + elRect.width / 2)
  }, [])

  const openDropdown = useCallback((type: "docs" | "blog", ref: React.RefObject<HTMLLIElement | null>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    updateDropdownX(ref)
    setActiveDropdown(type)
  }, [updateDropdownX])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 100)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

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
        className={`${positionClasses[position]} z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/70`}
      >
        <div className="container mx-auto px-4 py-3">
          <div ref={navContainerRef} className="flex items-center justify-between relative">

            {/* Logo */}
            <LogoMark />

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-7">
              {items.map((item, index) => {
                if (item.label === "Docs") {
                  return (
                    <li
                      key={item.href}
                      ref={docsRef}
                      className="relative"
                      onMouseEnter={() => openDropdown("docs", docsRef)}
                      onMouseLeave={scheduleClose}
                    >
                      <Link
                        href="/docs"
                        className="font-schibsted font-bold text-sm text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-1 flex items-center gap-2.5"
                      >
                        <IconBook2 size={18} className="text-sky-800" />
                        Docs
                        <motion.svg
                          width="10" height="10" viewBox="0 0 10 10" fill="none"
                          animate={{ rotate: activeDropdown === "docs" ? 180 : 0 }}
                          transition={{ duration: 0.2, ease: EASE_IN_OUT_QUART }}
                          className="text-sky-800"
                        >
                          <path d="M1 3.5L5 7.5L9 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </motion.svg>
                      </Link>
                      <SquiggleUnderline visible={activeDropdown === "docs"} />
                    </li>
                  )
                }

                if (item.label === "Blog") {
                  const Icon = item.icon
                  return (
                    <li
                      key={item.href}
                      ref={blogRef}
                      className="relative"
                      onMouseEnter={() => openDropdown("blog", blogRef)}
                      onMouseLeave={scheduleClose}
                    >
                      <Link
                        href="/blog"
                        className="font-schibsted font-bold text-sm text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-1 flex items-center gap-2.5"
                      >
                        {Icon && <Icon size={18} className="text-sky-800" />}
                        Blog
                        <motion.svg
                          width="10" height="10" viewBox="0 0 10 10" fill="none"
                          animate={{ rotate: activeDropdown === "blog" ? 180 : 0 }}
                          transition={{ duration: 0.2, ease: EASE_IN_OUT_QUART }}
                          className="text-sky-800"
                        >
                          <path d="M1 3.5L5 7.5L9 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </motion.svg>
                      </Link>
                      <SquiggleUnderline visible={activeDropdown === "blog"} />
                    </li>
                  )
                }

                return (
                  <NavLink
                    key={item.href}
                    item={item}
                    index={index}
                    hoveredIndex={hoveredIndex}
                    onHover={setHoveredIndex}
                    onLeave={() => setHoveredIndex(null)}
                  />
                )
              })}
            </ul>

            {/* Shared morphing dropdown — rendered inside the relative container */}
            <SharedDropdown
              active={activeDropdown}
              dropdownX={dropdownX}
              onEnter={cancelClose}
              onLeave={scheduleClose}
              blogPosts={initialBlogPosts}
              onClose={() => setActiveDropdown(null)}
            />

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-3">
              {user !== null ? (
                <>
                  <UserMenu userName={user.name ?? ""} />
                  <GradientPillButton href="/dashboard" label="Dashboard" />
                </>
              ) : (
                <GradientPillButton href="/sign-in" label="Sign In" />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT_CUBIC }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white border-l border-neutral-200 z-50 md:hidden flex flex-col"
            >
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

              <nav className="flex-1 px-4 py-5 overflow-y-auto">
                <ul className="flex flex-col gap-1">
                  {items.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.28, delay: index * 0.05, ease: EASE_OUT_CUBIC }}
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

              <div className="px-4 pb-6 pt-2 border-t border-neutral-100 flex flex-col gap-3">
                {user !== null ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2, ease: EASE_OUT_QUART }}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="size-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-sky-800 font-schibsted">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-schibsted font-medium text-sm text-neutral-900">{user.name}</span>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-3 rounded-xl bg-gradient-to-b from-sky-900 to-cyan-700 font-schibsted font-semibold text-sm text-white transition-opacity hover:opacity-90 active:scale-[0.98]">
                        Dashboard
                      </button>
                    </Link>
                  </motion.div>
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

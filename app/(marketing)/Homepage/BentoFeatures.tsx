"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useAnimate, useInView } from "motion/react";
import {
  IconAt,
  IconArrowUp,
  IconMail,
  IconWorld,
  IconSend,
  IconInbox,
  IconRoute,
} from "@tabler/icons-react";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

// ─── Flat rate pricing chart ──────────────────────────────────────────────────
// Delays are timed so each node activates as the line arrives at its x position.
// Line spans x=16→384 (368px) over 1.6s — fraction * 1.6 gives arrival time.
const FLAT_Y = 108;
const PRICE_POINTS = [
  { x: 68, label: "3 seats", lineDelay: 0.22 },
  { x: 160, label: "5 seats", lineDelay: 0.63 },
  { x: 256, label: "8 seats", lineDelay: 1.04 },
  { x: 340, label: "10 seats", lineDelay: 1.41 },
] as const;

// Rising "others" curve — same origin as flat line, curves up as seats grow
const RISING_PATH = "M 16 108 C 80 88, 200 52, 384 18";
const RISING_FILL = `${RISING_PATH} L 384 108 L 16 108 Z`;

function PricingChart() {
  return (
    <div
      className="w-full overflow-hidden flex items-center"
      style={{ height: 240 }}
    >
      <svg viewBox="0 0 400 156" className="w-full" aria-hidden>
        <defs>
          <linearGradient id="risingFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Diverging gap fill — renders first so flat line sits on top */}
        <motion.path
          d={RISING_FILL}
          fill="url(#risingFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.5 }}
        />

        {/* Rising "Others" curve — dashed orange, draws alongside flat line */}
        <motion.path
          d={RISING_PATH}
          stroke="#f97316"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* "others →" label at the rising line's endpoint */}
        <motion.text
          x={352}
          y={14}
          fontSize="8"
          fontFamily="ui-monospace, monospace"
          fill="#f97316"
          fontWeight="600"
          opacity="0.75"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.75 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.2, delay: 1.35 }}
        >
          others
        </motion.text>

        {/* Flat price line — draws left to right, renders above rising curve */}
        <motion.path
          d={`M 16 ${FLAT_Y} L 384 ${FLAT_Y}`}
          stroke="#0ea5e9"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {PRICE_POINTS.map((pt, i) => (
          <g key={i}>
            {/* Concentric node — outer ring draws as line arrives, inner dot pops after */}
            <g transform={`translate(${pt.x}, ${FLAT_Y})`}>
              {/* Outer ring — draws clockwise via pathLength */}
              <motion.circle
                cx={0}
                cy={0}
                r={10}
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.65 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  pathLength: {
                    duration: 0.4,
                    delay: pt.lineDelay,
                    ease: "easeOut",
                  },
                  opacity: { duration: 0.05, delay: pt.lineDelay },
                }}
              />
              {/* Inner filled dot — spring-pops after ring starts */}
              <motion.g
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 16,
                  delay: pt.lineDelay + 0.28,
                }}
              >
                <circle cx={0} cy={0} r={4.5} fill="#0ea5e9" />
              </motion.g>
            </g>

            {/* Dashed tick rising from node up to label — slightly low opacity */}
            <motion.path
              d={`M ${pt.x} ${FLAT_Y - 12} L ${pt.x} 50`}
              stroke="#0ea5e9"
              strokeWidth="1"
              strokeDasharray="3 3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.2 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                pathLength: {
                  duration: 0.3,
                  delay: pt.lineDelay + 0.38,
                  ease: "easeOut",
                },
                opacity: { duration: 0.05, delay: pt.lineDelay + 0.38 },
              }}
            />

            {/* Seat count pill — fades in after tick finishes */}
            <motion.g
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.2,
                delay: pt.lineDelay + 0.6,
                ease: "easeOut",
              }}
            >
              <rect
                x={pt.x - 26}
                y={28}
                width={52}
                height={18}
                rx={9}
                fill="#e0f2fe"
                stroke="#7dd3fc"
                strokeWidth="0.75"
              />
              <text
                x={pt.x}
                y={41}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-monospace, monospace"
                fill="#0369a1"
                fontWeight="600"
              >
                {pt.label}
              </text>
            </motion.g>
          </g>
        ))}

        {/* "FLAT RATE" badge — appears last */}
        <motion.g
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.25, delay: 1.55, ease: "easeOut" }}
        >
          <rect x={290} y={118} width={84} height={22} rx={11} fill="#0c4a6e" />
          <text
            x={332}
            y={133}
            textAnchor="middle"
            fontSize="8.5"
            fontFamily="ui-monospace, monospace"
            fill="white"
            fontWeight="700"
            letterSpacing="1"
          >
            syncsupport
          </text>
        </motion.g>

        {/* Subtle axis label */}
        {/* <motion.text
          x={18}
          y={FLAT_Y - 10}
          fontSize="8"
          fontFamily="ui-monospace, monospace"
          fill="#94a3b8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.3, delay: 1.5 }}
        >
          same price
        </motion.text> */}
      </svg>
    </div>
  );
}

// ─── Shared empty placeholder for cards without illustration yet ───────────────
function IllustrationPlaceholder() {
  return <div className="w-full h-60 bg-neutral-50" />;
}

// ─── Card 2 — file routing illustration ──────────────────────────────────────
function FileIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  const HUB_X = 150, HUB_Y = 78;
  const FILE_X = 212, FILE_W = 64, FILE_H = 36, FOLD = 8;

  const files = [
    { y: 15,  label: "PDF", color: "#ef4444" },
    { y: 60,  label: "PNG", color: "#0ea5e9" },
    { y: 105, label: "DOC", color: "#3b82f6" },
  ];

  const P = {
    srcHub: "M 62 78 H 130",
    hubTop: "M 170 72 C 192 72 192 33 212 33",
    hubMid: "M 170 78 H 212",
    hubBtm: "M 170 84 C 192 84 192 123 212 123",
  };

  const beams = [
    { d: P.srcHub, delay: 0,   dur: 1.5 },
    { d: P.hubTop, delay: 0.5, dur: 1.7 },
    { d: P.hubMid, delay: 0.9, dur: 1.3 },
    { d: P.hubBtm, delay: 1.3, dur: 1.7 },
  ];

  const cardPath = (y: number) =>
    `M ${FILE_X} ${y} L ${FILE_X+FILE_W-FOLD} ${y} L ${FILE_X+FILE_W} ${y+FOLD} L ${FILE_X+FILE_W} ${y+FILE_H} L ${FILE_X} ${y+FILE_H} Z`;
  const foldPath = (y: number) =>
    `M ${FILE_X+FILE_W-FOLD} ${y} L ${FILE_X+FILE_W-FOLD} ${y+FOLD} L ${FILE_X+FILE_W} ${y+FOLD} Z`;

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden flex items-center bg-white"
      style={{ height: 240 }}
    >
      <svg viewBox="0 0 300 156" className="w-full" aria-hidden>

        {/* ── Static reference lines ── */}
        {Object.values(P).map((d, i) => (
          <motion.path
            key={i} d={d}
            stroke="#e2e8f0" strokeWidth="1" fill="none" strokeLinecap="round"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
        ))}

        {/* ── Animated beams travelling left → right ── */}
        {beams.map((b, i) => (
          <motion.path
            key={i} d={b.d}
            stroke="#0ea5e9" strokeWidth="1.5"
            strokeDasharray="36 400" fill="none" strokeLinecap="round"
            animate={isInView ? { strokeDashoffset: [400, -36] } : {}}
            transition={{
              duration: b.dur, repeat: Infinity, ease: "linear",
              delay: b.delay, repeatDelay: 0.2,
            }}
          />
        ))}

        {/* ── Source card — email + chat icons ── */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <rect x={4} y={46} width={58} height={64} rx={8}
            fill="white" stroke="#e2e8f0" strokeWidth="1" />
          {/* Envelope */}
          <rect x={12} y={56} width={40} height={26} rx={2.5}
            fill="none" stroke="#94a3b8" strokeWidth={1.2} />
          <path d="M 12 56 L 32 68 L 52 56"
            stroke="#94a3b8" strokeWidth={1.2} fill="none" strokeLinejoin="round" />
          {/* Chat bubble */}
          <path d="M 13 88 H 50 Q 52 88 52 90 V 98 Q 52 100 50 100 H 28 L 24 104 V 100 H 13 Q 11 100 11 98 V 90 Q 11 88 13 88 Z"
            fill="none" stroke="#94a3b8" strokeWidth={1.2} strokeLinejoin="round" />
        </motion.g>

        {/* ── Hub — dark routing node ── */}
        <g transform={`translate(${HUB_X}, ${HUB_Y})`}>
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.2 }}
          >
            <rect x={-20} y={-20} width={40} height={40} rx={10} fill="#0c4a6e" />
            <path
              d="M -7 -4 H 4 M 1 -7 L 5 -4 L 1 -1 M -7 4 H 4 M 1 1 L 5 4 L 1 7"
              stroke="white" strokeWidth={1.4} strokeLinecap="round"
              strokeLinejoin="round" fill="none"
            />
          </motion.g>
        </g>

        {/* ── File cards with folded corners ── */}
        {files.map((f, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.1, ease: "easeOut" }}
          >
            <path d={cardPath(f.y)} fill="white" stroke="#e2e8f0" strokeWidth="1" />
            <path d={foldPath(f.y)} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.75" />
            <rect x={FILE_X+6} y={f.y+8}  width={FILE_W-22} height={2} rx={1} fill="#e2e8f0" />
            <rect x={FILE_X+6} y={f.y+13} width={FILE_W-30} height={2} rx={1} fill="#e2e8f0" />
            <rect x={FILE_X+6} y={f.y+18} width={FILE_W-26} height={2} rx={1} fill="#e2e8f0" />
            <rect x={FILE_X+6} y={f.y+26} width={16}         height={2} rx={1} fill="#e2e8f0" />
            <rect x={FILE_X+FILE_W-4} y={f.y+FILE_H-16} width={26} height={13} rx={3} fill={f.color} />
            <text
              x={FILE_X+FILE_W+9} y={f.y+FILE_H-6}
              textAnchor="middle" fontSize="7" fontFamily="ui-monospace, monospace"
              fill="white" fontWeight="700"
            >
              {f.label}
            </text>
          </motion.g>
        ))}

      </svg>
    </div>
  );
}

// ─── Card 3 — ticket stack illustration ──────────────────────────────────────
const TICKETS = [
  {
    description:
      "Can't log in after password reset, keeps showing invalid credentials.",
    tag: "login-issue",
    tagClass: "bg-orange-50 text-orange-600 border border-orange-200",
    x: -82,
    y: -28,
    rotate: -10,
    delay: 0.04,
    z: 1,
  },
  {
    description:
      "Need invoice for last month's payment, urgent for tax filing.",
    tag: "billing-issue",
    tagClass: "bg-sky-50 text-sky-700 border border-sky-200",
    x: 80,
    y: -34,
    rotate: 12,
    delay: 0.12,
    z: 2,
  },
  {
    description:
      "Account locked after multiple failed attempts, need immediate access.",
    tag: "login-issue",
    tagClass: "bg-orange-50 text-orange-600 border border-orange-200",
    x: -78,
    y: 32,
    rotate: -6,
    delay: 0.2,
    z: 3,
  },
  {
    description:
      "Confused about team seat pricing for more than 5 members plan.",
    tag: "pricing-issue",
    tagClass: "bg-violet-50 text-violet-700 border border-violet-200",
    x: 76,
    y: 36,
    rotate: 9,
    delay: 0.28,
    z: 4,
  },
  {
    description:
      "How do I switch to an annual plan and get the discount applied?",
    tag: "pricing-issue",
    tagClass: "bg-violet-50 text-violet-700 border border-violet-200",
    x: 2,
    y: -2,
    rotate: -2,
    delay: 0.36,
    z: 5,
  },
];

function TicketStackIllustration() {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden bg-neutral-50"
      style={{ height: 240 }}
    >
      {TICKETS.map((ticket, i) => (
        <motion.div
          key={i}
          className="absolute w-40 rounded-xl bg-white border border-neutral-200 shadow-md p-2.5 flex flex-col gap-1.5"
          style={{
            left: "50%",
            top: "50%",
            marginLeft: -80,
            marginTop: -36,
            zIndex: ticket.z,
          }}
          initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 0 }}
          whileInView={{
            scale: 1,
            x: ticket.x,
            y: ticket.y,
            rotate: ticket.rotate,
            opacity: 1,
          }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: ticket.delay,
            opacity: { duration: 0.15, delay: ticket.delay },
          }}
        >
          {/* AI tag */}
          <span
            className={`self-start inline-flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${ticket.tagClass}`}
          >
            <span className="w-1 h-1 rounded-full bg-current opacity-70" />
            {ticket.tag}
          </span>

          {/* Ticket description */}
          <p className="font-schibsted text-[10px] leading-tight text-neutral-600 line-clamp-2">
            {ticket.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Card 4 — domain grid illustration ───────────────────────────────────────
const CELL = 52;
const GRID = CELL * 3; // 156px
const CX = GRID / 2; // 78 — grid center x
const CY = GRID / 2; // 78 — grid center y

const DOMAIN_ICONS = [
  {
    col: 1,
    row: 0,
    Icon: IconMail,
    color: "text-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
    delay: 0.5,
  },
  {
    col: 2,
    row: 0,
    Icon: IconWorld,
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    delay: 0.62,
  },
  {
    col: 0,
    row: 1,
    Icon: IconAt,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    delay: 0.74,
  },
  {
    col: 2,
    row: 1,
    Icon: IconSend,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    delay: 0.86,
  },
  {
    col: 0,
    row: 2,
    Icon: IconInbox,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    delay: 0.98,
  },
  {
    col: 1,
    row: 2,
    Icon: IconRoute,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    delay: 1.1,
  },
] as const;

function DomainGridIllustration() {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden bg-white"
      style={{ height: 240 }}
    >
      <div className="relative" style={{ width: GRID, height: GRID }}>
        {/* SVG layer — grid lines + connection lines */}
        <svg
          className="absolute inset-0"
          width={GRID}
          height={GRID}
          style={{ overflow: "visible" }}
        >
          {/* Grid lines fade in first */}
          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            {[0, 1, 2, 3].map((n) => (
              <g key={n}>
                <line
                  x1={0}
                  y1={n * CELL}
                  x2={GRID}
                  y2={n * CELL}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <line
                  x1={n * CELL}
                  y1={0}
                  x2={n * CELL}
                  y2={GRID}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              </g>
            ))}
          </motion.g>

          {/* Connection lines draw from icon → center */}
          {DOMAIN_ICONS.map((item, i) => {
            const fromX = item.col * CELL + CELL / 2;
            const fromY = item.row * CELL + CELL / 2;
            return (
              <motion.path
                key={i}
                d={`M ${fromX} ${fromY} L ${CX} ${CY}`}
                stroke="#94a3b8"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  pathLength: {
                    duration: 0.4,
                    delay: item.delay + 0.2,
                    ease: "easeOut",
                  },
                  opacity: { duration: 0.1, delay: item.delay + 0.2 },
                }}
              />
            );
          })}
        </svg>

        {/* Center hub icon */}
        <motion.div
          className="absolute flex items-center justify-center w-11 h-11 rounded-[14px] bg-neutral-900 shadow-xl"
          style={{ left: CX, top: CY, transform: "translate(-50%, -50%)" }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.28,
          }}
        >
          <IconWorld size={20} className="text-white" />

          {/* Notification badge */}
          <motion.span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-500 border-2 border-white"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 14,
              delay: 1.5,
            }}
          />
        </motion.div>

        {/* Surrounding icon nodes */}
        {DOMAIN_ICONS.map((item, i) => {
          const cx = item.col * CELL + CELL / 2;
          const cy = item.row * CELL + CELL / 2;
          return (
            <motion.div
              key={i}
              className={`absolute flex items-center justify-center w-9 h-9 rounded-full border ${item.bg} ${item.border} shadow-sm`}
              style={{ left: cx, top: cy, transform: "translate(-50%, -50%)" }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 18,
                delay: item.delay,
                opacity: { duration: 0.15, delay: item.delay },
              }}
            >
              <item.Icon size={15} className={item.color} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Card content data ────────────────────────────────────────────────────────
const CARDS = [
  {
    label: "01",
    title: "Flat Rate Pricing",
    description:
      "One price, unlimited team members. Add your entire support team without worrying about per-seat costs",
    cta: { label: "See Pricing", href: "/pricing" },
    illustration: <PricingChart />,
  },
  {
    label: "02",
    title: "File & Attachment Support",
    description:
      "Customers can send files, screenshots, and documents through email or chat — your team receives everything directly in Slack, no inbox required.",
    cta: { label: "View Docs", href: "/docs" },
    illustration: <FileIllustration />,
  },
  {
    label: "03",
    title: "Ticket Status & AI Tags",
    description:
      "Every inbound email is automatically tagged by topic, categorized by urgency. ",
    cta: { label: "View Docs", href: "/docs" },
    illustration: <TicketStackIllustration />,
  },
  {
    label: "04",
    title: "Multi Domain & Multi Alias",
    description: "Run multiple products or brands from one workspace.",
    cta: { label: "View Docs", href: "/docs/domains" },
    illustration: <DomainGridIllustration />,
  },
];

const FEATURED = {
  eyebrow: "Daily Digest",
  title: "Never miss a critical escalation.",
  description:
    "SyncSupport sends the owner a daily report every morning — open tickets, response times, and escalation flags — so you always know what needs attention before customers feel the delay.",
  primaryCta: { label: "Get Started Free", href: "/sign-up" },
  secondaryCta: { label: "Read the Docs", href: "/docs" },
};

// ─── Reusable small card ──────────────────────────────────────────────────────
function BentoCard({ card }: { card: (typeof CARDS)[number] }) {
  return (
    <div className="flex flex-col">
      {/* Illustration */}
      <div className="border-b border-neutral-200">{card.illustration}</div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-7 flex-1">
        <span className="font-mono text-xs font-normal tracking-widest text-sky-900 uppercase">
          {card.label}
        </span>
        <Heading
          as="h3"
          variant="muted"
          className="text-sky-800 leading-snug"
        >
          {card.title}
        </Heading>
        <Paragraph variant="home-par" className="flex-1">
          {card.description}
        </Paragraph>
      </div>

      {/* Docs bar */}
      <Link
        href={card.cta.href}
        className="group flex items-center justify-between border-t border-neutral-200 px-7 py-4 hover:bg-neutral-50 transition-colors duration-150"
      >
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-900 transition-colors duration-150">
          {card.cta.label}
        </span>
        <div className="relative flex items-center justify-center w-5 h-5">
          <span className="absolute inset-0 rounded-full bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-all duration-150 ease-out" />
          <IconArrowUp
            size={14}
            stroke={2}
            className="relative text-neutral-400 group-hover:text-neutral-900 rotate-90 group-hover:rotate-45 transition-transform duration-100 ease-out"
          />
        </div>
      </Link>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function BentoFeatures() {
  return (
    <div
      className={[
        "relative grid w-full",
        "grid-cols-[1fr_0.75rem_auto_0.75rem_1fr] md:grid-cols-[1fr_2.5rem_auto_2.5rem_1fr]",
        "grid-rows-[1fr_1px_auto_1px_1fr]",
        "bg-white",
        "[--pattern-fg:theme(colors.gray.950/5%)]",
      ].join(" ")}
    >
      {/* ── Left hatched column ─────────────────────────────────────────── */}
      <div
        className={[
          "col-start-2 row-span-full row-start-1",
          "relative -right-px",
          "border-x border-x-(--pattern-fg)",
          "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        ].join(" ")}
      />

      {/* ── Right hatched column ────────────────────────────────────────── */}
      <div
        className={[
          "col-start-4 row-span-full row-start-1",
          "relative -left-px",
          "border-x border-x-(--pattern-fg)",
          "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        ].join(" ")}
      />

      {/* ── Top 1px rule ────────────────────────────────────────────────── */}
      <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-(--pattern-fg)" />

      {/* ── Bottom 1px rule ─────────────────────────────────────────────── */}
      <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-(--pattern-fg)" />

      {/* ── Content card (col 3, row 3) ─────────────────────────────────── */}
      <section className="col-start-3 row-start-3 w-full py-8 md:py-20 lg:py-1">
        <Container className="px-4 md:px-0">
          {/* Section header */}
          <div className="mb-2">
            <p className="font-schibsted text-sm md:text-xs font-semibold uppercase tracking-widest text-sky-800 px-4 pt-4 text-left">
              Everything you need
            </p>
            <motion.div
              className="mb-8 "
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
              }}
            >
              <Heading
                as="h2"
                className="text-neutral-900 font-schibsted leading-tight p-4"
              >
                <span>Built for SMBs, solodevs, soloentrepreneurs </span>
                <span className="text-sky-800 font-extralight">
                  {" "}
                  fast setup, no per-seat fees, and all the features you need
                </span>
              </Heading>
            </motion.div>
          </div>

          {/* Bento grid */}
          <div className="border border-neutral-200 overflow-hidden">
            {/* Row 1 — 3 equal cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200 border-b border-neutral-200">
              {CARDS.slice(0, 3).map((card) => (
                <BentoCard key={card.label} card={card} />
              ))}
            </div>

            {/* Row 2 — narrow card + wide featured card */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
              {/* Card 4 */}
              <BentoCard card={CARDS[3]} />

              {/* Card 5 — featured, spans 2 cols */}
              <div className="md:col-span-2 relative overflow-hidden flex flex-col justify-end bg-gradient-to-b from-[#A8D3FF] to-[#FFF4DF]">
                {/* Grain filter */}
                <svg className="absolute w-0 h-0" aria-hidden="true">
                  <filter id="bentoGrain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                  </filter>
                </svg>
                {/* Grain overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "#8C8C8C", filter: "url(#bentoGrain)", opacity: 0.9 }}
                />

                {/* White content card floating at bottom of gradient */}
                <div className="relative z-10 m-4">
                  <div className="bg-white border border-neutral-200 p-7 flex flex-col gap-4">
                    <span className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-700">
                      {FEATURED.eyebrow}
                    </span>
                    <Heading
                      as="h3"
                      className="text-neutral-900 leading-snug font-semibold"
                    >
                      {FEATURED.title}
                    </Heading>
                    <Paragraph variant="home-par">
                      {FEATURED.description}
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

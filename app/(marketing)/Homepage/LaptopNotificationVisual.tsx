"use client";

import { motion, useAnimation, AnimatePresence } from "motion/react";
import React, { useEffect, useState, useRef } from "react";

const EASING = {
  outQuint: [0.23, 1, 0.32, 1] as const,
  outCubic: [0.215, 0.61, 0.355, 1] as const,
  outQuart: [0.165, 0.84, 0.44, 1] as const,
  outExpo:  [0.19, 1, 0.22, 1] as const,
};

type Phase = "idle" | "claiming" | "replying" | "resolved";

const CHANNELS = [
  { name: "general",       unread: false },
  { name: "billing",       unread: true  },
  { name: "support",       unread: true  },
  { name: "sales",         unread: false },
  { name: "onboarding",    unread: false },
  { name: "dev-bugs",      unread: false },
  { name: "announcements", unread: false },
  { name: "random",        unread: false },
];

const MESSAGES = [
  { initials: "S", color: "#0ea5e9", name: "Sarah", time: "2m",  text: "Payment failed on checkout — need help ASAP", isAgent: false },
  { initials: "A", color: "#7c3aed", name: "Alex",  time: "1m",  text: "Looking into this now, share your order ID?",  isAgent: true  },
  { initials: "S", color: "#0ea5e9", name: "Sarah", time: "30s", text: "Sure, it's #ORD-4821",                         isAgent: false },
];

// ─── Slack Screen ─────────────────────────────────────────────────────────────

const SlackScreen = ({
  controls,
  phase,
}: {
  controls: ReturnType<typeof useAnimation>;
  phase: Phase;
}) => {
  const resolved = phase === "resolved";
  const claiming = phase === "claiming" || phase === "replying" || resolved;
  const replying = phase === "replying" || resolved;

  return (
    <motion.div
      animate={controls}
      variants={{
        screenOff: { opacity: 0 },
        screenOn:  { opacity: 1, transition: { duration: 0.3, ease: EASING.outCubic } },
        lidClosed: { opacity: 0, transition: { duration: 0.15 } },
      }}
      initial="screenOff"
      className="absolute inset-0 flex"
      style={{ background: "#1a1d21", borderRadius: 5, overflow: "hidden" }}
    >
      {/* ── Left Sidebar ── */}
      <div
        className="flex flex-col shrink-0"
        style={{ width: 52, background: "#3f0e40", borderRight: "0.5px solid rgba(255,255,255,0.08)" }}
      >
        {/* Workspace label */}
        <div className="px-2 pt-2 pb-1.5" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              <span style={{ fontSize: 4.5, fontWeight: 800, color: "white", fontFamily: "sans-serif" }}>S</span>
            </div>
            <span style={{ fontSize: 5, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: "sans-serif", letterSpacing: 0.2 }}>
              SyncSupport
            </span>
          </div>
        </div>

        {/* Channel list */}
        <div className="flex flex-col pt-1.5 px-1 gap-px">
          {CHANNELS.map((ch, i) => (
            <motion.div
              key={ch.name}
              animate={controls}
              variants={{
                channelsHidden: { opacity: 0, x: -4 },
                channelsIn: {
                  opacity: 1, x: 0,
                  transition: { duration: 0.3, ease: EASING.outCubic, delay: i * 0.035 },
                },
                screenOff: { opacity: 0 },
                lidClosed: { opacity: 0 },
              }}
              initial="channelsHidden"
              className="flex items-center justify-between rounded-sm px-1"
              style={{
                height: 10,
                background: ch.name === "billing" ? "rgba(255,255,255,0.15)" : "transparent",
              }}
            >
              <span style={{
                fontSize: 5,
                fontFamily: "sans-serif",
                color: ch.unread && !resolved ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
                fontWeight: ch.unread && !resolved ? 600 : 400,
                overflow: "hidden",
                whiteSpace: "nowrap",
                maxWidth: 36,
              }}>
                # {ch.name}
              </span>
              {ch.unread && (
                <motion.div
                  className="rounded-full shrink-0"
                  style={{ width: 4, height: 4, background: resolved ? "#34d399" : "#e8912d" }}
                  animate={resolved
                    ? { opacity: 0, scale: 0 }
                    : { opacity: [1, 0.35, 1] }
                  }
                  transition={resolved
                    ? { duration: 0.4, ease: EASING.outCubic }
                    : { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: ch.name === "support" ? 0.6 : 0 }
                  }
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Channel header */}
        <div
          className="flex items-center gap-1 px-2 shrink-0"
          style={{ height: 16, borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <span style={{ fontSize: 5.5, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontFamily: "sans-serif" }}>
            # billing
          </span>
          <span style={{ fontSize: 4.5, color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif", marginLeft: 2 }}>
            4 members
          </span>
        </div>

        {/* Messages */}
        <div className="flex flex-col flex-1 px-2 pt-1.5 gap-1.5 overflow-hidden">
          {MESSAGES.map((msg, i) => (
            <motion.div
              key={i}
              animate={controls}
              variants={{
                threadHidden: { opacity: 0, y: 4 },
                threadIn: {
                  opacity: 1, y: 0,
                  transition: { duration: 0.35, ease: EASING.outCubic, delay: i * 0.1 },
                },
                screenOff: { opacity: 0 },
                lidClosed: { opacity: 0 },
              }}
              initial="threadHidden"
              className="flex items-start gap-1"
            >
              <div
                className="rounded-sm shrink-0 flex items-center justify-center"
                style={{ width: 9, height: 9, background: msg.color, marginTop: 0.5 }}
              >
                <span style={{ fontSize: 4.5, fontWeight: 700, color: "white", fontFamily: "sans-serif" }}>
                  {msg.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1 mb-px">
                  <span style={{ fontSize: 5, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontFamily: "sans-serif" }}>
                    {msg.name}
                  </span>
                  {msg.isAgent && (
                    <span style={{ fontSize: 4, background: "#0ea5e9", color: "white", borderRadius: 2, padding: "0 2px", fontFamily: "sans-serif", fontWeight: 600 }}>
                      Agent
                    </span>
                  )}
                  <span style={{ fontSize: 4.5, color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                    {msg.time}
                  </span>
                </div>
                <div style={{
                  fontSize: 5,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "sans-serif",
                  lineHeight: 1.35,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Action bar ── */}
        <motion.div
          animate={controls}
          variants={{
            actionsHidden: { opacity: 0, y: 4 },
            actionsIn:     { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASING.outQuart } },
            screenOff:     { opacity: 0 },
            lidClosed:     { opacity: 0 },
          }}
          initial="actionsHidden"
          className="flex items-center gap-1 px-2 pb-2 pt-1 shrink-0"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          {/* Status pill — transitions Open → Resolved */}
          <AnimatePresence mode="wait">
            {resolved ? (
              <motion.div
                key="resolved"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: EASING.outCubic }}
                className="flex items-center gap-0.5 rounded-sm px-1.5"
                style={{ height: 9, background: "rgba(52,211,153,0.18)", border: "0.5px solid rgba(52,211,153,0.5)" }}
              >
                <span style={{ fontSize: 5, color: "#34d399", fontFamily: "sans-serif" }}>✓</span>
                <span style={{ fontSize: 4.5, color: "#34d399", fontFamily: "sans-serif", fontWeight: 600 }}>Resolved</span>
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-0.5 rounded-sm px-1.5"
                style={{ height: 9, background: "rgba(14,165,233,0.18)", border: "0.5px solid rgba(14,165,233,0.4)" }}
              >
                <motion.div
                  className="rounded-full shrink-0"
                  style={{ width: 3, height: 3, background: "#0ea5e9" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <span style={{ fontSize: 4.5, color: "#38bdf8", fontFamily: "sans-serif", fontWeight: 600 }}>Open ▾</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Claim button */}
          <motion.div
            className="flex items-center rounded-sm px-1.5"
            animate={claiming
              ? { background: "rgba(124,58,237,0.35)", borderColor: "rgba(124,58,237,0.6)" }
              : { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }
            }
            transition={{ duration: 0.3 }}
            style={{ height: 9, border: "0.5px solid rgba(255,255,255,0.15)" }}
          >
            <AnimatePresence mode="wait">
              {claiming ? (
                <motion.span
                  key="claimed"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 4.5, color: "#c4b5fd", fontFamily: "sans-serif", fontWeight: 600 }}
                >
                  Claimed ✓
                </motion.span>
              ) : (
                <motion.span
                  key="claim"
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                  style={{ fontSize: 4.5, color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif", fontWeight: 500 }}
                >
                  Claim
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Reply button */}
          <motion.div
            className="flex items-center rounded-sm px-1.5 ml-auto"
            animate={replying
              ? { scale: [1, 1.12, 1], background: "#059669" }
              : { scale: 1, background: "#0ea5e9" }
            }
            transition={{ duration: 0.35, ease: EASING.outCubic }}
            style={{ height: 9 }}
          >
            <AnimatePresence mode="wait">
              {replying ? (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 4.5, color: "white", fontFamily: "sans-serif", fontWeight: 600 }}
                >
                  Sent ✓
                </motion.span>
              ) : (
                <motion.span
                  key="reply"
                  exit={{ opacity: 0 }}
                  style={{ fontSize: 4.5, color: "white", fontFamily: "sans-serif", fontWeight: 600 }}
                >
                  Reply ↵
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const LaptopNotificationVisual = ({ isHovered }: { isHovered: boolean }) => {
  const controls = useAnimation();
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    if (isHovered) {
      setPhase("idle");
      const openSequence = async () => {
        await controls.start("lidOpen");
        await controls.start("screenOn");
        await controls.start("channelsIn");
        await controls.start("threadIn");
        await controls.start("actionsIn");

        // Interactive sequence kicks in after content is fully visible
        timers.current.push(setTimeout(() => setPhase("claiming"), 600));
        timers.current.push(setTimeout(() => setPhase("replying"), 1400));
        timers.current.push(setTimeout(() => setPhase("resolved"), 2200));
      };
      openSequence();
    } else {
      clearTimers();
      setPhase("idle");
      controls.start("lidClosed");
    }

    return () => clearTimers();
  }, [isHovered, controls]);

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ perspective: 900 }}
    >
      <div className="relative flex flex-col items-center w-full">

        {/* ── Laptop Lid ── */}
        <motion.div
          animate={controls}
          variants={{
            lidClosed: { rotateX: 78, transition: { duration: 0.45, ease: EASING.outCubic } },
            lidOpen:   { rotateX: 0,  transition: { duration: 0.7,  ease: EASING.outQuint } },
          }}
          initial="lidClosed"
          className="w-full"
          style={{
            aspectRatio: "16 / 10",
            transformOrigin: "bottom center",
            transformStyle: "preserve-3d",
            borderRadius: "8px 8px 0 0",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Lid shell */}
          <div
            className="absolute inset-0 rounded-t-lg"
            style={{
              background: "linear-gradient(160deg, #d1d5db 0%, #9ca3af 100%)",
              border: "1px solid #9ca3af",
              borderBottom: "none",
            }}
          />

          {/* Screen bezel */}
          <div
            className="absolute"
            style={{ inset: "6px 8px 4px 8px", background: "#111827", borderRadius: 5, overflow: "hidden" }}
          >
            <SlackScreen controls={controls} phase={phase} />
          </div>
        </motion.div>

        {/* ── Base ── */}
        <div
          style={{
            width: "calc(100% + 10px)",
            height: 10,
            background: "linear-gradient(180deg, #b0b7c3 0%, #9ca3af 100%)",
            borderRadius: "0 0 8px 8px",
            border: "1px solid #9ca3af",
            borderTop: "1px solid #d1d5db",
            position: "relative",
            zIndex: 3,
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-sm"
            style={{ width: 28, height: 5, background: "rgba(255,255,255,0.25)", border: "0.5px solid rgba(255,255,255,0.4)" }}
          />
        </div>

        {/* Shadow */}
        <div
          style={{
            width: "88%",
            height: 6,
            background: "radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)",
            marginTop: 2,
          }}
        />
      </div>
    </div>
  );
};

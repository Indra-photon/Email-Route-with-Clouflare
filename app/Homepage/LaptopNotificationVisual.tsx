"use client";

import { motion, useAnimation, useInView } from "motion/react";
import React, { useEffect, useRef } from "react";

const EASING = {
  outQuint: [0.23, 1, 0.32, 1] as const,
  outCubic: [0.215, 0.61, 0.355, 1] as const,
  outQuart: [0.165, 0.84, 0.44, 1] as const,
  outExpo: [0.19, 1, 0.22, 1] as const,
};

export const LaptopNotificationVisual = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const controls = useAnimation();

  useEffect(() => {
    if (!isInView) return;
    const sequence = async () => {
      await controls.start("lidOpen");
      await controls.start("screenOn");
      await controls.start("notifIn");
      await controls.start("replyIn");
    };
    sequence();
  }, [isInView, controls]);

  return (
    <div
      ref={ref}
      className="w-full flex items-center justify-center"
      style={{ height: 160, perspective: 900 }}
    >
      <div className="relative flex flex-col items-center" style={{ width: 180 }}>

        {/* ── Laptop Lid ── */}
        <motion.div
          animate={controls}
          variants={{
            lidClosed: { rotateX: 78 },
            lidOpen: { rotateX: 0, transition: { duration: 0.7, ease: EASING.outQuint } },
          }}
          initial="lidClosed"
          style={{
            width: 180,
            height: 112,
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
            {/* Desktop bg */}
            <motion.div
              animate={controls}
              variants={{
                screenOff: { opacity: 0 },
                screenOn: { opacity: 1, transition: { duration: 0.35, ease: EASING.outCubic } },
              }}
              initial="screenOff"
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
            />

            {/* Dock */}
            <motion.div
              animate={controls}
              variants={{
                screenOff: { opacity: 0 },
                screenOn: { opacity: 1, transition: { duration: 0.35, ease: EASING.outCubic } },
              }}
              initial="screenOff"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
            >
              {["#4a154b", "#1d4ed8", "#059669"].map((c, i) => (
                <div key={i} className="rounded-sm" style={{ width: 8, height: 8, background: c, opacity: 0.7 }} />
              ))}
            </motion.div>

            {/* ── Notification ── */}
            <motion.div
              animate={controls}
              variants={{
                notifHidden: { opacity: 0, x: 28, y: -6 },
                notifIn: { opacity: 1, x: 0, y: 0, transition: { duration: 0.55, ease: EASING.outCubic } },
              }}
              initial="notifHidden"
              className="absolute"
              style={{ top: 8, right: 6, width: 118 }}
            >
              <div
                className="rounded-md overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.96)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                  border: "0.5px solid rgba(255,255,255,0.3)",
                }}
              >
                {/* Purple header */}
                <div className="flex items-center gap-1.5 px-2 py-1" style={{ background: "#4a154b" }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                    <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zM9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm9 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 9a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
                  </svg>
                  <span style={{ fontSize: 6, fontWeight: 700, color: "white", fontFamily: "sans-serif", letterSpacing: 0.3 }}>
                    SlackDesk
                  </span>
                  <span style={{ fontSize: 5.5, color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif", marginLeft: "auto" }}>
                    now
                  </span>
                </div>
                {/* Body */}
                <div className="px-2 py-1.5">
                  <div style={{ fontSize: 6.5, fontWeight: 700, color: "#111827", fontFamily: "sans-serif", marginBottom: 2 }}>
                    New ticket in{" "}
                    <span style={{ color: "#0ea5e9" }}>#billing</span>
                  </div>
                  <div style={{ fontSize: 6, color: "#6b7280", fontFamily: "sans-serif", lineHeight: 1.4 }}>
                    Payment failed on checkout — need help
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Reply status ── */}
            <motion.div
              animate={controls}
              variants={{
                replyHidden: { opacity: 0, y: 5 },
                replyIn: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASING.outQuart } },
              }}
              initial="replyHidden"
              className="absolute"
              style={{ bottom: 14, left: 6, right: 6 }}
            >
              <div
                className="flex items-center gap-1.5 rounded-md px-2 py-1"
                style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.12)" }}
              >
                <div
                  className="rounded-full shrink-0 flex items-center justify-center"
                  style={{ width: 10, height: 10, background: "#0ea5e9" }}
                >
                  <span style={{ fontSize: 5.5, color: "white", fontWeight: 700, fontFamily: "sans-serif" }}>S</span>
                </div>
                <span style={{ fontSize: 6, color: "rgba(255,255,255,0.75)", fontFamily: "sans-serif" }}>
                  Sarah replied ·{" "}
                  <span style={{ color: "#34d399" }}>2 min</span>
                </span>
                <div className="shrink-0 ml-auto">
                  <motion.div
                    className="rounded-full"
                    style={{ width: 5, height: 5, background: "#34d399" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Base ── */}
        <div
          style={{
            width: 190,
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
            width: 160,
            height: 6,
            background: "radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)",
            marginTop: 2,
          }}
        />
      </div>
    </div>
  );
};
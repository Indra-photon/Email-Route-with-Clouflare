"use client";

import { useState } from "react";
import { Check, Copy, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = false,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(145deg, #141414 0%, #0f0f0f 100%)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* Subtle top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.08) 60%, transparent 100%)",
        }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Left — traffic lights + filename */}
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            {[
              "rgba(255,95,86,0.7)",
              "rgba(255,189,46,0.7)",
              "rgba(39,201,63,0.7)",
            ].map((color, i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: color }}
                whileHover={{ scale: 1.2, filter: "brightness(1.3)" }}
                transition={{ duration: 0.15 }}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-3.5" style={{ background: "rgba(255,255,255,0.08)" }} />

          {/* Filename / language */}
          <motion.span
            className="text-xs font-mono tracking-wide"
            style={{ color: "rgba(255,255,255,0.35)" }}
            animate={{ color: hovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)" }}
            transition={{ duration: 0.3 }}
          >
            {filename ?? language}
          </motion.span>
        </div>

        {/* Copy button */}
        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.4)",
          }}
          whileHover={{
            background: "rgba(255,255,255,0.08)",
            borderColor: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.8)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <Check size={11} strokeWidth={2.5} style={{ color: "rgba(74,222,128,0.9)" }} />
                <span style={{ color: "rgba(74,222,128,0.9)" }}>Copied</span>
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <Copy size={11} strokeWidth={1.5} />
                <span>Copy</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Code area */}
      <div className="p-5 overflow-x-auto">
        <pre className="font-mono text-sm leading-6">
          {showLineNumbers ? (
            <div className="flex gap-5">
              {/* Line numbers */}
              <div
                className="select-none text-right shrink-0"
                style={{
                  color: "rgba(255,255,255,0.15)",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  paddingRight: "1.25rem",
                  minWidth: "2rem",
                }}
              >
                {lines.map((_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>
              {/* Code */}
              <code style={{ color: "rgba(255,255,255,0.82)" }} className="flex-1">
                {code}
              </code>
            </div>
          ) : (
            <code style={{ color: "rgba(255,255,255,0.82)" }}>{code}</code>
          )}
        </pre>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none"
        style={{
          background: "linear-gradient(0deg, rgba(10,10,10,0.6) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
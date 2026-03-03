"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className={`relative rounded-lg overflow-hidden border border-neutral-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-neutral-100 px-4 py-2 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-xs font-schibsted font-medium text-neutral-900">
              {filename}
            </span>
          )}
          {!filename && language && (
            <span className="text-xs font-schibsted font-medium text-neutral-600 uppercase">
              {language}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className="h-7 px-2 font-schibsted font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <Check className="size-3 text-green-600" />
                <span className="text-xs">Copied</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="size-3" />
                <span className="text-xs">Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Code Content */}
      <div className="bg-neutral-900 p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed">
          {showLineNumbers ? (
            <div className="flex">
              {/* Line Numbers */}
              <div className="select-none pr-4 text-neutral-500 text-right">
                {lines.map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>
              {/* Code */}
              <code className="text-neutral-100 flex-1">{code}</code>
            </div>
          ) : (
            <code className="text-neutral-100">{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
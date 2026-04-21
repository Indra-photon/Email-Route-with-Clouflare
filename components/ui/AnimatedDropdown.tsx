"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronDown, IconCheck } from "@tabler/icons-react";

// ─── Easing ───────────────────────────────────────────────────────────────────

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;
const easeInCubic = [0.55, 0.055, 0.675, 0.19] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownOption {
  value: string;
  label: string;
}

interface AnimatedDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  className?: string;
  width?: string;
  compact?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnimatedDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  label,
  className = "",
  width = "w-48",
  compact = false,
}: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-lg font-schibsted font-regular text-neutral-700 dark:text-neutral-300 mb-1">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((o) => !o)}
        disabled={disabled}
        className={`${width} flex items-center justify-between gap-2 rounded-lg border bg-white px-3 font-schibsted text-left transition-colors duration-100 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          compact
            ? `h-9 text-xs tracking-tighter ${isOpen ? "border-sky-800" : "border-neutral-600 hover:border-neutral-900"}`
            : `py-2 text-sm border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 focus:border-sky-800 dark:focus:border-neutral-400 ${isOpen ? "border-sky-800 dark:border-neutral-400" : ""}`
        }`}
      >
        <span className={selected ? (compact ? "text-neutral-800" : "text-neutral-700 dark:text-neutral-300") : "text-neutral-400"}>
          {selected?.label ?? placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center justify-center shrink-0"
        >
          <IconChevronDown size={14} className="text-neutral-400" />
        </motion.span>
      </button>

      {/* Dropdown list */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scaleY: 0.95, scaleX: 0.98 }}
            animate={{ opacity: 1, y: 4, scaleY: 1, scaleX: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95, scaleX: 0.98 }}
            transition={{ duration: 0.2, ease: easeOutQuint }}
            style={{ transformOrigin: "top" }}
            className={`absolute z-50 ${width} mt-0 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden ${compact ? "shadow-sm" : "shadow-lg shadow-neutral-200/50 dark:shadow-neutral-900/50"}`}
          >
            <div className="max-h-48 overflow-y-auto py-1">
              {options.length === 0 ? (
                <li className="px-3 py-2 text-xs font-schibsted text-neutral-400">
                  No options available
                </li>
              ) : (
                options.map((option, i) => {
                  const isSelected = option.value === value;
                  return (
                    <motion.li
                      key={option.value}
                      initial={{ opacity: 0.6, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.12,
                        delay: i * 0.02,
                        ease: easeOutCubic,
                      }}
                      className=""
                    >
                      <button
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 font-schibsted text-left transition-colors duration-75 cursor-pointer ${
                          compact ? "text-xs tracking-tighter" : "text-sm font-semibold"
                        } ${
                          isSelected
                            ? compact ? "text-sky-800 font-medium" : "dark:bg-sky-900/20 text-sky-800 dark:text-sky-300 font-medium"
                            : compact ? "text-neutral-800 hover:bg-neutral-50" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        }`}
                      >
                        <span className="flex-1 truncate">{option.label}</span>
                        {isSelected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.15, ease: easeOutCubic }}
                          >
                            <IconCheck size={13} className="text-sky-700 dark:text-sky-400 shrink-0" />
                          </motion.span>
                        )}
                      </button>
                    </motion.li>
                  );
                })
              )}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
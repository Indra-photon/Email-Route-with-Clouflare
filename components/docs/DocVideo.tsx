"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

/** Extract YouTube video ID from any standard YouTube URL */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface DocVideoProps {
  /** Full YouTube URL e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ */
  url: string;
  /** Optional caption shown bottom-left of thumbnail */
  label?: string;
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export function DocVideo({ url, label }: DocVideoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const videoId = extractYouTubeId(url);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : null;

  // Portal needs document to be available
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll while modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!videoId || !thumbnailUrl || !embedUrl) return null;

  return (
    <>
      {/* ── Thumbnail card ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative w-full rounded-xl overflow-hidden border border-neutral-900 shadow-xl mb-8 block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        aria-label="Play overview video"
      >
        {/* Thumbnail image */}
        <div className="relative w-full aspect-video bg-neutral-900">
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/70" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-700 to-cyan-600 shadow-lg shadow-sky-900/40 transition-transform duration-200 group-hover:scale-110">
              {/* Triangle play icon */}
              <svg
                className="w-6 h-6 text-white ml-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </div>
          </div>

          {/* Bottom-left label */}
          {label && (
            <div className="absolute bottom-3 left-4">
              <span className="font-schibsted text-xs font-medium text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {label}
              </span>
            </div>
          )}
        </div>
      </button>

      {/* ── Modal via portal ── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                  onClick={() => setIsOpen(false)}
                  aria-hidden="true"
                />

                {/* Video container */}
                <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                >
                  <div className="relative w-full max-w-4xl pointer-events-auto">
                    {/* Close button */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/80 hover:text-white transition-colors font-schibsted text-sm"
                      aria-label="Close video"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Close
                    </button>

                    {/* iframe wrapper — maintains 16:9 */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                      <iframe
                        src={embedUrl}
                        title="Overview video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
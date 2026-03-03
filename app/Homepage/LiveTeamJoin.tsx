"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "motion/react";

// Random avatar faces from UI Faces / DiceBear style
const AVATAR_POOL = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=10",
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=13",
  "https://i.pravatar.cc/150?img=14",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=16",
  "https://i.pravatar.cc/150?img=17",
  "https://i.pravatar.cc/150?img=18",
  "https://i.pravatar.cc/150?img=19",
  "https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=21",
  "https://i.pravatar.cc/150?img=22",
  "https://i.pravatar.cc/150?img=23",
  "https://i.pravatar.cc/150?img=24",
  "https://i.pravatar.cc/150?img=25",
  "https://i.pravatar.cc/150?img=26",
  "https://i.pravatar.cc/150?img=27",
  "https://i.pravatar.cc/150?img=28",
  "https://i.pravatar.cc/150?img=29",
  "https://i.pravatar.cc/150?img=30",
];

const GRADIENTS = [
  "from-cyan-400 to-cyan-500",
  "from-sky-400 to-sky-500",
  "from-cyan-300 to-cyan-400",
  "from-sky-300 to-sky-400",
  "from-sky-500 to-cyan-400",
  "from-cyan-500 to-sky-300",
  "from-sky-200 to-cyan-400",
  "from-cyan-400 to-sky-600",
];

interface AvatarData {
  id: number;
  image: string;
  gradient: string;
}

function getRandomAvatar(usedImages: string[]): AvatarData {
  const available = AVATAR_POOL.filter((img) => !usedImages.includes(img));
  const pool = available.length > 0 ? available : AVATAR_POOL;
  const image = pool[Math.floor(Math.random() * pool.length)];
  const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  return {
    id: Date.now() + Math.random(),
    image,
    gradient,
  };
}

function createInitialAvatars(): AvatarData[] {
  const avatars: AvatarData[] = [];
  const usedImages: string[] = [];
  for (let i = 0; i < 4; i++) {
    const avatar = getRandomAvatar(usedImages);
    avatars.push(avatar);
    usedImages.push(avatar.image);
  }
  return avatars;
}

// Animated number counter with slot-machine roll
function AnimatedCount({ value }: { value: number }) {
  return (
    <span className="inline-flex overflow-hidden relative" style={{ height: "1.2em" }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 14, opacity: 0, filter: "blur(2px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -14, opacity: 0, filter: "blur(2px)" }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 25,
            mass: 0.8,
          }}
          className="text-sky-800 font-semibold"
        >
          {value}+
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Single avatar orb
function AvatarOrb({
  avatar,
  isEntering,
  isExiting,
}: {
  avatar: AvatarData;
  isEntering?: boolean;
  isExiting?: boolean;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      layoutId={`avatar-${avatar.id}`}
      className="relative w-11 h-11 rounded-full border-[3px] border-white shadow-md flex-shrink-0 overflow-hidden"
      initial={
        isEntering
          ? { x: -36, opacity: 0, scale: 0.7 }
          : { x: 0, opacity: 1, scale: 1 }
      }
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={
        isExiting
          ? { x: 24, opacity: 0, scale: 0.75 }
          : { opacity: 0, scale: 0.8 }
      }
      transition={
        isEntering
          ? {
              type: "spring",
              stiffness: 300,
              damping: 18,
              mass: 0.9,
            }
          : isExiting
          ? {
              duration: 0.35,
              ease: [0.4, 0, 0.2, 1],
            }
          : {
              type: "spring",
              stiffness: 250,
              damping: 22,
            }
      }
    >
      {/* Gradient fallback */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${avatar.gradient}`}
      />

      {/* Face image */}
      {!imgError && (
        <img
          src={avatar.image}
          alt=""
          className={`absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}
    </motion.div>
  );
}

export function LiveTeamJoin({
  initialCount = 500,
  intervalMs = 6000,
}: {
  initialCount?: number;
  intervalMs?: number;
}) {
  const [avatars, setAvatars] = useState<AvatarData[]>(createInitialAvatars);
  const [count, setCount] = useState(initialCount);
  const [enteringId, setEnteringId] = useState<number | null>(null);
  const [exitingId, setExitingId] = useState<number | null>(null);

  const cycleTeam = useCallback(() => {
    setAvatars((prev) => {
      const usedImages = prev.map((a) => a.image);
      const newAvatar = getRandomAvatar(usedImages);

      // Mark the last one as exiting, prepend the new one
      setExitingId(prev[prev.length - 1].id);
      setEnteringId(newAvatar.id);

      // Remove last, add new at front
      const next = [newAvatar, ...prev.slice(0, 3)];

      // Clear entering/exiting flags after animation
      setTimeout(() => {
        setEnteringId(null);
        setExitingId(null);
      }, 900);

      return next;
    });

    // Counter updates slightly after the merge impact
    setTimeout(() => {
      setCount((c) => c + 1);
    }, 400);
  }, []);

  useEffect(() => {
    const timer = setInterval(cycleTeam, intervalMs);
    return () => clearInterval(timer);
  }, [cycleTeam, intervalMs]);

  return (
    <div className="flex items-center gap-4">
      {/* Avatar stack with overflow clip */}
      <div className="flex -space-x-3 overflow-hidden pl-1" style={{ clipPath: "inset(-4px -4px -4px 0px)" }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {avatars.map((avatar) => (
            <AvatarOrb
              key={avatar.id}
              avatar={avatar}
              isEntering={avatar.id === enteringId}
              isExiting={avatar.id === exitingId}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Counter text */}
      <span className="text-base font-schibsted font-medium text-neutral-900">
        <AnimatedCount value={count} /> teams already using
      </span>
    </div>
  );
}

export default LiveTeamJoin;
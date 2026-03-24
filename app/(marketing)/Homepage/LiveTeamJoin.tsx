"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const AVATAR_POOL = Array.from({ length: 30 }, (_, i) => `https://i.pravatar.cc/150?img=${i + 1}`);

const GRADIENTS = [
  "from-cyan-400 to-cyan-500",
  "from-sky-400 to-sky-500",
  "from-cyan-300 to-cyan-400",
  "from-sky-300 to-sky-400",
  "from-sky-500 to-cyan-400",
  "from-cyan-500 to-sky-300",
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
  return { id: Date.now() + Math.random(), image, gradient };
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

function Avatar({ avatar, isNew }: { avatar: AvatarData; isNew: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div
      layout
      className="relative w-11 h-11 rounded-full border-[3px] border-white shadow-md flex-shrink-0 overflow-hidden"
      initial={isNew ? { opacity: 0, scale: 0.5 } : false}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.8 }}
      transition={
        isNew
          ? { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } // slow spring entrance
          : { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
      }
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${avatar.gradient}`} />
      {!error && (
        <img
          src={avatar.image}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </motion.div>
  );
}



function CountUp({ value }: { value: number }) {
  return (
    <span className="overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          className="text-sky-800 font-semibold inline-block"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          {value}+
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function LiveTeamJoin({
  initialCount = 500,
  intervalMs = 3000,
}: {
  initialCount?: number;
  intervalMs?: number;
}) {
  const [avatars, setAvatars] = useState<AvatarData[]>(createInitialAvatars);
  const [count, setCount] = useState(initialCount);
  const [newId, setNewId] = useState<number | null>(null);

  const cycle = useCallback(() => {
    setAvatars((prev) => {
      const usedImages = prev.map((a) => a.image);
      const next = getRandomAvatar(usedImages);
      setNewId(next.id);
      setTimeout(() => setNewId(null), 800);
      return [next, ...prev.slice(0, 3)];
    });
    setTimeout(() => setCount((c) => c + 1), 350);
  }, []);

  useEffect(() => {
    const t = setInterval(cycle, intervalMs);
    return () => clearInterval(t);
  }, [cycle, intervalMs]);

  return (
    <div className="flex flex items-center gap-4">
      <div
        className="flex -space-x-3 w-40"
        style={{ clipPath: "inset(-6px -6px -6px 0px)" }}
      >
        
        <AnimatePresence mode="popLayout" initial={false}>
          {avatars.map((avatar, index) => (
            <motion.div
                key={avatar.id}
                animate={{ x: [0, -3, 1, 0] }}         // nudge left then settle
                transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
              >
            <Avatar key={avatar.id} avatar={avatar} isNew={avatar.id === newId} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

      <span className="text-lg font-schibsted font-medium text-neutral-900 flex items-center justify-center gap-1">
         <CountUp value={count} /> teams already using...
      </span>
    </div>
  );
}

export default LiveTeamJoin;
"use client";

import { useEffect, useState } from "react";
import { IconActivity } from "@tabler/icons-react";
import { SectionSkeleton } from "./SectionSkeleton";
import { useRefreshStore } from "./useRefresh";

const SECTION_KEY = "team-activity";

const MOCK_ACTIVITY = [
  { id: "1", agent: "Jessica M.",  initials: "JM", action: "claimed",  target: "Invoice not received",      time: "3m ago"  },
  { id: "2", agent: "Mike R.",     initials: "MR", action: "replied to", target: "Login keeps failing",     time: "11m ago" },
  { id: "3", agent: "Sarah T.",    initials: "ST", action: "resolved",  target: "Bulk export request",       time: "34m ago" },
  { id: "4", agent: "Jessica M.",  initials: "JM", action: "replied to", target: "API rate limit exceeded", time: "1h ago"  },
  { id: "5", agent: "Mike R.",     initials: "MR", action: "claimed",  target: "Upgrade plan question",      time: "2h ago"  },
  { id: "6", agent: "Sarah T.",    initials: "ST", action: "resolved",  target: "Password reset issue",      time: "3h ago"  },
];

const ACTION_COLOUR: Record<string, string> = {
  claimed:     "text-sky-700",
  "replied to": "text-amber-600",
  resolved:    "text-emerald-600",
};

// Deterministic avatar colours from initials
const AVATAR_COLOURS = [
  "bg-sky-800 text-white",
  "bg-sky-600 text-white",
  "bg-neutral-700 text-white",
  "bg-sky-900 text-white",
];

function avatarColour(initials: string) {
  const i = initials.charCodeAt(0) % AVATAR_COLOURS.length;
  return AVATAR_COLOURS[i];
}

async function fetchActivity() {
  // TODO: replace with real API call
  // const res = await fetch("/api/activity?limit=6");
  // return res.json();
  await new Promise((r) => setTimeout(r, 1000));
  return MOCK_ACTIVITY;
}

export function TeamActivity() {
  const [activity, setActivity] = useState<typeof MOCK_ACTIVITY>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshCount, setLoading } = useRefreshStore();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoading(SECTION_KEY, true);

    fetchActivity().then((data) => {
      if (!cancelled) {
        setActivity(data);
        setIsLoading(false);
        setLoading(SECTION_KEY, false);
      }
    });

    return () => { cancelled = true; };
  }, [refreshCount]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 px-7 py-3">
        <IconActivity size={15} className="text-sky-700" strokeWidth={2} />
        <span className="text-xs font-semibold tracking-wide text-neutral-600 uppercase">
          Team Activity
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-100 mx-4" />

      {/* Content */}
      {isLoading ? (
        <SectionSkeleton rows={4} />
      ) : (
        <ul className="divide-y divide-neutral-100">
          {activity.map((item) => (
            <li key={item.id} className="flex items-start gap-3 px-7 py-2.5">
              {/* Avatar */}
              <div
                className={`size-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${avatarColour(item.initials)}`}
              >
                {item.initials}
              </div>
              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-neutral-700 leading-snug">
                  <span className="font-semibold">{item.agent}</span>{" "}
                  <span className={`font-medium ${ACTION_COLOUR[item.action] ?? "text-neutral-500"}`}>
                    {item.action}
                  </span>{" "}
                  <span className="text-neutral-500 truncate">"{item.target}"</span>
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
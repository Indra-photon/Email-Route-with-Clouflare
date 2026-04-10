// import { RecentTickets } from "./RecentTickets";
// import { LiveChatNotifications } from "./LiveChatNotifications";
// import { TeamActivity } from "./TeamActivity";
// import { IntegrationHealth } from "./IntegrationHealth";
// import { Heading } from "@/components/Heading";

// export function RightPanel() {
//   return (
//     <aside className="hidden xl:flex flex-col w-[360px] shrink-0 border-l border-neutral-200 bg-white h-full overflow-y-auto">

//       {/* Panel title — h-14 matches DashboardBreadcrumb height */}
//       <div className="flex items-center px-7 h-14 shrink-0 bg-neutral-50">
//         <Heading
//           as="h3"
//           variant="small"
//           className="text-xs font-bold tracking-widest text-sky-900 uppercase"
//         >
//           Live Overview
//         </Heading>
//       </div>

//       {/* Section 1 — Recent Tickets */}
//       <RecentTickets />

//       <div className="border-t-2 border-neutral-100 mx-0" />
      
//       {/* Heavy divider between sections */}
//       <div className="border-t-2 border-neutral-100 mx-0" />

//       {/* Section 2 — Live Chat Notifications */}
//       <LiveChatNotifications />

//       {/* Heavy divider */}
//       <div className="border-t-2 border-neutral-100 mx-0" />

//       {/* Section 3 — Team Activity */}
//       {/* <TeamActivity /> */}

//       {/* Heavy divider */}
//       <div className="border-t-2 border-neutral-100 mx-0" />

//       {/* Section 4 — Integration Health */}
//       <IntegrationHealth />

//     </aside>
//   );
// }


"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { IconRefresh } from "@tabler/icons-react";
import { RecentTickets } from "./RecentTickets";
import { LiveChatNotifications } from "./LiveChatNotifications";
import { IntegrationHealth } from "./IntegrationHealth";
import { Heading } from "@/components/Heading";
import { useRefreshStore } from "./useRefresh";

const EASE_OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1];

export function RightPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const triggerRefresh = useRefreshStore((s) => s.triggerRefresh);
  const isAnyLoading = useRefreshStore((s) => s.isAnyLoading);
  const spinning = isAnyLoading();

  return (
    // Outer wrapper is relative so the edge trigger can anchor to the left edge of this panel
    <div className="relative hidden xl:flex shrink-0 h-full">

      {/* ── Edge trigger — only visible when collapsed ── */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand panel"
          className="
            absolute top-1/2 -translate-y-1/2 -left-3 z-50
            flex items-center justify-center
            w-6 h-6 rounded-full
            bg-neutral-300 hover:bg-neutral-400
            border border-neutral-300
            shadow-md
            transition-colors duration-150
            cursor-pointer
          "
        >
          <PanelRightOpen size={13} className="text-neutral-600" />
        </button>
      )}

      {/* ── The panel itself ── */}
      <motion.aside
        animate={{ width: collapsed ? 0 : 360 }}
        transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
        // overflow-hidden clips content during width animation — no flash, no wrap
        className="flex flex-col border-l border-neutral-200 bg-white h-full overflow-hidden"
      >
        {/* ── Header — h-14 matches DashboardBreadcrumb ── */}
        <div className="flex items-center justify-between px-5 h-14 shrink-0 bg-neutral-50 border-b border-neutral-200">
          <Heading
            as="h3"
            variant="small"
            className="text-xs font-bold tracking-widest text-sky-900 uppercase whitespace-nowrap"
          >
            Live Overview
          </Heading>

          {/* Right controls */}
          <div className="flex items-center gap-1 shrink-0 ml-3">
            <button
              onClick={triggerRefresh}
              disabled={spinning}
              aria-label="Refresh panel"
              className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-neutral-200 transition-colors duration-150 disabled:opacity-40"
            >
              <IconRefresh
                size={14}
                strokeWidth={2.2}
                className={`transition-colors duration-150 ${spinning ? "animate-spin text-sky-500" : "text-neutral-500"}`}
              />
            </button>

            <button
              onClick={() => setCollapsed(true)}
              aria-label="Collapse panel"
              className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-neutral-200 transition-colors duration-150 shrink-0"
            >
              <PanelRightClose size={15} className="text-neutral-500" />
            </button>
          </div>
        </div>

        {/* ── Content — fixed width so it doesn't reflow during animation ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-[360px]">
          <RecentTickets />

          <div className="border-t-2 border-neutral-100" />

          <LiveChatNotifications />

          <div className="border-t-2 border-neutral-100" />

          {/* <IntegrationHealth /> */}
        </div>
      </motion.aside>

    </div>
  );
}
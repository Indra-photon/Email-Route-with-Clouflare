"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconAiGateway, IconGlobe, IconAt, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionSkeleton } from "./SectionSkeleton";
import { useRefreshStore } from "./useRefresh";

function PanelCTAButton({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="relative flex items-center justify-start w-fit gap-5 overflow-hidden rounded-full bg-gradient-to-b from-sky-900 to-cyan-700 shadow-sm cursor-pointer px-7 py-2"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={hovered ? { backgroundPositionX: ["200%", "-200%"] } : { backgroundPositionX: "200%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <span className="relative z-10 font-schibsted font-semibold text-white text-[11px] uppercase tracking-wide select-none">
        {label}
      </span>
      <motion.span
        className="relative z-10 flex items-center"
        animate={{ x: hovered ? 2 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <IconArrowRight size={12} className="text-white/70" />
      </motion.span>
    </motion.div>
  );
}

const SECTION_KEY = "integration-health";

interface DomainHealth {
  id:           string;
  domain:       string;
  verified:     boolean;
  lastActivity: string;
}

interface AliasHealth {
  id:     string;
  alias:  string;
  domain: string;
  active: boolean;
}

type Tab = "domains" | "aliases";

const TABS: { id: Tab; label: string; icon: typeof IconGlobe }[] = [
  { id: "domains", label: "Domains", icon: IconGlobe },
  { id: "aliases", label: "Aliases", icon: IconAt },
];

async function fetchHealth(): Promise<{ domains: DomainHealth[]; aliases: AliasHealth[] }> {
  const [domainsRes, aliasesRes] = await Promise.all([
    fetch("/api/domains"),
    fetch("/api/aliases"),
  ]);

  const domainsRaw = domainsRes.ok ? await domainsRes.json() : [];
  const aliasesRaw = aliasesRes.ok ? await aliasesRes.json() : [];

  const domains: DomainHealth[] = domainsRaw.map((d: any) => ({
    id:           d.id,
    domain:       d.domain,
    verified:     d.verifiedForSending === true || d.status === "active",
    lastActivity: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—",
  }));

  const aliases: AliasHealth[] = aliasesRaw.map((a: any) => ({
    id:     a.id,
    alias:  a.email,
    domain: a.domain,
    active: a.status === "active",
  }));

  return { domains, aliases };
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -24 : 24,
    opacity: 0,
  }),
};

export function IntegrationHealth() {
  const [data, setData] = useState<{
    domains: DomainHealth[];
    aliases: AliasHealth[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("domains");
  const [direction, setDirection] = useState(1);
  const { refreshCount, setLoading } = useRefreshStore();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoading(SECTION_KEY, true);

    fetchHealth()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setIsLoading(false);
          setLoading(SECTION_KEY, false);
        }
      })
      .catch((err) => {
        console.error("IntegrationHealth fetch error:", err);
        if (!cancelled) {
          setIsLoading(false);
          setLoading(SECTION_KEY, false);
        }
      });

    return () => { cancelled = true; };
  }, [refreshCount]);

  function switchTab(tab: Tab) {
    const tabOrder: Tab[] = ["domains", "aliases"];
    setDirection(tabOrder.indexOf(tab) > tabOrder.indexOf(activeTab) ? 1 : -1);
    setActiveTab(tab);
  }

  const hasPending = data?.domains.some((d) => !d.verified);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-3">
        <div className="flex items-center gap-2">
          <IconAiGateway size={13} className="text-neutral-400" strokeWidth={2} />
          <span className="font-schibsted text-[11px] font-semibold tracking-[0.055em] uppercase text-neutral-400">
            Integrations
          </span>
        </div>
        {!isLoading && hasPending && (
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="font-schibsted text-[10px] font-semibold text-amber-600">
              Needs attention
            </span>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="px-7 pb-3">
        <div className="relative flex items-center bg-neutral-100 rounded-lg p-0.5 gap-0.5">
          {/* Sliding pill indicator */}
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className="relative z-10 flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md cursor-pointer"
            >
              {/* Active background */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-white rounded-md shadow-[0_1px_3px_0_rgba(0,0,0,0.08)]"
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
              <tab.icon
                size={11}
                strokeWidth={2.25}
                className={`relative z-10 transition-colors duration-150 ${activeTab === tab.id ? "text-sky-700" : "text-neutral-400"}`}
              />
              <span className={`relative z-10 font-schibsted text-[11px] font-semibold transition-colors duration-150 ${activeTab === tab.id ? "text-sky-800" : "text-neutral-400"}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <SectionSkeleton rows={3} />
      ) : (
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {activeTab === "domains" && (
              <motion.div
                key="domains"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="px-7 pb-3 space-y-2"
              >
                {data?.domains.map((domain) => (
                  <div key={domain.id} className="flex items-center gap-3">
                    <div className="size-7 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                      <IconGlobe size={13} className="text-neutral-500" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-schibsted text-[12px] font-medium text-neutral-700 truncate">
                        {domain.domain}
                      </p>
                      <p className="font-schibsted text-[10px] text-neutral-400">
                        {domain.lastActivity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`size-1.5 rounded-full ${domain.verified ? "bg-sky-400" : "bg-amber-400"}`} />
                      <span className={`font-schibsted text-[10px] font-medium ${domain.verified ? "text-sky-600" : "text-amber-600"}`}>
                        {domain.verified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "aliases" && (
              <motion.div
                key="aliases"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="px-7 pb-3 space-y-2"
              >
                {data?.aliases.map((alias) => (
                  <div key={alias.id} className="flex items-center gap-3">
                    <div className="size-7 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                      <IconAt size={13} className="text-neutral-500" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-schibsted text-[12px] font-medium text-neutral-700 truncate">
                        {alias.alias}
                      </p>
                      <p className="font-schibsted text-[10px] text-neutral-400 truncate">
                        {alias.domain}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`size-1.5 rounded-full ${alias.active ? "bg-sky-400" : "bg-neutral-300"}`} />
                      <span className={`font-schibsted text-[10px] font-medium ${alias.active ? "text-sky-600" : "text-neutral-400"}`}>
                        {alias.active ? "Active" : "Off"}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      {!isLoading && (
        <div className="px-7 py-3 border-t border-neutral-100">
          <Link href="/dashboard/integrations" className="block">
            <PanelCTAButton label="Manage integrations" />
          </Link>
        </div>
      )}
    </div>
  );
}

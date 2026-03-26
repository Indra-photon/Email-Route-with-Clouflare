import Image from "next/image";

export function DashboardScreenshotIllustration() {
  return (
    <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
      {/* Browser chrome bar */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-2xl shadow-sky-900/20 ring-1 ring-black/10">
        {/* Browser top bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 border-b border-neutral-200">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>
          {/* Address bar */}
          <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 flex items-center gap-2">
            <div className="size-3 rounded-full bg-neutral-200 shrink-0" />
            <span className="font-schibsted text-[10px] text-neutral-400 truncate">
              app.emailrouter.io/dashboard
            </span>
          </div>
        </div>

        {/* Screenshot — rendered at native 3× resolution via next/image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src="/dashboard-screenshot.png"
            alt="EmailRouter dashboard — stat cards, recent tickets panel, and live chat overview"
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Bottom fade so it bleeds into the card edge cleanly */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

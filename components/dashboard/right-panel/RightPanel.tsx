import { RecentTickets } from "./RecentTickets";
import { LiveChatNotifications } from "./LiveChatNotifications";
import { TeamActivity } from "./TeamActivity";
import { IntegrationHealth } from "./IntegrationHealth";
import { Heading } from "@/components/Heading";

export function RightPanel() {
  return (
    <aside className="hidden xl:flex flex-col w-[360px] shrink-0 border-l border-neutral-200 bg-white h-full overflow-y-auto">

      {/* Panel title — h-14 matches DashboardBreadcrumb height */}
      <div className="flex items-center px-7 h-14 shrink-0 bg-neutral-50">
        <Heading
          as="h3"
          variant="small"
          className="text-xs font-bold tracking-widest text-sky-900 uppercase"
        >
          Live Overview
        </Heading>
      </div>

      {/* Section 1 — Recent Tickets */}
      <RecentTickets />

      <div className="border-t-2 border-neutral-100 mx-0" />
      
      {/* Heavy divider between sections */}
      <div className="border-t-2 border-neutral-100 mx-0" />

      {/* Section 2 — Live Chat Notifications */}
      <LiveChatNotifications />

      {/* Heavy divider */}
      <div className="border-t-2 border-neutral-100 mx-0" />

      {/* Section 3 — Team Activity */}
      {/* <TeamActivity /> */}

      {/* Heavy divider */}
      <div className="border-t-2 border-neutral-100 mx-0" />

      {/* Section 4 — Integration Health */}
      <IntegrationHealth />

    </aside>
  );
}
import { RecentTickets } from "./RecentTickets";
import { TicketDetailPanel } from "./TicketDetailPanel";
import React from "react";

export type PanelSection = React.ComponentType;

export interface PanelConfig {
  title: string;
  sections: PanelSection[];
}

// Route matching: first entry whose pattern matches pathname wins.
// Use exact strings for exact matches, prefix strings for startsWith.
const panelRoutes: Array<{ pattern: string; exact?: boolean; config: PanelConfig }> = [
  {
    pattern: "/dashboard/tickets",
    config: {
      title: "Ticket Details",
      sections: [TicketDetailPanel],
    },
  },
];

export function getPanelConfig(pathname: string): PanelConfig | null {
  const match = panelRoutes.find(({ pattern, exact }) =>
    exact ? pathname === pattern : pathname.startsWith(pattern)
  );
  return match?.config ?? null;
}

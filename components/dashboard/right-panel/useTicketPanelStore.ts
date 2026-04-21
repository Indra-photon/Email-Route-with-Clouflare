import { create } from "zustand";

export interface PanelTicket {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  status: "open" | "in_progress" | "waiting" | "resolved";
  receivedAt: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedToEmail?: string;
}

interface TicketPanelStore {
  selectedTicket: PanelTicket | null;
  history: PanelTicket[];
  setSelectedTicket: (ticket: PanelTicket) => void;
  navigateTo: (ticket: PanelTicket) => void;
  goBack: () => void;
  clearSelected: () => void;
}

export const useTicketPanelStore = create<TicketPanelStore>((set) => ({
  selectedTicket: null,
  history: [],

  setSelectedTicket: (ticket) =>
    set({ selectedTicket: ticket, history: [] }),

  navigateTo: (ticket) =>
    set((s) => ({
      history: s.selectedTicket ? [...s.history, s.selectedTicket] : s.history,
      selectedTicket: ticket,
    })),

  goBack: () =>
    set((s) => {
      const prev = [...s.history];
      const last = prev.pop();
      return { selectedTicket: last ?? null, history: prev };
    }),

  clearSelected: () => set({ selectedTicket: null, history: [] }),
}));

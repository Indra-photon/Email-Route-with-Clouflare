"use client";

import { create } from "zustand";

interface RefreshStore {
  refreshCount: number;
  loadingMap: Record<string, boolean>;
  triggerRefresh: () => void;
  setLoading: (key: string, loading: boolean) => void;
  isAnyLoading: () => boolean;
}

export const useRefreshStore = create<RefreshStore>((set, get) => ({
  refreshCount: 0,
  loadingMap: {},
  triggerRefresh: () => set((s) => ({ refreshCount: s.refreshCount + 1 })),
  setLoading: (key, loading) =>
    set((s) => ({ loadingMap: { ...s.loadingMap, [key]: loading } })),
  isAnyLoading: () => Object.values(get().loadingMap).some(Boolean),
}));
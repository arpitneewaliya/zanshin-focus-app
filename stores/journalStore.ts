import { create } from "zustand";
import { JournalEntry, ViewMode, deriveTitle } from "@/features/journal/types";

export { deriveTitle };

interface JournalState {
  entries: JournalEntry[];
  activeEntryId: string | null;
  viewMode: ViewMode;
  searchQuery: string;

  // Actions
  setEntries: (entries: JournalEntry[]) => void;
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (
    id: string,
    updates: { title?: string; content?: string; updatedAt?: string }
  ) => void;
  deleteEntry: (id: string) => void;
  setActiveEntry: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  activeEntryId: null,
  viewMode: "split",
  searchQuery: "",

  setEntries: (entries) => {
    set((state) => {
      const activeExists = entries.some((e) => e.id === state.activeEntryId);
      return {
        entries,
        activeEntryId: activeExists
          ? state.activeEntryId
          : entries.length > 0
          ? entries[0].id
          : null,
      };
    });
  },

  addEntry: (newEntry) => {
    set((state) => ({
      entries: [newEntry, ...state.entries.filter((e) => e.id !== newEntry.id)],
      activeEntryId: newEntry.id,
    }));
  },

  updateEntry: (id, updates) => {
    const now = updates.updatedAt || new Date().toISOString();
    set((state) => ({
      entries: state.entries.map((entry) => {
        if (entry.id !== id) return entry;
        const newContent =
          updates.content !== undefined ? updates.content : entry.content;
        const rawTitle =
          updates.title !== undefined ? updates.title : entry.title;
        const finalTitle = deriveTitle(rawTitle, newContent);

        return {
          ...entry,
          title: finalTitle,
          content: newContent,
          updatedAt: now,
        };
      }),
    }));
  },

  deleteEntry: (id) => {
    set((state) => {
      const remainingEntries = state.entries.filter((e) => e.id !== id);
      let newActiveId = state.activeEntryId;

      if (state.activeEntryId === id) {
        newActiveId = remainingEntries[0]?.id || null;
      }

      return {
        entries: remainingEntries,
        activeEntryId: newActiveId,
      };
    });
  },

  setActiveEntry: (id) => set({ activeEntryId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

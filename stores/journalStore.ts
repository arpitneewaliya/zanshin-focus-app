import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JournalEntry, ViewMode } from "@/features/journal/types";

export function deriveTitle(explicitTitle: string, content: string): string {
  if (explicitTitle && explicitTitle.trim()) {
    return explicitTitle.trim();
  }
  if (!content || !content.trim()) {
    return "Untitled Entry";
  }
  const lines = content.split("\n");
  for (const line of lines) {
    const cleaned = line.replace(/^[#*\->\s\d.]+\s*/, "").trim();
    if (cleaned) {
      return cleaned.length > 60 ? cleaned.slice(0, 60) + "..." : cleaned;
    }
  }
  return "Untitled Entry";
}

interface JournalState {
  entries: JournalEntry[];
  activeEntryId: string | null;
  viewMode: ViewMode;
  searchQuery: string;

  // Actions
  createEntry: (initialTitle?: string, initialContent?: string) => string;
  updateEntry: (
    id: string,
    updates: { title?: string; content?: string }
  ) => void;
  deleteEntry: (id: string) => void;
  setActiveEntry: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
}

const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: "demo-journal-1",
    title: "Reflection on Deep Work Session",
    content: `# Reflection on Deep Work Session

Today's focus session went remarkably well. Clearing notification badges and setting a single 25-minute Pomodoro timer helped eliminate ambient distractions.

### Key Takeaways
- **Single-tasking** yields significantly higher code quality and speed.
- Taking a 5-minute break away from screens keeps mental energy fresh.

> "Focus is a muscle. The more you practice non-distraction, the easier deep work becomes."
`,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "demo-journal-2",
    title: "Weekly Goals & Focus Architecture",
    content: `## Weekly Productivity Targets

- [x] Implement Pomodoro timer sound controls
- [x] Complete Task Manager local state
- [ ] Write weekly journal reflection

Organize priorities early every morning before opening email or messaging apps.
`,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: INITIAL_ENTRIES,
      activeEntryId: INITIAL_ENTRIES[0]?.id || null,
      viewMode: "split",
      searchQuery: "",

      createEntry: (initialTitle = "", initialContent = "") => {
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `journal-${Date.now()}`;
        const now = new Date().toISOString();
        const displayTitle = deriveTitle(initialTitle, initialContent);

        const newEntry: JournalEntry = {
          id,
          title: displayTitle,
          content: initialContent,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          entries: [newEntry, ...state.entries],
          activeEntryId: id,
        }));

        return id;
      },

      updateEntry: (id, updates) => {
        const now = new Date().toISOString();
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
    }),
    {
      name: "zanshin-journal-storage",
    }
  )
);

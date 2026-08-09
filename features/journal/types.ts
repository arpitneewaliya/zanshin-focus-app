export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type ViewMode = "write" | "split" | "preview";

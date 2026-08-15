export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type ViewMode = "write" | "split" | "preview";

/**
 * Derives a title from the explicit title if provided,
 * or extracts the first meaningful line from the markdown content.
 */
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

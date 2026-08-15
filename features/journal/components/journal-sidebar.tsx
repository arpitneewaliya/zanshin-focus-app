"use client";

import { useMemo, useState } from "react";
import { useJournalStore } from "@/stores/journalStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createJournalEntry as createJournalEntryAction } from "@/app/actions/journal";
import { Plus, Search, BookOpen, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalSidebarProps {
  onNewEntryCreated?: () => void;
  className?: string;
}

function formatEntryDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return `Today at ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function JournalSidebar({ onNewEntryCreated, className }: JournalSidebarProps) {
  const entries = useJournalStore((state) => state.entries);
  const activeEntryId = useJournalStore((state) => state.activeEntryId);
  const searchQuery = useJournalStore((state) => state.searchQuery);

  const addEntry = useJournalStore((state) => state.addEntry);
  const setActiveEntry = useJournalStore((state) => state.setActiveEntry);
  const setSearchQuery = useJournalStore((state) => state.setSearchQuery);

  const [isCreating, setIsCreating] = useState(false);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return entries
      .filter((entry) => {
        if (!q) return true;
        return (
          entry.title.toLowerCase().includes(q) ||
          entry.content.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [entries, searchQuery]);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const result = await createJournalEntryAction("", "");
      if (result.success && result.data) {
        addEntry(result.data);
        if (onNewEntryCreated) onNewEntryCreated();
      }
    } catch (err) {
      console.error("Error creating entry:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r border-border/50 bg-card/40 backdrop-blur-xs",
        className
      )}
    >
      {/* Sidebar Header & New Entry Button */}
      <div className="p-4 space-y-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold font-heading flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            Journal Entries
          </h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
            {entries.length}
          </span>
        </div>

        <Button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full gap-1.5 size-sm h-9"
        >
          {isCreating ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="size-4" />
              <span>New Entry</span>
            </>
          )}
        </Button>

        {/* Search Input */}
        <div className="relative">
          <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-background/60"
          />
        </div>
      </div>

      {/* Entry List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => {
              const isActive = entry.id === activeEntryId;
              const excerpt =
                entry.content
                  .replace(/^[#*\->\s\d.]+\s*/gm, "")
                  .replace(/\n+/g, " ")
                  .trim() || "No content";

              return (
                <button
                  key={entry.id}
                  onClick={() => setActiveEntry(entry.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-150 cursor-pointer select-none group border border-transparent",
                    isActive
                      ? "bg-primary/10 border-primary/30 text-foreground shadow-xs"
                      : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className={cn(
                        "text-sm font-medium line-clamp-1 leading-snug",
                        isActive ? "text-foreground font-semibold" : "text-foreground/90"
                      )}
                    >
                      {entry.title || "Untitled Entry"}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2 font-normal">
                    {excerpt}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                    <Calendar className="size-3 shrink-0" />
                    <span>{formatEntryDate(entry.updatedAt)}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground">
              {searchQuery ? "No entries match search" : "No entries yet"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

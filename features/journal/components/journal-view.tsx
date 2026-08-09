"use client";

import { useState } from "react";
import { useJournalStore } from "@/stores/journalStore";
import { JournalSidebar } from "@/features/journal/components/journal-sidebar";
import { JournalEditor } from "@/features/journal/components/journal-editor";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Sparkles, Menu, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function JournalView() {
  const entries = useJournalStore((state) => state.entries);
  const activeEntryId = useJournalStore((state) => state.activeEntryId);
  const createEntry = useJournalStore((state) => state.createEntry);

  // Mobile navigation view state
  const [mobileView, setMobileView] = useState<"sidebar" | "editor">("sidebar");

  const activeEntry = entries.find((e) => e.id === activeEntryId);

  const handleCreateFirstEntry = () => {
    createEntry("# My First Journal Entry\n\nReflect on your focus sessions and daily achievements...");
    setMobileView("editor");
  };

  const handleSelectMobileEntry = () => {
    setMobileView("editor");
  };

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[550px] w-full flex flex-col space-y-4">
      {/* Mobile Top View Switcher */}
      <div className="flex md:hidden items-center justify-between gap-2 p-2 rounded-lg border border-border/50 bg-card/40">
        <Button
          variant={mobileView === "sidebar" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMobileView("sidebar")}
          className="flex-1 gap-1.5 text-xs"
        >
          <Menu className="size-3.5" />
          <span>All Entries ({entries.length})</span>
        </Button>
        <Button
          variant={mobileView === "editor" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMobileView("editor")}
          disabled={!activeEntry}
          className="flex-1 gap-1.5 text-xs"
        >
          <BookOpen className="size-3.5" />
          <span>Editor</span>
        </Button>
      </div>

      {/* Main Journal Container */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Desktop Sidebar & Mobile Sidebar View */}
        <div
          className={`md:col-span-4 lg:col-span-3 h-full overflow-hidden rounded-xl ${
            mobileView === "sidebar" ? "block" : "hidden md:block"
          }`}
        >
          <JournalSidebar onNewEntryCreated={handleSelectMobileEntry} className="h-full rounded-xl" />
        </div>

        {/* Main Editor & Preview Section */}
        <div
          className={`md:col-span-8 lg:col-span-9 h-full overflow-hidden ${
            mobileView === "editor" ? "block" : "hidden md:block"
          }`}
        >
          {entries.length > 0 && activeEntry ? (
            <div className="h-full flex flex-col">
              {/* Mobile Back Button */}
              <div className="md:hidden mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileView("sidebar")}
                  className="gap-1.5 text-xs text-muted-foreground"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to entries list
                </Button>
              </div>
              <div className="flex-1 min-h-0">
                <JournalEditor key={activeEntry.id} entry={activeEntry} />
              </div>
            </div>
          ) : (
            /* Empty Journal State */
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/60 rounded-xl bg-card/20 space-y-4"
              >
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-8" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="text-xl font-semibold font-heading">
                    {entries.length === 0
                      ? "Your Journal is Empty"
                      : "No Entry Selected"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {entries.length === 0
                      ? "Capture thoughts, reflect on daily focus sessions, and document progress in Markdown."
                      : "Select an entry from the sidebar or create a new entry to start writing."}
                  </p>
                </div>
                <Button onClick={handleCreateFirstEntry} className="gap-2">
                  <Plus className="size-4" />
                  Create Entry
                </Button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

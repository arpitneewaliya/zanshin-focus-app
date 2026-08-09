"use client";

import { useEffect, useState, useRef } from "react";
import { JournalEntry } from "@/features/journal/types";
import { useJournalStore } from "@/stores/journalStore";
import { JournalPreview } from "@/features/journal/components/journal-preview";
import { JournalDeleteDialog } from "@/features/journal/components/journal-delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PenTool,
  Eye,
  Columns,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEditorProps {
  entry: JournalEntry;
}

function JournalEditorContent({ entry }: { entry: JournalEntry }) {
  const updateEntry = useJournalStore((state) => state.updateEntry);
  const deleteEntry = useJournalStore((state) => state.deleteEntry);
  const viewMode = useJournalStore((state) => state.viewMode);
  const setViewMode = useJournalStore((state) => state.setViewMode);

  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const triggerAutosave = (newTitle: string, newContent: string) => {
    setSaveStatus("saving");

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      updateEntry(entry.id, { title: newTitle, content: newContent });
      setSaveStatus("saved");
    }, 500);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    triggerAutosave(val, content);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    triggerAutosave(title, val);
  };

  const handleDeleteConfirm = () => {
    deleteEntry(entry.id);
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border/50 shadow-xs overflow-hidden">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-5 border-b border-border/40 bg-card/30">
        {/* Left: Save status & Date */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400">Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="size-3.5 text-emerald-500" />
                <span className="text-muted-foreground">Saved</span>
              </>
            )}
          </span>
          <span className="text-border">|</span>
          <span className="text-muted-foreground/80">
            Edited {new Date(entry.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </span>
        </div>

        {/* Right: View Mode Toggle & Delete */}
        <div className="flex items-center gap-2">
          {/* View Mode Pills */}
          <div className="flex items-center gap-1 bg-muted/70 p-0.5 rounded-lg border border-border/40">
            <button
              onClick={() => setViewMode("write")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer select-none",
                viewMode === "write"
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Write Mode"
            >
              <PenTool className="size-3" />
              <span className="hidden sm:inline">Write</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer select-none",
                viewMode === "split"
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Split View Mode"
            >
              <Columns className="size-3" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer select-none",
                viewMode === "preview"
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Preview Mode"
            >
              <Eye className="size-3" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setDeleteDialogOpen(true)}
            title="Delete entry"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Delete entry</span>
          </Button>
        </div>
      </div>

      {/* Entry Title Field */}
      <div className="px-5 pt-4 pb-2 border-b border-border/30">
        <Input
          type="text"
          placeholder="Untitled Entry (or auto-generated from first line)"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-xl font-bold font-heading border-none shadow-none focus-visible:ring-0 px-0 h-auto placeholder:text-muted-foreground/50 text-foreground"
        />
      </div>

      {/* Editor Content Body */}
      <div className="flex-1 min-h-0 relative">
        {viewMode === "write" && (
          <Textarea
            placeholder="Write your journal entry here in Markdown..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-full p-5 border-none shadow-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed bg-transparent text-foreground placeholder:text-muted-foreground/50"
          />
        )}

        {viewMode === "preview" && (
          <JournalPreview content={content} className="w-full h-full" />
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full divide-y md:divide-y-0 md:divide-x divide-border/40">
            {/* Left: Input Textarea */}
            <div className="h-full min-h-[200px] md:min-h-0">
              <Textarea
                placeholder="Write your journal entry here in Markdown..."
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-full p-4 sm:p-5 border-none shadow-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed bg-transparent text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            {/* Right: Markdown Preview */}
            <div className="h-full min-h-[200px] md:min-h-0 overflow-hidden bg-muted/10">
              <JournalPreview content={content} className="w-full h-full" />
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <JournalDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        entryTitle={entry.title}
      />
    </div>
  );
}

export function JournalEditor({ entry }: JournalEditorProps) {
  return <JournalEditorContent key={entry.id} entry={entry} />;
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { JournalEntry } from "@/features/journal/types";
import { useJournalStore } from "@/stores/journalStore";
import { JournalPreview } from "@/features/journal/components/journal-preview";
import { JournalDeleteDialog } from "@/features/journal/components/journal-delete-dialog";
import {
  updateJournalEntry as updateJournalEntryAction,
  deleteJournalEntry as deleteJournalEntryAction,
} from "@/app/actions/journal";
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
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEditorProps {
  entry: JournalEntry;
}

function JournalEditorContent({ entry }: { entry: JournalEntry }) {
  const updateEntryStore = useJournalStore((state) => state.updateEntry);
  const deleteEntryStore = useJournalStore((state) => state.deleteEntry);
  const viewMode = useJournalStore((state) => state.viewMode);
  const setViewMode = useJournalStore((state) => state.setViewMode);

  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [lastSavedAt, setLastSavedAt] = useState(entry.updatedAt);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<{ title: string; content: string } | null>(null);

  // Core save function
  const performSave = useCallback(
    async (targetTitle: string, targetContent: string) => {
      setSaveStatus("saving");
      try {
        const result = await updateJournalEntryAction(entry.id, {
          title: targetTitle,
          content: targetContent,
        });

        if (result.success && result.data) {
          updateEntryStore(entry.id, {
            title: result.data.title,
            content: result.data.content,
            updatedAt: result.data.updatedAt,
          });
          setLastSavedAt(result.data.updatedAt);
          setSaveStatus("saved");
          pendingUpdatesRef.current = null;
        } else {
          console.error("Save failed:", result.error);
          setSaveStatus("error");
        }
      } catch (err) {
        console.error("Network error during journal autosave:", err);
        setSaveStatus("error");
      }
    },
    [entry.id, updateEntryStore]
  );

  // Debounced autosave trigger
  const triggerAutosave = useCallback(
    (newTitle: string, newContent: string) => {
      // 1. Immediately update local store so search/sidebar reflect current edits
      updateEntryStore(entry.id, { title: newTitle, content: newContent });
      pendingUpdatesRef.current = { title: newTitle, content: newContent };
      setSaveStatus("saving");

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        performSave(newTitle, newContent);
      }, 800);
    },
    [entry.id, updateEntryStore, performSave]
  );

  // Flush any pending save on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (pendingUpdatesRef.current) {
        const { title: finalTitle, content: finalContent } = pendingUpdatesRef.current;
        updateJournalEntryAction(entry.id, {
          title: finalTitle,
          content: finalContent,
        }).catch((err) => {
          console.error("Failed to flush journal autosave on unmount:", err);
        });
      }
    };
  }, [entry.id]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    triggerAutosave(val, content);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    triggerAutosave(title, val);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteJournalEntryAction(entry.id);
      if (result.success) {
        deleteEntryStore(entry.id);
      } else {
        console.error("Delete failed:", result.error);
      }
    } catch (err) {
      console.error("Network error deleting entry:", err);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border/50 shadow-xs overflow-hidden">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-5 border-b border-border/40 bg-card/30">
        {/* Left: Save status & Timestamp */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400">Saving...</span>
              </>
            ) : saveStatus === "error" ? (
              <>
                <AlertCircle className="size-3.5 text-destructive" />
                <span className="text-destructive font-medium">
                  Failed to save (saved locally)
                </span>
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
            Edited{" "}
            {new Date(lastSavedAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
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
            disabled={isDeleting}
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

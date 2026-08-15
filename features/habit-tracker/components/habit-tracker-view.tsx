"use client";

import { useMemo, useState, useEffect } from "react";
import { useHabitStore } from "@/stores/habitStore";
import { Habit, HabitCompletionLog } from "../types";
import { formatDateKey } from "../utils";
import { HabitCard } from "./habit-card";
import { HabitFormDialog } from "./habit-form-dialog";
import { HabitEmptyState } from "./habit-empty-state";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  createHabit as createHabitAction,
  updateHabit as updateHabitAction,
  archiveHabit as archiveHabitAction,
  unarchiveHabit as unarchiveHabitAction,
  deleteHabit as deleteHabitAction,
  upsertCompletionLog as upsertCompletionLogAction,
  deleteCompletionLog as deleteCompletionLogAction,
} from "@/app/actions/habits";
import { Plus, Flame, ChevronDown, ChevronRight, Archive, AlertCircle, X, Loader2 } from "lucide-react";

interface HabitTrackerViewProps {
  initialHabits?: Habit[];
  initialLogs?: HabitCompletionLog[];
  initialError?: string;
}

export function HabitTrackerView({
  initialHabits = [],
  initialLogs = [],
  initialError,
}: HabitTrackerViewProps) {
  const habits = useHabitStore((state) => state.habits);
  const completionLogs = useHabitStore((state) => state.completionLogs);
  const setHabitsAndLogs = useHabitStore((state) => state.setHabitsAndLogs);

  const addHabitStore = useHabitStore((state) => state.addHabit);
  const editHabitStore = useHabitStore((state) => state.editHabit);
  const archiveHabitStore = useHabitStore((state) => state.archiveHabit);
  const unarchiveHabitStore = useHabitStore((state) => state.unarchiveHabit);
  const deleteHabitStore = useHabitStore((state) => state.deleteHabit);
  const setLogStore = useHabitStore((state) => state.setLog);
  const removeLogStore = useHabitStore((state) => state.removeLog);

  // Sync initial server data into store
  useEffect(() => {
    setHabitsAndLogs(initialHabits, initialLogs);
  }, [initialHabits, initialLogs, setHabitsAndLogs]);

  const [errorMessage, setErrorMessage] = useState<string | null>(initialError || null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Partition habits into active vs archived
  const activeHabits = useMemo(() => {
    return habits.filter((h) => !h.archivedDate);
  }, [habits]);

  const archivedHabits = useMemo(() => {
    return habits.filter((h) => Boolean(h.archivedDate));
  }, [habits]);

  const handleOpenAddForm = () => {
    setEditingHabit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: {
    name: string;
    description?: string;
    color: Habit["color"];
    frequency: Habit["frequency"];
  }) => {
    setErrorMessage(null);
    try {
      if (editingHabit) {
        const result = await updateHabitAction(editingHabit.id, data);
        if (result.success && result.data) {
          editHabitStore(editingHabit.id, result.data);
          return true;
        } else {
          setErrorMessage(result.error || "Failed to update habit");
          return false;
        }
      } else {
        const result = await createHabitAction(data);
        if (result.success && result.data) {
          addHabitStore(result.data);
          return true;
        } else {
          setErrorMessage(result.error || "Failed to create habit");
          return false;
        }
      }
    } catch (err) {
      console.error("Error saving habit:", err);
      setErrorMessage("Network error while saving habit");
      return false;
    }
  };

  const handleArchive = async (habitId: string) => {
    const todayStr = formatDateKey();
    archiveHabitStore(habitId, todayStr);
    setErrorMessage(null);

    try {
      const result = await archiveHabitAction(habitId);
      if (!result.success || !result.data) {
        unarchiveHabitStore(habitId);
        setErrorMessage(result.error || "Failed to archive habit");
      }
    } catch (err) {
      console.error("Error archiving habit:", err);
      unarchiveHabitStore(habitId);
      setErrorMessage("Network error while archiving habit");
    }
  };

  const handleUnarchive = async (habitId: string) => {
    unarchiveHabitStore(habitId);
    setErrorMessage(null);

    try {
      const result = await unarchiveHabitAction(habitId);
      if (!result.success || !result.data) {
        archiveHabitStore(habitId);
        setErrorMessage(result.error || "Failed to unarchive habit");
      }
    } catch (err) {
      console.error("Error unarchiving habit:", err);
      archiveHabitStore(habitId);
      setErrorMessage("Network error while unarchiving habit");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingHabit) return;

    const habitToDelete = deletingHabit;
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await deleteHabitAction(habitToDelete.id);
      if (result.success) {
        deleteHabitStore(habitToDelete.id);
        setDeletingHabit(null);
      } else {
        setErrorMessage(result.error || "Failed to delete habit");
      }
    } catch (err) {
      console.error("Error deleting habit:", err);
      setErrorMessage("Network error while deleting habit");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleHabitStatus = async (
    habitId: string,
    dateStr: string = formatDateKey()
  ) => {
    const existing = completionLogs.find(
      (l) => l.habitId === habitId && l.date === dateStr
    );

    setErrorMessage(null);

    if (!existing) {
      // 1. None -> Completed
      const tempLog: HabitCompletionLog = {
        id: `temp-${Date.now()}`,
        habitId,
        date: dateStr,
        status: "completed",
      };
      setLogStore(tempLog);

      try {
        const result = await upsertCompletionLogAction(habitId, dateStr, "completed");
        if (result.success && result.data) {
          setLogStore(result.data);
        } else {
          removeLogStore(habitId, dateStr);
          setErrorMessage(result.error || "Failed to mark habit completed");
        }
      } catch (err) {
        console.error("Error marking habit completed:", err);
        removeLogStore(habitId, dateStr);
        setErrorMessage("Network error while updating habit status");
      }
    } else if (existing.status === "completed") {
      // 2. Completed -> Missed
      const updatedLog: HabitCompletionLog = {
        ...existing,
        status: "missed",
      };
      setLogStore(updatedLog);

      try {
        const result = await upsertCompletionLogAction(habitId, dateStr, "missed");
        if (result.success && result.data) {
          setLogStore(result.data);
        } else {
          setLogStore(existing);
          setErrorMessage(result.error || "Failed to mark habit missed");
        }
      } catch (err) {
        console.error("Error marking habit missed:", err);
        setLogStore(existing);
        setErrorMessage("Network error while updating habit status");
      }
    } else {
      // 3. Missed -> None (Undo)
      removeLogStore(habitId, dateStr);

      try {
        const result = await deleteCompletionLogAction(habitId, dateStr);
        if (!result.success) {
          setLogStore(existing);
          setErrorMessage(result.error || "Failed to undo habit status");
        }
      } catch (err) {
        console.error("Error undoing habit status:", err);
        setLogStore(existing);
        setErrorMessage("Network error while updating habit status");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setErrorMessage(null)}
            className="text-destructive hover:bg-destructive/10"
            aria-label="Dismiss error"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Flame className="size-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-heading">
              Habit Tracker
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Build consistency with streak calculation logic and GitHub-style heatmaps.
          </p>
        </div>

        <Button onClick={handleOpenAddForm} className="gap-2 shrink-0">
          <Plus className="size-4" />
          Add Habit
        </Button>
      </div>

      {/* Active Habits List or Empty State */}
      {activeHabits.length === 0 ? (
        <HabitEmptyState onAddHabit={handleOpenAddForm} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {activeHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                logs={completionLogs}
                onToggleToday={handleToggleHabitStatus}
                onEdit={handleOpenEditForm}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
                onDelete={(h) => setDeletingHabit(h)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Archived Habits Section (Collapsed by default) */}
      {archivedHabits.length > 0 && (
        <div className="pt-4 border-t border-border/40 space-y-4">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showArchived ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
            <Archive className="size-4" />
            <span>Archived Habits ({archivedHabits.length})</span>
          </button>

          {showArchived && (
            <div className="grid grid-cols-1 gap-6 pt-2 animate-in fade-in-0 duration-200">
              {archivedHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  logs={completionLogs}
                  onToggleToday={handleToggleHabitStatus}
                  onEdit={handleOpenEditForm}
                  onArchive={handleArchive}
                  onUnarchive={handleUnarchive}
                  onDelete={(h) => setDeletingHabit(h)}
                  isArchived
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form Dialog for Add / Edit */}
      <HabitFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialHabit={editingHabit}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deletingHabit)}
        onOpenChange={(open) => !open && setDeletingHabit(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deletingHabit?.name}&rdquo;?
              This will permanently remove the habit and all of its history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete Habit"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

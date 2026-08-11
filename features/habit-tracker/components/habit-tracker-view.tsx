"use client";

import { useMemo, useState } from "react";
import { useHabitStore } from "@/stores/habitStore";
import { Habit } from "../types";
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
import { Plus, Flame, ChevronDown, ChevronRight, Archive } from "lucide-react";

export function HabitTrackerView() {
  const {
    habits,
    completionLogs,
    addHabit,
    editHabit,
    archiveHabit,
    unarchiveHabit,
    deleteHabit,
    toggleHabitStatus,
  } = useHabitStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
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

  const handleFormSubmit = (data: {
    name: string;
    description?: string;
    color: Habit["color"];
    frequency: Habit["frequency"];
  }) => {
    if (editingHabit) {
      editHabit(editingHabit.id, data);
    } else {
      addHabit(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingHabit) {
      deleteHabit(deletingHabit.id);
      setDeletingHabit(null);
    }
  };

  return (
    <div className="space-y-8">
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
                onToggleToday={toggleHabitStatus}
                onEdit={handleOpenEditForm}
                onArchive={archiveHabit}
                onUnarchive={unarchiveHabit}
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
                  onToggleToday={toggleHabitStatus}
                  onEdit={handleOpenEditForm}
                  onArchive={archiveHabit}
                  onUnarchive={unarchiveHabit}
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Habit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

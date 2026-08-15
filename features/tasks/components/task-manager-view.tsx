"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Task } from "@/features/tasks/types";
import { useTaskStore } from "@/stores/taskStore";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { TaskItem } from "@/features/tasks/components/task-item";
import { TaskFormDialog } from "@/features/tasks/components/task-form-dialog";
import { TaskDeleteDialog } from "@/features/tasks/components/task-delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteTask as deleteTaskAction,
  toggleTaskComplete as toggleTaskCompleteAction,
  clearCompletedTasks as clearCompletedTasksAction,
} from "@/app/actions/tasks";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Plus,
  FilterX,
  Sparkles,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";

interface TaskManagerViewProps {
  initialTasks?: Task[];
  initialError?: string;
}

export function TaskManagerView({ initialTasks, initialError }: TaskManagerViewProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const filterStatus = useTaskStore((state) => state.filterStatus);
  const filterPriority = useTaskStore((state) => state.filterPriority);
  const sortBy = useTaskStore((state) => state.sortBy);
  const sortOrder = useTaskStore((state) => state.sortOrder);

  const setTasks = useTaskStore((state) => state.setTasks);
  const toggleTaskCompleteStore = useTaskStore((state) => state.toggleTaskComplete);
  const deleteTaskStore = useTaskStore((state) => state.deleteTask);
  const setFilterStatus = useTaskStore((state) => state.setFilterStatus);
  const setFilterPriority = useTaskStore((state) => state.setFilterPriority);
  const clearCompletedTasksStore = useTaskStore((state) => state.clearCompletedTasks);

  // Sync initial tasks into the store on mount / change
  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks);
    }
  }, [initialTasks, setTasks]);

  // Error Banner State
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError || null);

  // Dialog State
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate filtered and sorted task list
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Filter by completion status
        if (filterStatus === "active" && task.completed) return false;
        if (filterStatus === "completed" && !task.completed) return false;

        // Filter by priority
        if (filterPriority !== "all" && task.priority !== filterPriority)
          return false;

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "priority") {
          const priorityRank = { high: 3, medium: 2, low: 1 };
          comparison = priorityRank[a.priority] - priorityRank[b.priority];
        } else if (sortBy === "dueDate") {
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = a.dueDate.localeCompare(b.dueDate);
        } else {
          // createdAt
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [tasks, filterStatus, filterPriority, sortBy, sortOrder]);

  // Summary statistics
  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Form Handlers
  const handleOpenAddModal = () => {
    setTaskToEdit(null);
    setFormDialogOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setFormDialogOpen(true);
  };

  const handleOpenDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleToggleComplete = async (id: string) => {
    // Optimistic toggle
    toggleTaskCompleteStore(id);
    setErrorMessage(null);

    try {
      const result = await toggleTaskCompleteAction(id);
      if (!result.success) {
        // Roll back on failure
        toggleTaskCompleteStore(id);
        setErrorMessage(result.error || "Failed to update task status");
      }
    } catch (err) {
      console.error("Error toggling task completion:", err);
      toggleTaskCompleteStore(id);
      setErrorMessage("Network error while updating task status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    const removedTask = taskToDelete;
    // Optimistic delete
    deleteTaskStore(removedTask.id);
    setErrorMessage(null);
    setIsDeleting(true);

    try {
      const result = await deleteTaskAction(removedTask.id);
      if (!result.success) {
        // Roll back
        setTasks([...tasks]);
        setErrorMessage(result.error || "Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      setTasks([...tasks]);
      setErrorMessage("Network error while deleting task");
    } finally {
      setIsDeleting(false);
      setTaskToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleClearCompleted = async () => {
    const previousTasks = [...tasks];
    clearCompletedTasksStore();
    setErrorMessage(null);

    try {
      const result = await clearCompletedTasksAction();
      if (!result.success) {
        setTasks(previousTasks);
        setErrorMessage(result.error || "Failed to clear completed tasks");
      }
    } catch (err) {
      console.error("Error clearing completed tasks:", err);
      setTasks(previousTasks);
      setErrorMessage("Network error while clearing completed tasks");
    }
  };

  const handleResetFilters = () => {
    setFilterStatus("all");
    setFilterPriority("all");
  };

  return (
    <div className="space-y-6">
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

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur-xs border-border/50 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Tasks
              </p>
              <p className="text-2xl font-bold font-heading">{totalCount}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <ListTodo className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xs border-border/50 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Focus
              </p>
              <p className="text-2xl font-bold font-heading text-amber-600 dark:text-amber-400">
                {activeCount}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xs border-border/50 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Completed
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold font-heading text-emerald-600 dark:text-emerald-400">
                  {completedCount}
                </p>
                <span className="text-xs text-muted-foreground">
                  ({completionPercentage}%)
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar / Filters */}
      <TaskFilters onAddNewTask={handleOpenAddModal} />

      {/* Task List / Empty States */}
      <div className="space-y-3 min-h-[300px]">
        {filteredTasks.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </AnimatePresence>
        ) : tasks.length === 0 ? (
          /* Initial Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-2xl bg-card/20 space-y-4 my-8"
          >
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-8" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-lg font-semibold font-heading">No tasks yet</h3>
              <p className="text-sm text-muted-foreground">
                Capture your focus tasks and priorities to stay organized throughout your session.
              </p>
            </div>
            <Button onClick={handleOpenAddModal} className="gap-2">
              <Plus className="size-4" />
              Create First Task
            </Button>
          </motion.div>
        ) : (
          /* Filtered Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-border/60 rounded-2xl bg-card/20 space-y-4 my-8"
          >
            <div className="p-3.5 rounded-full bg-muted text-muted-foreground">
              <FilterX className="size-6" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h3 className="text-base font-semibold font-heading">
                No matching tasks
              </h3>
              <p className="text-xs text-muted-foreground">
                No tasks match your current priority or status filters.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Footer bar with bulk actions if completed tasks exist */}
      {completedCount > 0 && filterStatus !== "active" && (
        <div className="flex justify-end pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCompleted}
            className="text-xs text-muted-foreground hover:text-destructive gap-1.5"
          >
            <Trash2 className="size-3.5" />
            Clear completed tasks ({completedCount})
          </Button>
        </div>
      )}

      {/* Add / Edit Task Dialog */}
      <TaskFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <TaskDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
}

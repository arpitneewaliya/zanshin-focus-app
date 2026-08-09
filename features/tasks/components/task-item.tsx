"use client";

import { motion } from "motion/react";
import { Task, TaskPriority } from "@/features/tasks/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit2, Trash2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityConfig: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  high: {
    label: "High Priority",
    className:
      "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20",
  },
  medium: {
    label: "Medium Priority",
    className:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20",
  },
  low: {
    label: "Low Priority",
    className:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20",
  },
};

function formatDueDate(dueDateStr: string) {
  const todayStr = new Date().toISOString().split("T")[0];
  const due = new Date(dueDateStr + "T00:00:00");
  const today = new Date(todayStr + "T00:00:00");
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Overdue (${due.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })})`,
      isOverdue: true,
      isToday: false,
    };
  } else if (diffDays === 0) {
    return { label: "Due Today", isOverdue: false, isToday: true };
  } else if (diffDays === 1) {
    return { label: "Due Tomorrow", isOverdue: false, isToday: false };
  } else {
    return {
      label: `Due ${due.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}`,
      isOverdue: false,
      isToday: false,
    };
  }
}

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const priorityInfo = priorityConfig[task.priority];
  const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex items-start gap-3.5 p-4 rounded-xl border border-border/60 bg-card/70 backdrop-blur-xs shadow-xs transition-all duration-200 hover:border-border hover:shadow-md",
        task.completed && "opacity-60 bg-muted/40 border-border/30"
      )}
    >
      {/* Checkbox */}
      <div className="pt-0.5 shrink-0">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-label={`Mark "${task.title}" as ${
            task.completed ? "incomplete" : "complete"
          }`}
          className="size-5 rounded-md"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "text-base font-medium leading-snug tracking-tight text-foreground transition-colors",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>

          {/* Action buttons (desktop/hover) */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(task)}
              title="Edit task"
              className="text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="size-3.5" />
              <span className="sr-only">Edit task</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(task)}
              title="Delete task"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        </div>

        {/* Task Description */}
        {task.description && (
          <p
            className={cn(
              "text-sm text-muted-foreground line-clamp-2 leading-relaxed whitespace-pre-wrap",
              task.completed && "line-through text-muted-foreground/60"
            )}
          >
            {task.description}
          </p>
        )}

        {/* Metadata Badges & Due Date */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Priority Badge */}
          <Badge
            variant="outline"
            className={cn("text-[11px] font-medium border px-2 py-0.5", priorityInfo.className)}
          >
            {priorityInfo.label}
          </Badge>

          {/* Due Date Indicator */}
          {dueDateInfo && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors",
                dueDateInfo.isOverdue && !task.completed
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-medium"
                  : dueDateInfo.isToday && !task.completed
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium"
                  : "bg-muted/60 text-muted-foreground border-border/40"
              )}
            >
              {dueDateInfo.isOverdue && !task.completed ? (
                <AlertCircle className="size-3 shrink-0" />
              ) : dueDateInfo.isToday && !task.completed ? (
                <Clock className="size-3 shrink-0" />
              ) : (
                <Calendar className="size-3 shrink-0" />
              )}
              {dueDateInfo.label}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

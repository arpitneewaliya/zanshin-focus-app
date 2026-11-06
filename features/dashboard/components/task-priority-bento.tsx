"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowUpRight, Plus, AlertCircle, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskMetrics, TaskSummaryItem } from "@/features/dashboard/types";
import { toggleTaskComplete } from "@/app/actions/tasks";
import { cn } from "@/lib/utils";

interface TaskPriorityBentoProps {
  metrics: TaskMetrics;
  isGuest: boolean;
}

export function TaskPriorityBento({ metrics, isGuest }: TaskPriorityBentoProps) {
  const [tasks, setTasks] = useState<TaskSummaryItem[]>(metrics.recentTasks || []);
  const [, startTransition] = useTransition();

  const handleToggleTask = (task: TaskSummaryItem) => {
    const nextCompleted = !task.completed;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    );

    if (!isGuest) {
      startTransition(async () => {
        try {
          await toggleTaskComplete(task.id);
        } catch (err) {
          console.error("Failed to toggle task:", err);
          // Rollback
          setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, completed: !nextCompleted } : t))
          );
        }
      });
    }
  };

  const getPriorityClasses = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "low":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  const formatDueDate = (dueDateStr?: string | null) => {
    if (!dueDateStr) return null;
    const today = new Date().toISOString().split("T")[0];
    if (dueDateStr < today) return { label: "Overdue", isOverdue: true };
    if (dueDateStr === today) return { label: "Today", isOverdue: false };
    const date = new Date(dueDateStr + "T00:00:00");
    return {
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      isOverdue: false,
    };
  };

  return (
    <Card className="h-full flex flex-col justify-between border-border/70 hover:border-primary/40 transition-all duration-300 relative overflow-hidden group bg-card/60 backdrop-blur-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xs">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                Priority Tasks
              </CardTitle>
              {metrics.overdueCount > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {metrics.overdueCount} overdue
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {metrics.openCount} open • {metrics.completedTodayCount} done today
            </p>
          </div>
        </div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded-md hover:bg-primary/5"
        >
          <span>All Tasks</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="pt-4 space-y-3.5 flex-1 flex flex-col justify-between">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-7 text-center text-muted-foreground space-y-2.5 my-auto">
            <div className="p-2.5 rounded-full bg-muted/50 border border-border/40">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {metrics.openCount === 0 ? "All tasks completed" : "No priority tasks"}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                {metrics.openCount === 0
                  ? "Your mind is clear and unobstructed."
                  : "Organize your workflow and conquer your day."}
              </p>
            </div>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="size-3" />
              <span>Add New Task</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const dueInfo = formatDueDate(task.dueDate);

              return (
                <div
                  key={task.id}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 group/item",
                    task.completed
                      ? "bg-muted/10 border-border/30 opacity-60"
                      : "bg-muted/20 border-border/40 hover:border-primary/30"
                  )}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task)}
                    className={cn(
                      "size-5 rounded-md flex items-center justify-center shrink-0 border transition-all cursor-pointer",
                      task.completed
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/80 hover:border-primary/60 bg-background"
                    )}
                  >
                    {task.completed ? (
                      <Check className="size-3 stroke-[3]" />
                    ) : (
                      <Circle className="size-2 text-transparent group-hover/item:text-primary/40" />
                    )}
                  </button>

                  {/* Task Title & Meta */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-xs sm:text-sm font-medium truncate transition-all",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={cn(
                          "text-[9px] font-semibold uppercase px-1 py-0.2 rounded border",
                          getPriorityClasses(task.priority)
                        )}
                      >
                        {task.priority}
                      </span>
                      {dueInfo && (
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            dueInfo.isOverdue
                              ? "text-rose-500 font-semibold"
                              : "text-muted-foreground"
                          )}
                        >
                          {dueInfo.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span>Overall completion:</span>
            <strong className="text-foreground">
              {metrics.totalCount > 0
                ? Math.round((metrics.completedCount / metrics.totalCount) * 100)
                : 0}
              %
            </strong>
          </span>
          <Link
            href="/tasks"
            className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
          >
            <span>+ Task</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


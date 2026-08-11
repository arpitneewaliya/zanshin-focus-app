"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Habit, HabitCompletionLog } from "../types";
import {
  calculateHabitStreak,
  formatDateKey,
  formatFrequencyLabel,
  getHabitColorClasses,
  isDateScheduled,
} from "../utils";
import { HabitHeatmap } from "./habit-heatmap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Flame,
  Trophy,
  Check,
  X,
  MoreVertical,
  Edit2,
  Archive,
  ArchiveRestore,
  Trash2,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  logs: HabitCompletionLog[];
  onToggleToday: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onArchive: (habitId: string) => void;
  onUnarchive: (habitId: string) => void;
  onDelete: (habit: Habit) => void;
  isArchived?: boolean;
}

export function HabitCard({
  habit,
  logs,
  onToggleToday,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  isArchived = false,
}: HabitCardProps) {
  const todayStr = formatDateKey();
  const colorConfig = getHabitColorClasses(habit.color);

  // Compute streak
  const streak = useMemo(() => {
    return calculateHabitStreak(habit, logs, todayStr);
  }, [habit, logs, todayStr]);

  // Today log status
  const todayLog = useMemo(() => {
    return logs.find((l) => l.habitId === habit.id && l.date === todayStr);
  }, [logs, habit.id, todayStr]);

  const scheduledToday = isDateScheduled(habit, new Date());
  const freqLabel = formatFrequencyLabel(habit);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex flex-col justify-between p-5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-xs shadow-xs transition-all duration-200 hover:border-border hover:shadow-md",
        isArchived && "opacity-75 bg-muted/30 border-border/40"
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Color indicator dot */}
            <span
              className={cn("size-2.5 rounded-full shrink-0", colorConfig.dot)}
            />
            {/* Habit Title */}
            <h3 className="text-lg font-semibold tracking-tight leading-snug text-foreground truncate">
              {habit.name}
            </h3>
            {/* Frequency Badge */}
            <Badge
              variant="outline"
              className={cn(
                "text-[11px] font-medium border px-2 py-0.5 shrink-0",
                colorConfig.badge
              )}
            >
              {freqLabel}
            </Badge>
          </div>

          {/* Habit Description */}
          {habit.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {habit.description}
            </p>
          )}
        </div>

        {/* Action Menu & Quick Control */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dropdown Options */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-foreground"
                />
              }
            >
              <MoreVertical className="size-4" />
              <span className="sr-only">Open options</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {!isArchived && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(habit)}>
                    <Edit2 className="size-4 mr-2" />
                    Edit Habit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onArchive(habit.id)}>
                    <Archive className="size-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                </>
              )}

              {isArchived && (
                <DropdownMenuItem onClick={() => onUnarchive(habit.id)}>
                  <ArchiveRestore className="size-4 mr-2" />
                  Unarchive
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(habit)}
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Row & Today Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-3 py-2 border-y border-border/40">
        {/* Streak Stats Badges */}
        <div className="flex items-center gap-2">
          {/* Current Streak Badge */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-colors",
              streak.currentStreak > 0
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                : "bg-muted/50 text-muted-foreground border-border/40"
            )}
            title="Current Streak (consecutive scheduled occurrences completed)"
          >
            <Flame
              className={cn(
                "size-3.5",
                streak.currentStreak > 0
                  ? "fill-amber-500 text-amber-500 animate-pulse"
                  : "text-muted-foreground"
              )}
            />
            <span>{streak.currentStreak} day streak</span>
          </div>

          {/* Longest Streak Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/40 bg-muted/30 text-xs font-medium text-muted-foreground"
            title="Longest Streak achieved"
          >
            <Trophy className="size-3.5 text-muted-foreground/80" />
            <span>Best: {streak.longestStreak}</span>
          </div>
        </div>

        {/* Quick Mark Today Control */}
        {!isArchived && (
          <div className="flex items-center gap-1.5">
            {todayLog?.status === "completed" ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => onToggleToday(habit.id)}
                className={cn(
                  "h-8 gap-1.5 text-xs font-medium shadow-xs transition-all",
                  colorConfig.activeBg
                )}
                title="Click to toggle or mark missed"
              >
                <Check className="size-3.5" />
                Completed Today
              </Button>
            ) : todayLog?.status === "missed" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleToday(habit.id)}
                className="h-8 gap-1.5 text-xs font-medium border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                title="Marked as missed today — click to mark complete"
              >
                <X className="size-3.5" />
                Missed Today
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleToday(habit.id)}
                className={cn(
                  "h-8 gap-1.5 text-xs font-medium border-border hover:border-foreground/30 hover:bg-muted/50",
                  scheduledToday && "border-dashed"
                )}
              >
                <CalendarCheck className="size-3.5 text-muted-foreground" />
                Mark Today Complete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Heatmap visualization */}
      <HabitHeatmap habit={habit} logs={logs} />
    </motion.div>
  );
}

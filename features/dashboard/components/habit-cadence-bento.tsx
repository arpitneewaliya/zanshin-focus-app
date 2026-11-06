"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Flame, ArrowUpRight, Plus, Check, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HabitSummaryItem } from "@/features/dashboard/types";
import {
  getHabitColorClasses,
  formatFrequencyLabel,
  formatDateKey,
} from "@/features/habit-tracker/utils";
import {
  upsertCompletionLog,
  deleteCompletionLog,
} from "@/app/actions/habits";
import { cn } from "@/lib/utils";

interface HabitCadenceBentoProps {
  habits: HabitSummaryItem[];
  isGuest: boolean;
}

export function HabitCadenceBento({ habits: initialHabits, isGuest }: HabitCadenceBentoProps) {
  const [habitsState, setHabitsState] = useState(initialHabits);
  const [, startTransition] = useTransition();

  const todayStr = formatDateKey(new Date());

  const handleToggleHabit = (item: HabitSummaryItem) => {
    const isCurrentlyDone = item.completedToday;
    const nextStatus = !isCurrentlyDone;

    // Optimistic UI update
    setHabitsState((prev) =>
      prev.map((h) => {
        if (h.habit.id !== item.habit.id) return h;
        const streakDelta = nextStatus ? 1 : -1;
        return {
          ...h,
          completedToday: nextStatus,
          streak: {
            ...h.streak,
            currentStreak: Math.max(0, h.streak.currentStreak + streakDelta),
          },
        };
      })
    );

    // Call server action if not guest
    if (!isGuest) {
      startTransition(async () => {
        try {
          if (nextStatus) {
            await upsertCompletionLog(item.habit.id, todayStr, "completed");
          } else {
            await deleteCompletionLog(item.habit.id, todayStr);
          }
        } catch (err) {
          console.error("Failed to update habit completion:", err);
          // Rollback on error
          setHabitsState(initialHabits);
        }
      });
    }
  };

  const completedCountToday = habitsState.filter((h) => h.completedToday).length;
  const totalCount = habitsState.length;

  return (
    <Card className="h-full flex flex-col justify-between border-border/70 hover:border-primary/40 transition-all duration-300 relative overflow-hidden group bg-card/60 backdrop-blur-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xs">
            <Flame className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                Daily Rituals
              </CardTitle>
              {totalCount > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
                  {completedCountToday}/{totalCount} done
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Consistency streaks & today&apos;s check-in
            </p>
          </div>
        </div>
        <Link
          href="/habit-tracker"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded-md hover:bg-primary/5"
        >
          <span>Manage</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="pt-4 space-y-3.5 flex-1 flex flex-col justify-between">
        {habitsState.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground space-y-3 my-auto">
            <div className="p-3 rounded-full bg-muted/50 border border-border/40">
              <Flame className="size-6 text-muted-foreground/50" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">No active habits yet</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Build lasting discipline. Create recurring habits with visual heatmaps.
              </p>
            </div>
            <Link
              href="/habit-tracker"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Create First Habit</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {habitsState.slice(0, 4).map((item) => {
              const { habit, streak, completedToday } = item;
              const colorClasses = getHabitColorClasses(habit.color);

              return (
                <div
                  key={habit.id}
                  className="p-2.5 sm:p-3 rounded-xl bg-muted/20 border border-border/40 hover:border-primary/30 transition-all flex items-center justify-between gap-3 group/habit"
                >
                  {/* Habit info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={cn(
                        "size-2.5 rounded-full shrink-0 ring-2 ring-background",
                        colorClasses.dot
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {habit.name}
                        </p>
                        {streak.currentStreak > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 shrink-0">
                            <Flame className="size-3 fill-amber-500" />
                            <span>{streak.currentStreak}d</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {formatFrequencyLabel(habit)}
                      </p>
                    </div>
                  </div>

                  {/* 1-Tap Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleHabit(item)}
                    title={completedToday ? "Mark not completed" : "Mark completed for today"}
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer border shadow-2xs",
                      completedToday
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 scale-100"
                        : "bg-background text-muted-foreground/40 border-border/80 hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    <Check
                      className={cn(
                        "size-4 transition-transform duration-200",
                        completedToday ? "scale-100 stroke-[3]" : "scale-75 opacity-40 group-hover/habit:opacity-100"
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer streak cheer / link */}
        {habitsState.length > 0 && (
          <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 truncate">
              <Trophy className="size-3.5 text-amber-500 shrink-0" />
              <span>
                Longest:{" "}
                <strong className="text-foreground">
                  {Math.max(...habitsState.map((h) => h.streak.longestStreak), 0)} days
                </strong>
              </span>
            </span>
            <Link
              href="/habit-tracker"
              className="text-primary hover:underline font-medium shrink-0"
            >
              Heatmaps &rarr;
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


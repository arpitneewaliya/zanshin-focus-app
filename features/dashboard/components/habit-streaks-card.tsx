import Link from "next/link";
import { Flame, ArrowUpRight, Plus, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HabitSummaryItem } from "@/features/dashboard/types";
import {
  getHabitColorClasses,
  formatFrequencyLabel,
} from "@/features/habit-tracker/utils";
import { cn } from "@/lib/utils";

interface HabitStreaksCardProps {
  habits: HabitSummaryItem[];
}

export function HabitStreaksCard({ habits }: HabitStreaksCardProps) {
  return (
    <Card className="h-full flex flex-col justify-between hover:border-primary/40 transition-colors group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Flame className="size-4" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Habit Streaks & Activity
          </CardTitle>
        </div>
        <Link
          href="/habit-tracker"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
        >
          Manage Habits
          <ArrowUpRight className="size-3" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3.5 pt-1">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground space-y-2">
            <Flame className="size-8 stroke-[1.5] text-muted-foreground/40" />
            <p className="text-sm">No active habits tracked yet</p>
            <Link
              href="/habit-tracker"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="size-3" />
              Create your first habit
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map(({ habit, streak, miniGrid }) => {
              const colorClasses = getHabitColorClasses(habit.color);
              const freqLabel = formatFrequencyLabel(habit);

              return (
                <div
                  key={habit.id}
                  className="p-2.5 rounded-lg bg-muted/30 border border-border/40 hover:border-border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left: Habit Info & Streak */}
                  <div className="space-y-1 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", colorClasses.dot)} />
                      <span className="font-medium text-sm leading-tight text-foreground truncate max-w-[150px]">
                        {habit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-0.5 font-semibold text-foreground">
                        <Flame className="size-3 text-amber-500 fill-amber-500" />
                        {streak.currentStreak}{" "}
                        <span className="font-normal text-muted-foreground text-[11px]">
                          {streak.currentStreak === 1 ? "day" : "days"}
                        </span>
                      </span>
                      {streak.longestStreak > 0 && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                          <Trophy className="size-2.5 text-muted-foreground/70" />
                          {streak.longestStreak}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground px-1.5 py-0.2 bg-background/80 rounded border border-border/50">
                        {freqLabel}
                      </span>
                    </div>
                  </div>

                  {/* Right: Compact 5-Week Mini Heatmap Grid */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                    {miniGrid.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-1">
                        {week.map((cell) => {
                          const isCompleted = cell.status === "completed";
                          const isMissed = cell.status === "missed";
                          const isScheduled = cell.isScheduled && !cell.isBeforeCreation && !cell.isFuture;

                          return (
                            <div
                              key={cell.dateStr}
                              title={`${cell.dateStr}: ${cell.status}`}
                              className={cn(
                                "size-2.5 rounded-[2px] transition-colors",
                                isCompleted && colorClasses.heatmapCompleted,
                                isMissed && "bg-rose-500/30 border border-rose-500/40",
                                !isCompleted && !isMissed && isScheduled && "bg-muted-foreground/15 border border-border/50",
                                !isCompleted && !isMissed && !isScheduled && "bg-muted/40 opacity-40",
                                cell.isToday && "ring-1 ring-primary"
                              )}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

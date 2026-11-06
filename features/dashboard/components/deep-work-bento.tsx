"use client";

import Link from "next/link";
import { Timer, ArrowUpRight, TrendingUp, TrendingDown, Sparkles, Play } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FocusMetrics } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

interface DeepWorkBentoProps {
  metrics: FocusMetrics;
}

function formatMinutes(totalMinutes: number): { primary: string; unit?: string } {
  if (totalMinutes === 0) return { primary: "0", unit: "min" };
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return { primary: `${hours}h ${minutes}m` };
  }
  if (hours > 0) {
    return { primary: `${hours}h` };
  }
  return { primary: `${minutes}`, unit: "min" };
}

export function DeepWorkBento({ metrics }: DeepWorkBentoProps) {
  const { primary: todayFormatted } = formatMinutes(metrics.todayMinutes);
  const totalWeeklyMinutes = metrics.last7Days.reduce((acc, curr) => acc + curr.minutes, 0);
  const { primary: weeklyFormatted } = formatMinutes(totalWeeklyMinutes);
  const maxBarMinutes = Math.max(...metrics.last7Days.map((d) => d.minutes), 60);

  // Daily target (defaulting to 3h / 180 mins)
  const targetMinutes = 180;
  const progressPercent = Math.min(Math.round((metrics.todayMinutes / targetMinutes) * 100), 100);

  const diff = metrics.diffFromAvgPercent;
  const hasDiff = diff !== null;
  const isPositive = hasDiff && diff > 0;
  const isNegative = hasDiff && diff < 0;

  return (
    <Card className="h-full flex flex-col justify-between border-border/70 hover:border-primary/40 transition-all duration-300 relative overflow-hidden group bg-card/60 backdrop-blur-xs">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <Timer className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
              Deep Work & Weekly Flow
            </CardTitle>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Daily deep focus intervals and 7-day cadence
            </p>
          </div>
        </div>
        <Link
          href="/timer"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded-md hover:bg-primary/5"
        >
          <span>Launch Timer</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="pt-5 space-y-6 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Left Column: Today's Focus Stat & Target */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Today&apos;s Focus Time
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                  {todayFormatted}
                </span>
                {metrics.todayMinutes > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({metrics.todaySessionsCount}{" "}
                    {metrics.todaySessionsCount === 1 ? "session" : "sessions"})
                  </span>
                )}
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Daily Target (3h)</span>
                <span className="font-semibold text-foreground">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden p-0.5 border border-border/40">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Comparison Badge */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {hasDiff ? (
                <div
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
                    isPositive &&
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                    isNegative &&
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                    !isPositive &&
                      !isNegative &&
                      "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {isPositive && <TrendingUp className="size-3" />}
                  {isNegative && <TrendingDown className="size-3" />}
                  <span>
                    {isPositive ? `+${diff}%` : `${diff}%`} vs 7d avg
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border/50">
                  <Sparkles className="size-3 text-primary/70" />
                  <span>Fresh session streak</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 7-Day Visual Flow Bars */}
          <div className="md:col-span-7 flex flex-col justify-end space-y-2 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-muted-foreground font-medium">7-Day Cadence</span>
              <span className="text-xs text-muted-foreground">
                Total: <span className="text-foreground font-semibold">{weeklyFormatted}</span>
              </span>
            </div>

            {/* Bar Visualizer */}
            <div className="grid grid-cols-7 gap-2 items-end h-36 pt-2">
              {metrics.last7Days.map((point) => {
                const heightPercent =
                  point.minutes > 0
                    ? Math.max(Math.round((point.minutes / maxBarMinutes) * 100), 12)
                    : 6;

                return (
                  <div
                    key={point.dateStr}
                    className="flex flex-col items-center gap-1.5 h-full justify-end group/bar relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-popover text-popover-foreground text-[10px] font-semibold py-0.5 px-1.5 rounded-md shadow-md border pointer-events-none whitespace-nowrap z-20">
                      {point.minutes > 0 ? `${point.minutes}m` : "0m"}
                    </div>

                    {/* Bar Pill */}
                    <div className="w-full bg-muted/40 rounded-t-md h-full flex items-end overflow-hidden p-0.5">
                      <div
                        className={cn(
                          "w-full rounded-t transition-all duration-500",
                          point.isToday
                            ? "bg-primary shadow-xs ring-1 ring-primary/40"
                            : point.minutes > 0
                            ? "bg-primary/50 group-hover/bar:bg-primary/70"
                            : "bg-muted-foreground/15"
                        )}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day Label */}
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "text-[11px] font-medium transition-colors",
                          point.isToday
                            ? "text-primary font-bold"
                            : "text-muted-foreground group-hover/bar:text-foreground"
                        )}
                      >
                        {point.dayLabel}
                      </span>
                      {point.isToday && (
                        <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Quick Action Bar */}
        <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready for next focus block</span>
          </span>
          <Link
            href="/timer"
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
          >
            <Play className="size-3 fill-primary" />
            <span>Start Session</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


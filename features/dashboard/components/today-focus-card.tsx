import Link from "next/link";
import { Timer, ArrowUpRight, ArrowDownRight, Minus, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FocusMetrics } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

interface TodayFocusCardProps {
  metrics: FocusMetrics;
}

function formatMinutes(totalMinutes: number): { primary: string; secondary?: string } {
  if (totalMinutes === 0) return { primary: "0", secondary: "min" };
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return { primary: `${hours}h ${minutes}m` };
  }
  if (hours > 0) {
    return { primary: `${hours}h` };
  }
  return { primary: `${minutes}`, secondary: "min" };
}

export function TodayFocusCard({ metrics }: TodayFocusCardProps) {
  const { primary, secondary } = formatMinutes(metrics.todayMinutes);
  const avgFormatted = formatMinutes(metrics.dailyAverage7DaysMinutes);

  const diff = metrics.diffFromAvgPercent;
  const hasDiff = diff !== null;
  const isPositive = hasDiff && diff > 0;
  const isNegative = hasDiff && diff < 0;
  const isZero = hasDiff && diff === 0;

  return (
    <Card className="h-full flex flex-col justify-between hover:border-primary/40 transition-colors group relative overflow-hidden">
      {/* Subtle background glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Timer className="size-4" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Today&apos;s Focus
          </CardTitle>
        </div>
        <Link
          href="/timer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
        >
          Start Timer
          <ArrowUpRight className="size-3" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight font-heading">
            {primary}
          </span>
          {secondary && (
            <span className="text-lg text-muted-foreground font-medium">
              {secondary}
            </span>
          )}
        </div>

        {/* Comparison to 7-day average */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {hasDiff ? (
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                isPositive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                isNegative && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                isZero && "bg-muted text-muted-foreground border-border"
              )}
            >
              {isPositive && <ArrowUpRight className="size-3" />}
              {isNegative && <ArrowDownRight className="size-3" />}
              {isZero && <Minus className="size-3" />}
              <span>
                {isPositive ? `+${diff}%` : `${diff}%`} vs 7-day avg
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
              <Sparkles className="size-3 text-primary" />
              <span>Starting 7-day baseline</span>
            </div>
          )}

          <span className="text-xs text-muted-foreground">
            {metrics.todaySessionsCount}{" "}
            {metrics.todaySessionsCount === 1 ? "session" : "sessions"} today
          </span>
        </div>

        <div className="border-t border-border/50 pt-2.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>7-Day Daily Avg:</span>
          <span className="font-medium text-foreground">
            {avgFormatted.primary} {avgFormatted.secondary || ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

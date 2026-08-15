"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DailyFocusPoint } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

interface WeeklyFocusChartProps {
  data: DailyFocusPoint[];
}

export function WeeklyFocusChart({ data }: WeeklyFocusChartProps) {
  const maxMinutes = Math.max(...data.map((d) => d.minutes), 60); // minimum scale of 60 mins
  const totalWeeklyMinutes = data.reduce((acc, curr) => acc + curr.minutes, 0);

  const formatTotalTime = (mins: number) => {
    if (mins === 0) return "0 min";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  return (
    <Card className="h-full flex flex-col justify-between hover:border-primary/40 transition-colors group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="size-4" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Weekly Focus Trend
          </CardTitle>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Total: <span className="text-foreground font-semibold">{formatTotalTime(totalWeeklyMinutes)}</span>
        </span>
      </CardHeader>

      <CardContent className="pt-2">
        {/* 7-day Bar Chart Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-36 pt-4 pb-1">
          {data.map((point) => {
            const heightPercent = point.minutes > 0 
              ? Math.max(Math.round((point.minutes / maxMinutes) * 100), 12) 
              : 0;

            return (
              <div
                key={point.dateStr}
                className="flex flex-col items-center gap-1.5 h-full justify-end group/bar"
              >
                {/* Minute label tooltip / hover */}
                <span
                  className={cn(
                    "text-[10px] font-mono transition-opacity duration-150 whitespace-nowrap",
                    point.minutes > 0
                      ? "text-muted-foreground group-hover/bar:text-primary group-hover/bar:font-bold"
                      : "opacity-0"
                  )}
                >
                  {point.minutes > 0 ? `${point.minutes}m` : "0"}
                </span>

                {/* Vertical Bar Container */}
                <div className="w-full max-w-[28px] h-24 bg-muted/50 dark:bg-muted/30 rounded-md relative flex items-end overflow-hidden">
                  {/* Filled Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={cn(
                      "w-full rounded-b-[4px] rounded-t-[3px] transition-all duration-300 ease-out",
                      point.isToday
                        ? "bg-primary shadow-sm"
                        : point.minutes > 0
                        ? "bg-primary/70 group-hover/bar:bg-primary"
                        : "bg-transparent"
                    )}
                  />
                </div>

                {/* Day Label */}
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
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

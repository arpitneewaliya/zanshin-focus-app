"use client";

import { useMemo, useState } from "react";
import { Habit, HabitCompletionLog } from "../types";
import { getHeatmapGrid, getHabitColorClasses, parseDateKey } from "../utils";
import { cn } from "@/lib/utils";

interface HabitHeatmapProps {
  habit: Habit;
  logs: HabitCompletionLog[];
}

export function HabitHeatmap({ habit, logs }: HabitHeatmapProps) {
  const [hoveredDate, setHoveredDate] = useState<{
    dateStr: string;
    formattedDate: string;
    statusText: string;
  } | null>(null);

  const grid = useMemo(() => {
    return getHeatmapGrid(habit, logs, 52);
  }, [habit, logs]);

  const colorConfig = getHabitColorClasses(habit.color);

  // Extract month labels with positions across weeks
  const monthLabels = useMemo(() => {
    const labels: { monthName: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    grid.forEach((week, weekIndex) => {
      // Look at middle of the week or Sunday
      const firstDayOfWeek = week[0]?.date;
      if (firstDayOfWeek) {
        const month = firstDayOfWeek.getMonth();
        if (month !== lastMonth) {
          labels.push({
            monthName: firstDayOfWeek.toLocaleDateString(undefined, {
              month: "short",
            }),
            weekIndex,
          });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [grid]);

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="space-y-2 pt-2">
      {/* Scrollable Container */}
      <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-muted">
        <div className="min-w-[660px] space-y-1 select-none">
          {/* Month Labels Row */}
          <div className="flex text-[10px] text-muted-foreground font-mono h-4 relative pl-6">
            {monthLabels.map((lbl, idx) => (
              <span
                key={`${lbl.monthName}-${idx}`}
                className="absolute"
                style={{ left: `calc(1.5rem + ${lbl.weekIndex * 12}px)` }}
              >
                {lbl.monthName}
              </span>
            ))}
          </div>

          {/* Grid Layout: 7 rows x N weeks */}
          <div className="flex items-start gap-1">
            {/* Day of Week Indicators */}
            <div className="grid grid-rows-7 gap-[2.5px] text-[9px] font-mono text-muted-foreground/70 pr-1 select-none pt-[1px]">
              {dayNames.map((d, i) => (
                <span
                  key={i}
                  className="h-2.5 flex items-center justify-center w-3"
                >
                  {i % 2 === 1 ? d : ""}
                </span>
              ))}
            </div>

            {/* Weeks Grid */}
            <div className="flex gap-[2.5px] flex-1">
              {grid.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-rows-7 gap-[2.5px]">
                  {week.map((cell) => {
                    const parsedDate = parseDateKey(cell.dateStr);
                    const formattedDate = parsedDate.toLocaleDateString(
                      undefined,
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    );

                    let cellBg = "bg-muted/30 border-muted/50";
                    let statusText = "Unscheduled";

                    if (cell.isBeforeCreation) {
                      cellBg = "bg-muted/10 border-transparent opacity-40";
                      statusText = "Prior to creation";
                    } else if (cell.isFuture) {
                      cellBg = "bg-muted/20 border-transparent opacity-30";
                      statusText = "Future date";
                    } else if (cell.status === "completed") {
                      cellBg = colorConfig.heatmapCompleted;
                      statusText = "Completed";
                    } else if (cell.status === "missed") {
                      cellBg =
                        "bg-rose-500/25 border-rose-500/40 dark:bg-rose-500/35";
                      statusText = "Missed";
                    } else if (cell.isScheduled) {
                      cellBg =
                        cell.isToday
                          ? `${colorConfig.heatmapPending} ring-1 ${colorConfig.ring}`
                          : "bg-muted/60 border-border/50";
                      statusText = cell.isToday
                        ? "Scheduled today (Pending)"
                        : "Scheduled";
                    }

                    return (
                      <div
                        key={cell.dateStr}
                        onMouseEnter={() =>
                          setHoveredDate({
                            dateStr: cell.dateStr,
                            formattedDate,
                            statusText,
                          })
                        }
                        onMouseLeave={() => setHoveredDate(null)}
                        className={cn(
                          "size-2.5 rounded-[2.5px] border transition-transform duration-100 hover:scale-125 hover:z-10 cursor-pointer",
                          cellBg
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Footer: Hover Info & Color Scale Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/30">
        <div className="h-4 flex items-center font-mono">
          {hoveredDate ? (
            <span className="animate-in fade-in-0 duration-100">
              <strong className="text-foreground font-sans">
                {hoveredDate.formattedDate}:
              </strong>{" "}
              {hoveredDate.statusText}
            </span>
          ) : (
            <span className="text-muted-foreground/60">
              Hover over cells to view history
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span
              className="size-2.5 rounded-[2.5px] bg-muted/40 border border-muted/60"
              title="Unscheduled / Empty"
            />
            <span
              className="size-2.5 rounded-[2.5px] bg-rose-500/25 border border-rose-500/40"
              title="Missed"
            />
            <span
              className={cn(
                "size-2.5 rounded-[2.5px] border",
                colorConfig.heatmapPending
              )}
              title="Scheduled / Pending"
            />
            <span
              className={cn(
                "size-2.5 rounded-[2.5px] border",
                colorConfig.heatmapCompleted
              )}
              title="Completed"
            />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ListTodo, ArrowUpRight, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskMetrics } from "@/features/dashboard/types";

interface TaskSnapshotCardProps {
  metrics: TaskMetrics;
}

export function TaskSnapshotCard({ metrics }: TaskSnapshotCardProps) {
  const completionRate =
    metrics.totalCount > 0
      ? Math.round((metrics.completedCount / metrics.totalCount) * 100)
      : 0;

  return (
    <Card className="h-full flex flex-col hover:border-primary/40 transition-colors group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ListTodo className="size-4" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Task Snapshot
          </CardTitle>
        </div>
        <Link
          href="/tasks"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
        >
          View All Tasks
          <ArrowUpRight className="size-3" />
        </Link>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-3.5 pt-2">
        <div className="space-y-3">
          {/* Core Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Circle className="size-3 text-primary" />
                <span>Open Tasks</span>
              </div>
              <div className="text-2xl font-bold font-heading">
                {metrics.openCount}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>Completed</span>
              </div>
              <div className="text-2xl font-bold font-heading">
                {metrics.completedCount}
              </div>
            </div>
          </div>

          {/* Overdue Alert Banner if any overdue tasks */}
          {metrics.overdueCount > 0 ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
              <div className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>
                  {metrics.overdueCount}{" "}
                  {metrics.overdueCount === 1 ? "task is" : "tasks are"} overdue
                </span>
              </div>
              <Link
                href="/tasks"
                className="px-2 py-0.5 rounded bg-rose-500/15 hover:bg-rose-500/25 font-semibold transition-colors shrink-0"
              >
                Review
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border border-border/40 text-xs text-muted-foreground">
              <span>Overdue status:</span>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                All on schedule
              </span>
            </div>
          )}

          {/* Progress Bar & Sub-metrics */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall Completion</span>
              <span className="font-semibold text-foreground font-mono">{completionRate}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Completed count footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2.5">
          <span>Completed:</span>
          <span className="font-medium text-foreground">
            {metrics.completedTodayCount} today • {metrics.completedThisWeekCount} this week
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

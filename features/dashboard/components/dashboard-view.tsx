import Link from "next/link";
import { Sparkles, Target, Timer, LogIn } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DashboardData } from "@/features/dashboard/types";
import { TodayFocusCard } from "./today-focus-card";
import { WeeklyFocusChart } from "./weekly-focus-chart";
import { TaskSnapshotCard } from "./task-snapshot-card";
import { HabitStreaksCard } from "./habit-streaks-card";
import { JournalActivityCard } from "./journal-activity-card";
import { QuickNavBar } from "./quick-nav-bar";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  data: DashboardData;
  error?: string;
}

export function DashboardView({ data, error }: DashboardViewProps) {
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Central Hub
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{todayFormatted}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
            Focus Workspace
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Calm, unified overview of your deep work, habit consistency, and daily reflections.
          </p>
        </div>

        {/* Quick Launcher Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/timer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 text-xs"
            )}
          >
            <Timer className="size-3.5 text-primary" />
            <span>Start Timer</span>
          </Link>
          <Link
            href="/focus-mode"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
            )}
          >
            <Target className="size-3.5" />
            <span>Enter Focus Mode</span>
          </Link>
        </div>
      </div>

      {/* Guest Notice (if not logged in) */}
      {data.isGuest && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Browsing in Guest Mode
              </p>
              <p className="text-xs text-muted-foreground">
                Sign in with Supabase to sync and persist your Pomodoro sessions, habit heatmaps, and tasks across devices.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "gap-1.5 text-xs shrink-0"
            )}
          >
            <LogIn className="size-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      )}

      {/* Optional Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Grid Section */}
      <div className="space-y-6">
        {/* Row 1: Focus Metrics & 7-Day Chart */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <TodayFocusCard metrics={data.focus} />
          </div>
          <div className="md:col-span-7">
            <WeeklyFocusChart data={data.focus.last7Days} />
          </div>
        </div>

        {/* Row 2: Habit Streaks & Task Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <HabitStreaksCard habits={data.habits} />
          </div>
          <div className="md:col-span-5">
            <TaskSnapshotCard metrics={data.tasks} />
          </div>
        </div>

        {/* Row 3: Journal Activity & Quick Nav */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6">
            <JournalActivityCard metrics={data.journal} />
          </div>
          <div className="md:col-span-6">
            <QuickNavBar />
          </div>
        </div>
      </div>
    </div>
  );
}

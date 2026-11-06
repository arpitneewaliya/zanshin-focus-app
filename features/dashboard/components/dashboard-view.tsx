"use client";

import Link from "next/link";
import { Sparkles, LogIn } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DashboardData } from "@/features/dashboard/types";
import { ZenBentoHeader } from "./zen-bento-header";
import { DeepWorkBento } from "./deep-work-bento";
import { HabitCadenceBento } from "./habit-cadence-bento";
import { TaskPriorityBento } from "./task-priority-bento";
import { ReflectionBento } from "./reflection-bento";
import { ZenAmbienceBento } from "./zen-ambience-bento";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  data: DashboardData;
  error?: string;
}

export function DashboardView({ data, error }: DashboardViewProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Dynamic Zen Bento Header */}
      <ZenBentoHeader isGuest={data.isGuest} userName={data.userName} />

      {/* Guest Notice (if not logged in) */}
      {data.isGuest && (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Browsing in Guest Mode
              </p>
              <p className="text-xs text-muted-foreground">
                Sign in with Supabase to sync your Pomodoro focus sessions, habit heatmaps, and tasks across devices.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "gap-1.5 text-xs shrink-0 rounded-lg px-3.5"
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

      {/* Bento Grid Layer 1: Deep Work Flow & Habit Cadence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <DeepWorkBento metrics={data.focus} />
        </div>
        <div className="lg:col-span-5">
          <HabitCadenceBento habits={data.habits} isGuest={data.isGuest} />
        </div>
      </div>

      {/* Bento Grid Layer 2: Priorities, Reflection, & Zen Ambience */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4">
          <TaskPriorityBento metrics={data.tasks} isGuest={data.isGuest} />
        </div>
        <div className="lg:col-span-5">
          <ReflectionBento metrics={data.journal} />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <ZenAmbienceBento />
        </div>
      </div>
    </div>
  );
}

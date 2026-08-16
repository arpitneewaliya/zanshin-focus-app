"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Timer,
  Flame,
  Target,
  Play,
  CheckCircle2,
  Circle,
  Volume2,
  Sparkles,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";

type PreviewTab = "dashboard" | "timer" | "habits" | "focus";

export function VisualCenterpiece() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("dashboard");

  return (
    <section className="relative my-8 sm:my-14 max-w-5xl mx-auto">
      {/* Outer Glow & Gradient Border */}
      <div className="p-1 sm:p-2 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-border/80 via-border/40 to-transparent shadow-2xl">
        {/* Browser Window Frame */}
        <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md overflow-hidden text-card-foreground shadow-xl">
          {/* Top Window Bar */}
          <div className="px-4 py-3 border-b border-border/50 bg-muted/40 flex flex-wrap items-center justify-between gap-3">
            {/* Window control dots */}
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-rose-500/80" />
              <span className="size-3 rounded-full bg-amber-500/80" />
              <span className="size-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-[11px] font-mono text-muted-foreground hidden sm:inline">
                zanshin-focus.app
              </span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1 bg-background/80 p-1 rounded-lg border border-border/60 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <LayoutDashboard className="size-3.5" />
                <span className="hidden md:inline">Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("timer")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "timer"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Timer className="size-3.5" />
                <span>Timer</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("habits")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "habits"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Flame className="size-3.5" />
                <span>Habits</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("focus")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "focus"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Target className="size-3.5" />
                <span className="hidden md:inline">Focus Mode</span>
              </button>
            </div>

            {/* Live Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Deep State</span>
            </div>
          </div>

          {/* Window Body with Animated Transitions */}
          <div className="p-4 sm:p-8 min-h-[360px] sm:min-h-[420px] flex items-center justify-center bg-background/50">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full space-y-4"
                >
                  {/* Top Row: Focus & Streaks stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="p-4 rounded-xl bg-card border border-border/70 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Today's Focus</span>
                        <Timer className="size-4 text-primary" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold font-heading">
                          2h 45m
                        </span>
                        <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                          +24% vs avg
                        </Badge>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[70%]" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border/70 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Active Streaks</span>
                        <Flame className="size-4 text-amber-500" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold font-heading">
                          14 Days
                        </span>
                        <span className="text-xs text-muted-foreground">Top: Reading</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        3 of 3 habits completed today
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border/70 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Tasks Resolved</span>
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold font-heading">
                          6 / 8
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">75% done</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        2 priority items remaining
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Simulated 7-day focus chart + Active Tasks */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                    {/* Simulated Focus Chart */}
                    <div className="sm:col-span-7 p-4 rounded-xl bg-card border border-border/70 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <TrendingUp className="size-3.5 text-primary" />
                          7-Day Focus Rhythm
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          Avg: 2h 10m/day
                        </span>
                      </div>
                      <div className="flex items-end justify-between gap-2 pt-4 h-24 sm:h-28">
                        {[
                          { day: "Mon", height: "55%", mins: "1h 50m" },
                          { day: "Tue", height: "80%", mins: "2h 40m" },
                          { day: "Wed", height: "45%", mins: "1h 30m" },
                          { day: "Thu", height: "90%", mins: "3h 00m" },
                          { day: "Fri", height: "70%", mins: "2h 20m" },
                          { day: "Sat", height: "35%", mins: "1h 10m" },
                          { day: "Sun", height: "85%", mins: "2h 45m", active: true },
                        ].map((bar, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                            <div
                              style={{ height: bar.height }}
                              className={`w-full rounded-md transition-all ${
                                bar.active
                                  ? "bg-primary shadow-sm"
                                  : "bg-muted-foreground/20 hover:bg-muted-foreground/35"
                              }`}
                            />
                            <span
                              className={`text-[10px] font-mono ${
                                bar.active ? "text-foreground font-bold" : "text-muted-foreground"
                              }`}
                            >
                              {bar.day}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Simulated Tasks Snapshot */}
                    <div className="sm:col-span-5 p-4 rounded-xl bg-card border border-border/70 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          Today's Focus Tasks
                        </span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                          High Priority
                        </Badge>
                      </div>
                      <div className="space-y-2 pt-1 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground line-through opacity-70">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">Draft architecture RFC</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground font-medium">
                          <Circle className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">Implement Pomodoro sound alerts</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Circle className="size-3.5 text-muted-foreground/50 shrink-0" />
                          <span className="truncate">Weekly review & journal notes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "timer" && (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full max-w-md mx-auto text-center space-y-6 py-4"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <span className="size-2 rounded-full bg-primary animate-ping" />
                    Deep Work Interval • Session 3 of 4
                  </div>

                  {/* Circular Timer Mockup */}
                  <div className="relative size-48 sm:size-56 mx-auto flex items-center justify-center rounded-full border-4 border-muted">
                    <svg className="absolute inset-0 size-full -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="44%"
                        className="stroke-primary"
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray="280"
                        strokeDashoffset="70"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="space-y-1">
                      <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight">
                        18:42
                      </span>
                      <p className="text-xs text-muted-foreground">Focusing on Core Logic</p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-2 shadow-sm">
                      <Play className="size-3.5 fill-current" />
                      Running
                    </div>
                    <div className="px-3 py-2 rounded-full border border-border/80 text-xs text-muted-foreground font-medium">
                      Skip to Break
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "habits" && (
                <motion.div
                  key="habits"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full space-y-4"
                >
                  <div className="p-4 rounded-xl bg-card border border-border/70 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-semibold text-foreground">
                          Morning Deep Reading
                        </span>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Daily • 30 mins
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                        <Flame className="size-3.5 fill-amber-500" />
                        <span>18 day streak</span>
                      </div>
                    </div>

                    {/* Simulated 20-week Heatmap Grid */}
                    <div className="pt-2">
                      <p className="text-[11px] text-muted-foreground mb-1.5 font-mono">
                        Consistency Matrix (Last 12 Weeks)
                      </p>
                      <div className="grid grid-flow-col grid-rows-4 gap-1.5 overflow-x-auto pb-1">
                        {Array.from({ length: 48 }).map((_, i) => {
                          const isHigh = i % 5 === 0;
                          const isMed = i % 3 === 0;
                          const isLow = i % 2 === 0;
                          const bg = isHigh
                            ? "bg-primary"
                            : isMed
                            ? "bg-primary/70"
                            : isLow
                            ? "bg-primary/35"
                            : "bg-muted/60";
                          return (
                            <div
                              key={i}
                              className={`size-3.5 sm:size-4 rounded-xs transition-colors ${bg}`}
                              title={`Scheduled day ${i + 1}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border/70 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-indigo-500" />
                        <span className="text-sm font-semibold text-foreground">
                          Code Kata / Algorithms
                        </span>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Mon / Wed / Fri
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                        <Flame className="size-3.5 fill-amber-500" />
                        <span>12 scheduled streak</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * Scheduled streak logic preserves momentum across non-scheduled rest days.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "focus" && (
                <motion.div
                  key="focus"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full max-w-lg mx-auto text-center space-y-6 py-2"
                >
                  <div className="space-y-1">
                    <p className="text-5xl sm:text-6xl font-mono font-light tracking-tight text-foreground">
                      14:48
                    </p>
                    <p className="text-xs text-muted-foreground tracking-widest uppercase font-mono">
                      Restful Immersion • Do Not Disturb
                    </p>
                  </div>

                  {/* Ambient sound mixer sliders preview */}
                  <div className="p-4 rounded-xl bg-card border border-border/70 shadow-xs text-left space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="size-3.5 text-primary" />
                        Layered Ambient Audio Mixer
                      </span>
                      <span className="font-mono text-[10px] text-emerald-500">Playing</span>
                    </div>

                    <div className="space-y-2.5 pt-1 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span>Soft Rain & Thunder</span>
                          <span className="font-mono text-muted-foreground">65%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-[65%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span>Pine Forest Wind</span>
                          <span className="font-mono text-muted-foreground">40%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary/80 rounded-full w-[40%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

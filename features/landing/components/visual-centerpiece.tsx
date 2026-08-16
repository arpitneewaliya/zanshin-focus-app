"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Timer,
  ListTodo,
  Flame,
  BookOpen,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const previewTabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    route: "zanshin-focus.app/dashboard",
    alt: "Zanshin Focus Dashboard Workspace Preview",
    darkImage: "/images/dashboard-preview-dark.png",
    lightImage: "/images/dashboard-preview-light.png",
  },
  {
    id: "timer",
    label: "Pomodoro Timer",
    shortLabel: "Timer",
    icon: Timer,
    route: "zanshin-focus.app/timer",
    alt: "Zanshin Focus Pomodoro Timer Preview",
    darkImage: "/images/timer-preview-dark.png",
    lightImage: "/images/timer-preview-light.png",
  },
  {
    id: "tasks",
    label: "Task Manager",
    shortLabel: "Tasks",
    icon: ListTodo,
    route: "zanshin-focus.app/tasks",
    alt: "Zanshin Focus Task Manager Preview",
    darkImage: "/images/tasks-preview-dark.png",
    lightImage: "/images/tasks-preview-light.png",
  },
  {
    id: "habits",
    label: "Habit Tracker",
    shortLabel: "Habits",
    icon: Flame,
    route: "zanshin-focus.app/habit-tracker",
    alt: "Zanshin Focus Habit Tracker Preview",
    darkImage: "/images/habits-preview-dark.png",
    lightImage: "/images/habits-preview-light.png",
  },
  {
    id: "journal",
    label: "Personal Journal",
    shortLabel: "Journal",
    icon: BookOpen,
    route: "zanshin-focus.app/journal",
    alt: "Zanshin Focus Personal Journal Preview",
    darkImage: "/images/journal-preview-dark.png",
    lightImage: "/images/journal-preview-light.png",
  },
  {
    id: "focus-mode",
    label: "Focus Sanctuary",
    shortLabel: "Focus Mode",
    icon: Target,
    route: "zanshin-focus.app/focus-mode",
    alt: "Zanshin Focus Sanctuary Mode Preview",
    darkImage: "/images/focus-mode-preview-dark.png",
    lightImage: "/images/focus-mode-preview-light.png",
  },
];

export function VisualCenterpiece() {
  const [activeTabId, setActiveTabId] = useState("dashboard");

  const currentTab =
    previewTabs.find((t) => t.id === activeTabId) || previewTabs[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative my-8 sm:my-14 max-w-5xl mx-auto space-y-4"
    >
      {/* Outer ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-primary/5 rounded-3xl blur-3xl pointer-events-none -z-10" />

      {/* Interactive Tabs Selector */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-1 px-1 no-scrollbar gap-1.5 sm:gap-2">
        <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/60 shadow-xs backdrop-blur-sm">
          {previewTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-background text-foreground shadow-xs font-semibold border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel || tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame wrapper with gradient border and shadow */}
      <div className="p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-border/90 via-border/50 to-border/20 shadow-2xl">
        <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md overflow-hidden text-card-foreground shadow-xl">
          {/* Top Window Chrome */}
          <div className="px-4 py-3 border-b border-border/50 bg-muted/40 flex items-center justify-between gap-3">
            {/* Window control dots */}
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-rose-500/80" />
              <span className="size-3 rounded-full bg-amber-500/80" />
              <span className="size-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Address / Route badge */}
            <div className="px-3 py-1 rounded-md bg-background/80 border border-border/60 text-[11px] font-mono text-muted-foreground flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              <span>{currentTab.route}</span>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Active Preview</span>
            </div>
          </div>

          {/* Screenshot Display with Smooth Transition */}
          <div className="relative w-full bg-background/40 overflow-hidden min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full"
              >
                {/* Dark Mode Screenshot */}
                <Image
                  src={currentTab.darkImage}
                  alt={`${currentTab.alt} (Dark Mode)`}
                  width={1920}
                  height={1080}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1024px"
                  className="w-full h-auto object-cover object-top hidden dark:block"
                />

                {/* Light Mode Screenshot */}
                <Image
                  src={currentTab.lightImage}
                  alt={`${currentTab.alt} (Light Mode)`}
                  width={1920}
                  height={1080}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1024px"
                  className="w-full h-auto object-cover object-top block dark:hidden"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

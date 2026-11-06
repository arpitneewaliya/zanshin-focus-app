"use client";

import Image from "next/image";
import { useState } from "react";
import { BookOpen, Flame, LayoutDashboard, ListTodo, Target, Timer } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const previewTabs = [
  { id: "dashboard", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard, route: "dashboard", title: "See the shape of your day.", description: "A quiet overview connects today’s focus, priorities, habits, and reflection without demanding your attention.", darkImage: "/images/dashboard-preview-dark.png", lightImage: "/images/dashboard-preview-light.png", width: 1518, height: 1018 },
  { id: "timer", label: "Pomodoro", shortLabel: "Timer", icon: Timer, route: "timer", title: "Protect time for what matters.", description: "Build a sustainable cadence with a timer designed for deep work, deliberate breaks, and a visible sense of progress.", darkImage: "/images/timer-preview-dark.png", lightImage: "/images/timer-preview-light.png", width: 1472, height: 996 },
  { id: "tasks", label: "Tasks", shortLabel: "Tasks", icon: ListTodo, route: "tasks", title: "Turn intention into a next step.", description: "Keep priorities clear with calm task capture, due dates, and just enough structure to move forward.", darkImage: "/images/tasks-preview-dark.png", lightImage: "/images/tasks-preview-light.png", width: 1480, height: 1014 },
  { id: "habits", label: "Habits", shortLabel: "Habits", icon: Flame, route: "habit-tracker", title: "Let momentum be honest.", description: "Scheduled streaks and heatmaps show progress without punishing the days you intentionally leave open.", darkImage: "/images/habits-preview-dark.png", lightImage: "/images/habits-preview-light.png", width: 1468, height: 1003 },
  { id: "journal", label: "Journal", shortLabel: "Journal", icon: BookOpen, route: "journal", title: "Leave space to reflect.", description: "Capture the thinking behind your work in a focused Markdown journal that is easy to revisit.", darkImage: "/images/journal-preview-dark.png", lightImage: "/images/journal-preview-light.png", width: 1479, height: 1008 },
  { id: "focus-mode", label: "Sanctuary", shortLabel: "Focus", icon: Target, route: "focus-mode", title: "Enter a room made for focus.", description: "A full-screen sanctuary combines a minimal clock with immersive ambient soundscapes.", darkImage: "/images/focus-mode-preview-dark.png", lightImage: "/images/focus-mode-preview-light.png", width: 1337, height: 1079 },
] as const;

export function VisualCenterpiece() {
  const [activeTabId, setActiveTabId] = useState<(typeof previewTabs)[number]["id"]>("dashboard");
  const reduceMotion = useReducedMotion();
  const currentTab = previewTabs.find((tab) => tab.id === activeTabId) ?? previewTabs[0];

  return (
    <section id="workspace" aria-labelledby="workspace-title" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <span className="zen-kicker"><span className="size-1.5 rounded-full bg-[var(--zen-indigo)]" />One workspace, five practices</span>
        <h2 id="workspace-title" className="font-display text-4xl tracking-[-0.035em] sm:text-5xl">A calmer way to move through your work.</h2>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">Plan with intention, focus without friction, and reflect without switching between scattered tools.</p>
      </div>
      <div className="mt-9 flex justify-start overflow-x-auto pb-2 sm:justify-center">
        <div role="tablist" aria-label="Product workspace previews" className="zen-panel flex min-w-max gap-1 rounded-2xl p-1.5">
          {previewTabs.map((tab) => { const Icon = tab.icon; const isActive = tab.id === activeTabId; return <button key={tab.id} type="button" role="tab" aria-selected={isActive} aria-controls="workspace-preview" onClick={() => setActiveTabId(tab.id)} className={`zen-focus-ring flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${isActive ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-3.5" /><span className="hidden sm:inline">{tab.label}</span><span className="sm:hidden">{tab.shortLabel}</span></button>; })}
        </div>
      </div>
      <div className="mt-6 grid items-center gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <AnimatePresence mode="wait"><motion.div key={currentTab.id} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="order-2 space-y-4 px-1 lg:order-1 lg:px-6"><p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--zen-tea)]">/{currentTab.route}</p><h3 className="font-display text-3xl tracking-[-0.03em] sm:text-4xl">{currentTab.title}</h3><p className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">{currentTab.description}</p></motion.div></AnimatePresence>
        <div id="workspace-preview" role="tabpanel" className="order-1 overflow-hidden rounded-2xl border border-border/70 bg-card p-1.5 shadow-[0_24px_60px_-34px_color-mix(in_oklch,var(--foreground)_58%,transparent)] lg:order-2 sm:rounded-3xl sm:p-2">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-background sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/35 px-4 py-3"><span className="font-mono text-[10px] text-muted-foreground">zanshin.focus/{currentTab.route}</span><span className="flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--zen-tea)]"><span className="size-1.5 rounded-full bg-[var(--zen-tea)]" />PREVIEW</span></div>
            <AnimatePresence mode="wait"><motion.div key={currentTab.id} initial={reduceMotion ? false : { opacity: 0, scale: 0.995 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 0.995 }} transition={{ duration: 0.2 }}><Image src={currentTab.lightImage} alt={`${currentTab.title} Zanshin Focus workspace preview in light mode`} width={currentTab.width} height={currentTab.height} sizes="(max-width: 1024px) 100vw, 65vw" className="block h-auto w-full dark:hidden" /><Image src={currentTab.darkImage} alt={`${currentTab.title} Zanshin Focus workspace preview in dark mode`} width={currentTab.width} height={currentTab.height} sizes="(max-width: 1024px) 100vw, 65vw" className="hidden h-auto w-full dark:block" /></motion.div></AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

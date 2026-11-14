"use client";

import Image from "next/image";
import { useState } from "react";
import { BookOpen, Flame, LayoutDashboard, ListTodo, Target, Timer } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const previewTabs = [
  { id: "dashboard", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard, route: "dashboard", title: "See the shape of your day.", description: "A quiet overview connects today’s focus, priorities, habits, and reflection without demanding your attention.", darkImage: "/images/dashboard-preview-dark1.png", lightImage: "/images/dashboard-preview-light1.png", width: 1518, height: 1018 },
  { id: "timer", label: "Pomodoro", shortLabel: "Timer", icon: Timer, route: "timer", title: "Protect time for what matters.", description: "Build a sustainable cadence with a timer designed for deep work, deliberate breaks, and a visible sense of progress.", darkImage: "/images/timer-preview-dark.png", lightImage: "/images/timer-preview-light.png", width: 1472, height: 996 },
  { id: "tasks", label: "Tasks", shortLabel: "Tasks", icon: ListTodo, route: "tasks", title: "Turn intention into a next step.", description: "Keep priorities clear with calm task capture, due dates, and just enough structure to move forward.", darkImage: "/images/tasks-preview-dark1.png", lightImage: "/images/tasks-preview-light1.png", width: 1480, height: 1014 },
  { id: "habits", label: "Habits", shortLabel: "Habits", icon: Flame, route: "habit-tracker", title: "Let momentum be honest.", description: "Scheduled streaks and heatmaps show progress without punishing the days you intentionally leave open.", darkImage: "/images/habits-preview-dark1.png", lightImage: "/images/habits-preview-light1.png", width: 1468, height: 1003 },
  { id: "journal", label: "Journal", shortLabel: "Journal", icon: BookOpen, route: "journal", title: "Leave space to reflect.", description: "Capture the thinking behind your work in a focused Markdown journal that is easy to revisit.", darkImage: "/images/journal-preview-dark1.png", lightImage: "/images/journal-preview-light1.png", width: 1479, height: 1008 },
  { id: "focus-mode", label: "Sanctuary", shortLabel: "Focus", icon: Target, route: "focus-mode", title: "Enter a room made for focus.", description: "A full-screen sanctuary combines a minimal clock with immersive ambient soundscapes.", darkImage: "/images/focus-mode-preview-dark1.png", lightImage: "/images/focus-mode-preview-light1.png", width: 1337, height: 1079 },
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
          {previewTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="workspace-preview"
                onClick={() => setActiveTabId(tab.id)}
                className={`zen-focus-ring relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="workspace-active-tab"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 32 }
                    }
                    className="absolute inset-0 -z-10 rounded-xl bg-foreground shadow-sm"
                  />
                )}
                <Icon className="size-3.5 relative z-10" />
                <span className="hidden sm:inline relative z-10">{tab.label}</span>
                <span className="sm:hidden relative z-10">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-3xl border border-border/70 p-4 shadow-2xl sm:rounded-[2rem] sm:p-8 lg:p-10">
        {/* Framed Painterly Misty Valley Stage */}
        <div className="pointer-events-none absolute inset-0 -z-10 select-none" aria-hidden="true">
          <Image
            src="/images/backgrounds/zen-showcase-mist.jpg"
            alt=""
            fill
            sizes="(max-width: 1200px) 100vw, 1152px"
            className="object-cover object-center opacity-80 dark:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/65 via-background/45 to-background/85 dark:from-background/55 dark:via-background/35 dark:to-background/80" />
          <div className="zen-grain absolute inset-0" />
        </div>

        <div className="space-y-6 sm:space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 rounded-2xl border border-white/50 bg-background/65 px-5 py-4 backdrop-blur-md dark:border-white/10 dark:bg-background/55 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
            >
              <div className="space-y-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--zen-tea)]">
                  /{currentTab.route}
                </p>
                <h3 className="font-display text-2xl tracking-[-0.03em] sm:text-3xl">
                  {currentTab.title}
                </h3>
              </div>
              <p className="max-w-lg text-sm leading-6 text-foreground/80 dark:text-muted-foreground sm:text-[15px]">
                {currentTab.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div id="workspace-preview" role="tabpanel" className="zen-glass-bezel overflow-hidden">
            <div className="overflow-hidden rounded-xl border border-border/70 bg-background/95 shadow-xl sm:rounded-2xl">
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/35 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
                    <span className="size-2 rounded-full bg-foreground/20" />
                    <span className="size-2 rounded-full bg-foreground/20" />
                    <span className="size-2 rounded-full bg-foreground/20" />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    zanshin.focus/{currentTab.route}
                  </span>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--zen-tea)]">
                  <span className="size-1.5 rounded-full bg-[var(--zen-tea)]" />
                  PREVIEW
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab.id}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.995 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.995 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={currentTab.lightImage}
                    alt={`${currentTab.title} Zanshin Focus workspace preview in light mode`}
                    width={currentTab.width}
                    height={currentTab.height}
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="block h-auto w-full dark:hidden"
                  />
                  <Image
                    src={currentTab.darkImage}
                    alt={`${currentTab.title} Zanshin Focus workspace preview in dark mode`}
                    width={currentTab.width}
                    height={currentTab.height}
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="hidden h-auto w-full dark:block"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

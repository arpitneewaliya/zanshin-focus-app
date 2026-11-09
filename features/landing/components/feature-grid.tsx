"use client";

import Image from "next/image";
import { BookOpen, CheckCircle2, Flame, Headphones, ListTodo, Timer } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const compactFeatures = [
  { icon: Flame, eyebrow: "Scheduled momentum", title: "Habits that honour rest days.", description: "Visual heatmaps and scheduled streaks show the progress you have actually made.", accent: "text-[color:var(--zen-tea)]" },
  { icon: BookOpen, eyebrow: "Room to reflect", title: "A journal that stays out of the way.", description: "Capture notes in Markdown, then return to a calm history of the work behind your work.", accent: "text-[color:var(--zen-indigo)]" },
  { icon: Headphones, eyebrow: "Deep-focus atmosphere", title: "A sanctuary when you need one.", description: "Full-screen focus mode, quiet clocks, and ambient soundscapes help the outside world recede.", accent: "text-[color:var(--zen-tea)]" },
];

function PreviewImage({ light, dark, alt, width, height }: { light: string; dark: string; alt: string; width: number; height: number }) {
  return <div className="mt-5 overflow-hidden rounded-xl border border-border/70 bg-background"><Image src={light} alt={`${alt} in light mode`} width={width} height={height} sizes="(max-width: 768px) 100vw, 48vw" className="block h-auto w-full dark:hidden" /><Image src={dark} alt={`${alt} in dark mode`} width={width} height={height} sizes="(max-width: 768px) 100vw, 48vw" className="hidden h-auto w-full dark:block" /></div>;
}

export function FeatureGrid() {
  const reduceMotion = useReducedMotion();
  return (
    <section aria-labelledby="practices-title" className="py-14 sm:py-20">
      <div className="mx-auto max-w-2xl space-y-4 text-center"><span className="zen-kicker"><span className="size-1.5 rounded-full bg-[var(--zen-tea)]" />Built around a complete practice</span><h2 id="practices-title" className="font-display text-4xl tracking-[-0.035em] sm:text-5xl">From a clear next step to a considered finish.</h2></div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <motion.article initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4 }} className="zen-panel overflow-hidden rounded-3xl p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--zen-indigo)]">Set your cadence</p><h3 className="mt-3 font-display text-3xl tracking-[-0.03em]">Focus sessions with a pulse.</h3></div><span className="rounded-xl bg-[color:color-mix(in_oklch,var(--zen-indigo)_12%,transparent)] p-3 text-[color:var(--zen-indigo)]"><Timer className="size-5" /></span></div><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">A Pomodoro engine that makes deep-work intervals and restorative breaks feel like one continuous rhythm.</p><PreviewImage light="/images/timer-preview-light.png" dark="/images/timer-preview-dark.png" alt="Zanshin Focus Pomodoro timer" width={1466} height={1014} /></motion.article>
        <motion.article initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.08 }} className="zen-panel overflow-hidden rounded-3xl p-5 sm:p-7 lg:mt-12">
          <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--zen-tea)]">Make the next step visible</p><h3 className="mt-3 font-display text-3xl tracking-[-0.03em]">Tasks with less mental noise.</h3></div><span className="rounded-xl bg-[color:color-mix(in_oklch,var(--zen-tea)_13%,transparent)] p-3 text-[color:var(--zen-tea)]"><ListTodo className="size-5" /></span></div><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Priorities, due dates, and completion stay close enough to guide your day—without becoming another distraction.</p><PreviewImage light="/images/tasks-preview-light1.png" dark="/images/tasks-preview-dark1.png" alt="Zanshin Focus task manager" width={1499} height={1015} /></motion.article>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {compactFeatures.map((feature, index) => { const Icon = feature.icon; return <motion.article key={feature.title} initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.08 }} className="zen-panel rounded-2xl p-5 sm:p-6"><div className={`flex size-10 items-center justify-center rounded-xl bg-muted ${feature.accent}`}><Icon className="size-5" /></div><p className={`mt-6 font-mono text-[10px] uppercase tracking-[0.15em] ${feature.accent}`}>{feature.eyebrow}</p><h3 className="mt-2 text-base font-semibold tracking-tight">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p><div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className={`size-3.5 ${feature.accent}`} />Thoughtful by design</div></motion.article>; })}
      </div>
    </section>
  );
}

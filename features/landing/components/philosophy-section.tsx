"use client";

import { Compass, Sparkles, Target } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const pillars = [
  { number: "01", icon: Compass, label: "Calm", title: "Begin with relaxed alertness.", description: "Zanshin is sustained, composed awareness. The interface makes space for that state before the work begins." },
  { number: "02", icon: Target, label: "Focus", title: "Keep the work in one place.", description: "Timer, priorities, habit practice, and notes work together so you do not have to reconstruct your context." },
  { number: "03", icon: Sparkles, label: "Reflect", title: "Let progress feel human.", description: "Honest streak logic and quiet reflection make room for rest, learning, and a more sustainable pace." },
];

export function PhilosophySection() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="scroll-mt-24 border-y border-border/60 py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="space-y-5 lg:sticky lg:top-28 lg:self-start"><span className="zen-kicker"><Sparkles className="size-3 text-[color:var(--zen-indigo)]" />The philosophy of Zanshin</span><h2 id="philosophy-title" className="font-display text-4xl tracking-[-0.035em] sm:text-5xl">A rhythm for work that still leaves room to breathe.</h2><p className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">Productivity is not about carrying more. It is about giving the work that matters your full, undivided attention.</p></div>
        <div className="relative space-y-4 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-px before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent sm:before:left-8">
          {pillars.map((pillar, index) => { const Icon = pillar.icon; return <motion.article key={pillar.number} initial={reduceMotion ? false : { opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.08 }} className="zen-panel relative grid grid-cols-[3rem_1fr] gap-4 rounded-2xl border border-border/60 bg-card/55 p-4 backdrop-blur-sm transition-colors hover:border-border sm:grid-cols-[4rem_1fr] sm:gap-5 sm:p-5"><div className="relative z-10 flex size-12 flex-col items-center justify-center rounded-2xl border border-border/80 bg-background/90 shadow-sm sm:size-16"><span className="font-mono text-[10px] text-muted-foreground">{pillar.number}</span><Icon className="mt-1 size-4 text-[color:var(--zen-indigo)]" /></div><div className="pt-1"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--zen-tea)]">{pillar.label}</p><h3 className="mt-1 text-lg font-semibold tracking-tight">{pillar.title}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{pillar.description}</p></div></motion.article>; })}
        </div>
      </div>
    </section>
  );
}

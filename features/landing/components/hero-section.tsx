"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const signals = ["One quiet workspace", "Five focused tools", "No clutter"];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative grid items-center gap-10 pb-16 pt-5 sm:pb-24 sm:pt-12 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12">
      <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }} className="relative z-10 max-w-2xl space-y-6 text-center lg:text-left">
        <div className="zen-kicker"><span className="size-1.5 rounded-full bg-[var(--zen-tea)] shadow-[0_0_0_4px_color-mix(in_oklch,var(--zen-tea)_14%,transparent)]" /><span>残心 · A mindful focus workspace</span></div>
        <div className="space-y-5">
          <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl">Make room for<span className="block italic text-[color:var(--zen-indigo)] dark:text-indigo-300"> your best attention.</span></h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0">Zanshin brings your focus sessions, tasks, habits, and reflections into one calm rhythm—so your most important work can stay in view.</p>
        </div>
        <div className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "zen-focus-ring h-12 gap-2 rounded-full px-6 text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5")}>Start focusing free <ArrowRight className="size-4" /></Link>
          <a href="#workspace" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "zen-focus-ring h-12 rounded-full border-border/80 px-6 text-sm font-medium")}>Explore the workspace</a>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-2 text-xs text-muted-foreground lg:justify-start" aria-label="Product highlights">
          {signals.map((signal) => <li key={signal} className="flex items-center gap-1.5"><Check className="size-3.5 text-[var(--zen-tea)]" />{signal}</li>)}
        </ul>
      </motion.div>

      <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.1, ease: "easeOut" }} className="relative mx-auto w-full max-w-2xl lg:max-w-none">
        <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_45%_45%,color-mix(in_oklch,var(--zen-indigo)_20%,transparent),transparent_66%)] blur-2xl" />
        <div className="zen-panel overflow-hidden rounded-2xl p-1.5 sm:rounded-3xl sm:p-2">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-background sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/35 px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true"><span className="size-2.5 rounded-full bg-rose-400/80" /><span className="size-2.5 rounded-full bg-amber-400/80" /><span className="size-2.5 rounded-full bg-[var(--zen-tea)]/80" /></div>
              <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 font-mono text-[10px] text-muted-foreground sm:flex"><Sparkles className="size-3 text-[var(--zen-indigo)]" />Your focus, in view</div>
              <span className="font-mono text-[10px] text-[var(--zen-tea)]">LIVE SPACE</span>
            </div>
            <Image src="/images/dashboard-preview-light.png" alt="Zanshin Focus dashboard showing focus, task, habit, and reflection summaries in light mode" width={1499} height={1024} priority sizes="(max-width: 1024px) 100vw, 54vw" className="block h-auto w-full dark:hidden" />
            <Image src="/images/dashboard-preview-dark.png" alt="Zanshin Focus dashboard showing focus, task, habit, and reflection summaries in dark mode" width={1518} height={1018} priority sizes="(max-width: 1024px) 100vw, 54vw" className="hidden h-auto w-full dark:block" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

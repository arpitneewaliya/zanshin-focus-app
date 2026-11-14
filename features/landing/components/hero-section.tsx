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
    <section className="zen-full-bleed relative -mt-8 overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-20">
      {/* Full-Bleed Painterly Horizon Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none" aria-hidden="true">
        <Image
          src="/images/backgrounds/zen-hero-horizon.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.01] object-cover object-center opacity-85 dark:opacity-75"
        />
        {/* Upper-center radial readability scrim */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_26%,color-mix(in_oklch,var(--background)_80%,transparent),color-mix(in_oklch,var(--background)_35%,transparent)_65%,transparent)]" />
        {/* Vertical vignette fade into page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/35 to-background" />
        {/* Side edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,var(--background)_100%)] opacity-60" />
        {/* Subtle tactile film grain */}
        <div className="zen-grain absolute inset-0" />
      </div>

      {/* Centered Monumental Editorial Content */}
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 mx-auto max-w-3xl space-y-6 text-center"
        >
          <div className="zen-kicker mx-auto">
            <span className="size-1.5 rounded-full bg-[var(--zen-tea)] shadow-[0_0_0_4px_color-mix(in_oklch,var(--zen-tea)_14%,transparent)]" />
            <span>残心 · A mindful focus workspace</span>
          </div>

          <div className="space-y-5">
            <h1 className="font-display text-5xl leading-[0.96] tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl lg:text-[4.75rem]">
              Make room for
              <span className="block italic text-[color:var(--zen-indigo)] dark:text-indigo-300">
                your best attention.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-foreground/80 dark:text-muted-foreground sm:text-lg sm:leading-8">
              Zanshin brings your focus sessions, tasks, habits, and reflections into one calm rhythm—so your most important work can stay in view.
            </p>
          </div>

          <div className="flex flex-col items-stretch justify-center gap-3 pt-1 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "zen-focus-ring h-12 gap-2 rounded-full px-7 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
              )}
            >
              Start focusing free <ArrowRight className="size-4" />
            </Link>
            <a
              href="#workspace"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "zen-focus-ring h-12 rounded-full border-border/80 bg-background/65 px-7 text-sm font-medium backdrop-blur-md hover:bg-background/85"
              )}
            >
              Explore the workspace
            </a>
          </div>

          <ul
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 text-xs text-foreground/75 dark:text-muted-foreground"
            aria-label="Product highlights"
          >
            {signals.map((signal) => (
              <li key={signal} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-[var(--zen-tea)]" />
                {signal}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Wide Glass-Bezel Product Preview */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.12, ease: "easeOut" }}
          className="relative mx-auto mt-12 w-full max-w-5xl sm:mt-16"
        >
          <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_50%_30%,color-mix(in_oklch,var(--zen-indigo)_24%,transparent),color-mix(in_oklch,var(--zen-tea)_12%,transparent)_45%,transparent_72%)] blur-2xl" />
          <div className="zen-glass-bezel overflow-hidden">
            <div className="overflow-hidden rounded-xl border border-border/70 bg-background/95 shadow-xl sm:rounded-2xl">
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/35 px-4 py-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-rose-400/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-[var(--zen-tea)]/80" />
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3.5 py-1 font-mono text-[10px] text-muted-foreground sm:flex">
                  <Sparkles className="size-3 text-[var(--zen-indigo)]" />
                  zanshin.focus/dashboard — Your focus, in view
                </div>
                <span className="font-mono text-[10px] tracking-wider text-[var(--zen-tea)]">
                  LIVE SANCTUARY
                </span>
              </div>
              <Image
                src="/images/dashboard-preview-light1.png"
                alt="Zanshin Focus dashboard showing focus, task, habit, and reflection summaries in light mode"
                width={1499}
                height={1024}
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="block h-auto w-full dark:hidden"
              />
              <Image
                src="/images/dashboard-preview-dark1.png"
                alt="Zanshin Focus dashboard showing focus, task, habit, and reflection summaries in dark mode"
                width={1518}
                height={1018}
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="hidden h-auto w-full dark:block"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="py-16 sm:py-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="relative isolate overflow-hidden rounded-3xl border border-white/60 px-6 py-14 text-center shadow-[0_28px_80px_-40px_color-mix(in_oklch,var(--zen-indigo)_55%,transparent)] sm:px-12 sm:py-20 dark:border-white/12"
      >
        {/* Painterly Dawn Horizon Backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10 select-none" aria-hidden="true">
          <Image
            src="/images/backgrounds/zen-cta-dawn.jpg"
            alt=""
            fill
            sizes="(max-width: 1200px) 100vw, 1152px"
            className="object-cover object-center opacity-85 dark:opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/85 dark:from-background/35 dark:via-background/55 dark:to-background/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,color-mix(in_oklch,var(--background)_75%,transparent),transparent_75%)]" />
          <div className="zen-grain absolute inset-0" />
        </div>

        <div className="relative mx-auto max-w-2xl space-y-5">
          <span className="zen-kicker">
            <span className="size-1.5 rounded-full bg-[var(--zen-tea)]" />
            A quieter way forward
          </span>
          <h2 className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">
            Ready to make space for focused work?
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-7 text-foreground/80 dark:text-muted-foreground sm:text-base">
            Start with one workspace for your priorities, your rhythm, and the reflections that help you return tomorrow.
          </p>
          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "zen-focus-ring h-12 gap-2 rounded-full px-7 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
              )}
            >
              Create your free account <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "zen-focus-ring h-12 rounded-full border-border/70 bg-background/65 px-6 text-sm font-medium backdrop-blur-md hover:bg-background/85"
              )}
            >
              Sign in
            </Link>
          </div>
          <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-foreground/75 dark:text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-[color:var(--zen-tea)]" />
            A complete workspace, ready when you are.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

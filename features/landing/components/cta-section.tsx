"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="py-16 sm:py-24">
      <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45 }} className="relative overflow-hidden rounded-3xl border border-[color:color-mix(in_oklch,var(--zen-indigo)_25%,var(--border))] bg-[linear-gradient(135deg,color-mix(in_oklch,var(--zen-indigo)_13%,transparent),transparent_50%,color-mix(in_oklch,var(--zen-tea)_10%,transparent))] px-6 py-12 text-center shadow-[0_24px_70px_-40px_color-mix(in_oklch,var(--zen-indigo)_60%,transparent)] sm:px-12 sm:py-16">
        <div className="absolute -right-20 -top-20 size-64 rounded-full border border-[color:color-mix(in_oklch,var(--zen-indigo)_24%,transparent)]" /><div className="absolute -bottom-24 -left-12 size-56 rounded-full bg-[color:color-mix(in_oklch,var(--zen-tea)_12%,transparent)] blur-3xl" />
        <div className="relative mx-auto max-w-2xl space-y-5"><span className="zen-kicker"><span className="size-1.5 rounded-full bg-[var(--zen-tea)]" />A quieter way forward</span><h2 className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">Ready to make space for focused work?</h2><p className="mx-auto max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">Start with one workspace for your priorities, your rhythm, and the reflections that help you return tomorrow.</p><div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row"><Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "zen-focus-ring h-12 gap-2 rounded-full px-7 text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5")}>Create your free account <ArrowRight className="size-4" /></Link><Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "zen-focus-ring h-12 rounded-full px-6 text-sm font-medium")}>Sign in</Link></div><p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground"><CheckCircle2 className="size-3.5 text-[color:var(--zen-tea)]" />A complete workspace, ready when you are.</p></div>
      </motion.div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="py-12 sm:py-16 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative rounded-2xl sm:rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-lg"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading text-foreground">
            Ready to reclaim your attention?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Create your account today and experience a minimalist workspace built for deep, purposeful momentum.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full sm:w-auto gap-2 px-8 h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all cursor-pointer group"
            )}
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto px-6 h-11 text-sm font-medium border-border/80 hover:bg-muted/60 transition-colors cursor-pointer"
            )}
          >
            <span>Sign In</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground pt-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="size-3.5 text-emerald-500" />
            <span>Free to use</span>
          </div>
          <span className="text-muted-foreground/30">•</span>
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-primary" />
            <span>Encrypted cloud sync via Supabase</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

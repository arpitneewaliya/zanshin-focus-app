"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, LogIn } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-16 text-center space-y-6 max-w-4xl mx-auto">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <Badge
          variant="outline"
          className="gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border-primary/20 bg-background/80 backdrop-blur-sm shadow-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground">残心 Zanshin</span>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-foreground font-medium">Unified Focus Workspace</span>
        </Badge>
      </motion.div>

      {/* Primary Headline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="space-y-4"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-heading leading-[1.1] text-foreground">
          Calm depth for your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">
            most important work
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A minimalist productivity sanctuary harmonizing Pomodoro intervals, task
          priorities, streak heatmaps, and markdown journaling into one distraction-free interface.
        </p>
      </motion.div>

      {/* Call to Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
      >
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "w-full sm:w-auto gap-2 px-7 h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all cursor-pointer group"
          )}
        >
          <span>Start Focusing Free</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full sm:w-auto gap-2 px-6 h-11 text-sm font-medium border-border/80 hover:bg-muted/60 transition-colors cursor-pointer"
          )}
        >
          <LogIn className="h-4 w-4 text-muted-foreground" />
          <span>Sign In</span>
        </Link>
      </motion.div>

      {/* Value badges micro-row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" />
          <span>Zero Bloat</span>
        </div>
        <span className="text-muted-foreground/30">•</span>
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span>True Streak Heatmaps</span>
        </div>
        <span className="text-muted-foreground/30">•</span>
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-primary" />
          <span>Ambient Audio Soundscapes</span>
        </div>
      </motion.div>
    </section>
  );
}

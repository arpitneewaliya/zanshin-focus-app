"use client";

import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Compass, Zap, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const pillars = [
  {
    number: "01",
    icon: Compass,
    title: "Relaxed Alertness",
    description:
      "In martial arts, Zanshin (残心) refers to sustained, calm awareness before, during, and after an action. We build software that respects your calm rather than hijacking your dopamine.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Zero Context-Switching",
    description:
      "Juggling disconnected note apps, timers, task lists, and habit trackers creates micro-distractions. Zanshin connects all four seamlessly into one cohesive rhythm.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Honest Streak Logic",
    description:
      "Habits configured for 3 days a week shouldn't break your streak on Tuesday and Thursday. Our scheduled streak engine honors rest days without guilt.",
  },
];

export function PhilosophySection() {
  return (
    <section className="py-12 sm:py-16 space-y-10 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-muted/60 text-muted-foreground border border-border/60">
          <Sparkles className="size-3 text-primary" />
          The Philosophy of Zanshin
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading text-foreground">
          Built for clarity, speed, and deep concentration.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Productivity isn't about cramming more tasks into your day. It's about bringing complete presence and care to what truly matters.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            >
              <Card className="h-full border-border/70 bg-card/60 hover:bg-card hover:border-primary/40 transition-all duration-200 shadow-xs">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-muted-foreground/60">
                      {pillar.number}
                    </span>
                    <Icon className="size-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight">
                    {pillar.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import {
  Timer,
  ListTodo,
  Flame,
  BookOpen,
  Target,
  Clock,
  Sparkles,
  Headphones,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Timer,
    title: "Pomodoro Engine",
    badge: "Interval Cadence",
    description:
      "Structured deep work cycles with customizable work, short break, and long break intervals. Includes audio chimes and continuous session counting.",
    highlights: ["Customizable durations", "Sound notifications", "Daily progress breakdown"],
    colSpan: "sm:col-span-12 lg:col-span-6",
  },
  {
    icon: ListTodo,
    title: "Intentional Task Manager",
    badge: "Actionable Clarity",
    description:
      "Capture actionable priorities with clean due dates and priority tags. Focus on what matters today without bloated clutter.",
    highlights: ["Priority filtering", "Due date indicators", "Instant completion logging"],
    colSpan: "sm:col-span-12 lg:col-span-6",
  },
  {
    icon: Flame,
    title: "Habit Tracker & Heatmaps",
    badge: "Scheduled Streaks",
    description:
      "Track daily or weekly recurring habits. Scheduled streak logic means non-scheduled rest days never penalize your momentum.",
    highlights: ["52-week calendar heatmaps", "Scheduled streak calculation", "Archiving without data loss"],
    colSpan: "sm:col-span-12 lg:col-span-4",
  },
  {
    icon: BookOpen,
    title: "Personal Journal",
    badge: "Markdown Reflection",
    description:
      "Reflect on completed work sessions with rich markdown support. Archive milestones and clear cognitive residue after deep work.",
    highlights: ["Markdown preview & formatting", "Searchable entries", "Weekly reflection counts"],
    colSpan: "sm:col-span-12 lg:col-span-4",
  },
  {
    icon: Target,
    title: "Immersive Focus Sanctuary",
    badge: "Audio Soundscapes",
    description:
      "Enter a full-screen sanctuary designed to eliminate digital distractions. Layer multiple ambient soundscapes like rainfall, forest wind, and white noise.",
    highlights: ["Multi-track sound mixer", "Full-screen mode", "Minimal zen clock"],
    colSpan: "sm:col-span-12 lg:col-span-4",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-12 sm:py-16 space-y-10 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline" className="px-3 py-1 rounded-full text-xs font-mono border-primary/20">
          Core Workspaces
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading text-foreground">
          Five essential tools. One unified state of mind.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Replace fragmented apps, noisy notifications, and scattered notes with a singularly focused workflow.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className={feature.colSpan}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
            >
              <Card className="h-full border-border/70 bg-card/90 hover:border-primary/50 transition-all duration-200 hover:shadow-md group flex flex-col justify-between">
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-normal px-2.5 py-0.5">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold tracking-tight font-heading">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                  <div className="pt-3 border-t border-border/40 space-y-1.5">
                    {feature.highlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="size-3.5 text-primary/70 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

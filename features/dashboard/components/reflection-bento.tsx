"use client";

import Link from "next/link";
import { BookOpen, ArrowUpRight, Plus, Calendar, Feather } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { JournalMetrics } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

interface ReflectionBentoProps {
  metrics: JournalMetrics;
}

function formatDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return isoStr;
  }
}

export function ReflectionBento({ metrics }: ReflectionBentoProps) {
  const { recentEntry } = metrics;

  return (
    <Card className="h-full flex flex-col justify-between border-border/70 hover:border-primary/40 transition-all duration-300 relative overflow-hidden group bg-card/60 backdrop-blur-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20 shadow-xs">
            <BookOpen className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                Mindful Reflection
              </CardTitle>
              {metrics.entriesThisWeekCount > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  {metrics.entriesThisWeekCount} this week
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Daily insights, reflections, and deep notes
            </p>
          </div>
        </div>
        <Link
          href="/journal"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded-md hover:bg-primary/5"
        >
          <span>Open Journal</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="pt-4 space-y-3.5 flex-1 flex flex-col justify-between">
        {recentEntry ? (
          <Link
            href="/journal"
            className="block p-3.5 rounded-xl bg-muted/20 border border-border/40 hover:border-primary/40 hover:bg-muted/30 transition-all space-y-2 group/entry"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground truncate group-hover/entry:text-primary transition-colors">
                {recentEntry.title}
              </h3>
              <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
                <Calendar className="size-3" />
                <span>{formatDate(recentEntry.updatedAt)}</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {recentEntry.snippet || "Empty reflection entry..."}
            </p>
            <div className="flex items-center gap-1 text-[11px] font-medium text-primary pt-1">
              <span>Read & Edit</span>
              <ArrowUpRight className="size-3 transition-transform group-hover/entry:translate-x-0.5 group-hover/entry:-translate-y-0.5" />
            </div>
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center py-7 text-center text-muted-foreground space-y-2.5 my-auto">
            <div className="p-2.5 rounded-full bg-muted/50 border border-border/40">
              <Feather className="size-5 text-violet-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">No reflections recorded yet</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Take a breath. Capture one insight, breakthrough, or win from today.
              </p>
            </div>
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="size-3.5" />
              <span>Write First Reflection</span>
            </Link>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Total Entries:{" "}
            <strong className="text-foreground">{metrics.totalEntriesCount}</strong>
          </span>
          <Link href="/journal" className="text-primary hover:underline font-medium">
            + New Entry
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


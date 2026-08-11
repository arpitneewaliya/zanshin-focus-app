"use client";

import { Button } from "@/components/ui/button";
import { Flame, Plus } from "lucide-react";

interface HabitEmptyStateProps {
  onAddHabit: () => void;
}

export function HabitEmptyState({ onAddHabit }: HabitEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/70 bg-card/40 space-y-4 max-w-md mx-auto my-8">
      <div className="p-4 rounded-full bg-primary/10 text-primary">
        <Flame className="size-8" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight">No active habits</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Start building consistent daily routines. Track your progress with calendar heatmaps and streak counters.
        </p>
      </div>
      <Button onClick={onAddHabit} className="gap-2 font-medium">
        <Plus className="size-4" />
        Create Your First Habit
      </Button>
    </div>
  );
}

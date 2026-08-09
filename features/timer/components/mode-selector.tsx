"use client";

import * as React from "react";
import { useTimerStore, TimerMode } from "@/stores/timerStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const modes: { id: TimerMode; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "shortBreak", label: "Short Break" },
  { id: "longBreak", label: "Long Break" },
];

export function ModeSelector() {
  const mode = useTimerStore((state) => state.mode);
  const setMode = useTimerStore((state) => state.setMode);

  return (
    <div className="flex items-center justify-center gap-1.5 p-1 bg-muted/60 rounded-full border border-border/40">
      {modes.map((m) => {
        const isActive = mode === m.id;
        return (
          <Button
            key={m.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-full text-xs font-medium transition-all px-4 py-1.5 h-8",
              isActive
                ? "shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m.label}
          </Button>
        );
      })}
    </div>
  );
}

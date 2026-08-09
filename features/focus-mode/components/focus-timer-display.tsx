"use client";

import { useEffect } from "react";
import { useTimerStore, TimerMode } from "@/stores/timerStore";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

const modeLabels: Record<TimerMode, string> = {
  work: "Deep Focus",
  shortBreak: "Short Break",
  longBreak: "Rest & Recharge",
};

export function FocusTimerDisplay() {
  const mode = useTimerStore((state) => state.mode);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const isRunning = useTimerStore((state) => state.isRunning);
  const completedSessions = useTimerStore((state) => state.completedSessions);

  const start = useTimerStore((state) => state.start);
  const pause = useTimerStore((state) => state.pause);
  const reset = useTimerStore((state) => state.reset);
  const tick = useTimerStore((state) => state.tick);
  const skip = useTimerStore((state) => state.skip);
  const setMode = useTimerStore((state) => state.setMode);

  // Timer interval ticker when running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 my-auto select-none">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-muted/40 border border-border/40 backdrop-blur-xs">
        {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => {
          const isActive = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {modeLabels[m]}
            </button>
          );
        })}
      </div>

      {/* Large Centered Countdown Display */}
      <div className="text-center space-y-2">
        <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tighter font-mono text-foreground drop-shadow-xs">
          {timeFormatted}
        </h1>
        <p className="text-sm font-medium text-muted-foreground/80 tracking-wide uppercase">
          Session #{completedSessions + 1} • {modeLabels[mode]}
        </p>
      </div>

      {/* Minimal Timer Controls */}
      <div className="flex items-center gap-4">
        {/* Reset Button */}
        <Button
          variant="outline"
          size="icon-lg"
          onClick={reset}
          title="Reset timer"
          className="rounded-full border-border/60 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all"
        >
          <RotateCcw className="size-5" />
          <span className="sr-only">Reset timer</span>
        </Button>

        {/* Play / Pause Toggle Button */}
        <Button
          size="lg"
          onClick={isRunning ? pause : start}
          className="h-16 px-8 rounded-full text-base font-semibold gap-3 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          {isRunning ? (
            <>
              <Pause className="size-6 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="size-6 fill-current ml-0.5" />
              <span>Start Focus</span>
            </>
          )}
        </Button>

        {/* Skip Button */}
        <Button
          variant="outline"
          size="icon-lg"
          onClick={skip}
          title="Skip session"
          className="rounded-full border-border/60 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all"
        >
          <SkipForward className="size-5" />
          <span className="sr-only">Skip session</span>
        </Button>
      </div>
    </div>
  );
}

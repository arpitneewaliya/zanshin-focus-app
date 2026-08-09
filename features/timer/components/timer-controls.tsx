"use client";

import * as React from "react";
import { Play, Pause, RotateCcw, SkipForward, Settings } from "lucide-react";
import { useTimerStore } from "@/stores/timerStore";
import { Button } from "@/components/ui/button";

interface TimerControlsProps {
  onToggleSettings?: () => void;
  showSettingsToggle?: boolean;
}

export function TimerControls({
  onToggleSettings,
  showSettingsToggle = true,
}: TimerControlsProps) {
  const { isRunning, start, pause, reset, skip } = useTimerStore();

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      {/* Reset Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={reset}
        title="Reset Timer"
        aria-label="Reset Timer"
        className="rounded-full size-11 text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="size-5" />
      </Button>

      {/* Main Start/Pause Toggle */}
      <Button
        variant="default"
        size="lg"
        onClick={isRunning ? pause : start}
        className="rounded-full px-8 py-6 text-base font-medium shadow-md transition-all active:scale-95"
      >
        {isRunning ? (
          <>
            <Pause className="size-5 mr-2 fill-current" /> Pause
          </>
        ) : (
          <>
            <Play className="size-5 mr-2 fill-current" /> Start
          </>
        )}
      </Button>

      {/* Skip Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={skip}
        title="Skip to next session"
        aria-label="Skip session"
        className="rounded-full size-11 text-muted-foreground hover:text-foreground"
      >
        <SkipForward className="size-5" />
      </Button>

      {/* Settings Panel Toggle */}
      {showSettingsToggle && onToggleSettings && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSettings}
          title="Timer Settings"
          aria-label="Timer Settings"
          className="rounded-full size-11 text-muted-foreground hover:text-foreground ml-1"
        >
          <Settings className="size-5" />
        </Button>
      )}
    </div>
  );
}

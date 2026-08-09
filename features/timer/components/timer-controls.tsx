"use client";

import * as React from "react";
import { Play, Pause, RotateCcw, SkipForward, Settings } from "lucide-react";
import { useTimerStore } from "@/stores/timerStore";
import { Button } from "@/components/ui/button";

import { unlockAudioContext } from "@/lib/sound";

interface TimerControlsProps {
  onToggleSettings?: () => void;
  showSettingsToggle?: boolean;
}

export function TimerControls({
  onToggleSettings,
  showSettingsToggle = true,
}: TimerControlsProps) {
  const { isRunning, start, pause, reset, skip } = useTimerStore();

  const handleStartPause = () => {
    unlockAudioContext();
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const handleReset = () => {
    unlockAudioContext();
    reset();
  };

  const handleSkip = () => {
    unlockAudioContext();
    skip();
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      {/* Reset Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleReset}
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
        onClick={handleStartPause}
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
        onClick={handleSkip}
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

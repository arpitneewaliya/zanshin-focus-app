"use client";

import * as React from "react";
import { useTimerStore } from "@/stores/timerStore";
import { playTimerCompletionSound } from "@/lib/sound";
import { ModeSelector } from "./mode-selector";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { TimerSettingsPanel } from "./timer-settings";
import { Card } from "@/components/ui/card";

export function TimerView() {
  const { isRunning, tick, timeLeft, mode } = useTimerStore();
  const [showSettings, setShowSettings] = React.useState(false);

  // Timer Ticking Loop
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        tick(() => {
          playTimerCompletionSound();
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  // Dynamic Browser Tab Title Update
  React.useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    const modeLabel =
      mode === "work"
        ? "Work"
        : mode === "shortBreak"
        ? "Short Break"
        : "Long Break";

    document.title = `(${formattedTime}) ${modeLabel} - Zanshin Focus`;

    return () => {
      document.title = "Zanshin Focus";
    };
  }, [timeLeft, mode]);

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto space-y-6">
      {/* Timer Container Card */}
      <Card className="w-full p-6 sm:p-8 flex flex-col items-center space-y-6 border-border/60 shadow-xs">
        <ModeSelector />
        <TimerDisplay />
        <TimerControls
          onToggleSettings={() => setShowSettings((prev) => !prev)}
        />
      </Card>

      {/* Settings Drawer / Panel */}
      {showSettings && (
        <div className="w-full transition-all duration-300">
          <TimerSettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { useTimerStore, TimerMode } from "@/stores/timerStore";
import { playTimerCompletionSound, unlockAudioContext } from "@/lib/sound";
import { ModeSelector } from "./mode-selector";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { TimerSettingsPanel } from "./timer-settings";
import { TimerNotificationModal } from "./timer-notification";
import { Card } from "@/components/ui/card";

export function TimerView() {
  const { isRunning, tick, timeLeft, mode } = useTimerStore();
  const [showSettings, setShowSettings] = React.useState(false);
  const [completedModalMode, setCompletedModalMode] =
    React.useState<TimerMode | null>(null);

  // Request browser notification permission if available
  React.useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  // Timer Ticking Loop
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        tick((finishedMode) => {
          playTimerCompletionSound();
          setCompletedModalMode(finishedMode);

          // Show browser notification if permission granted
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            const title =
              finishedMode === "work"
                ? "Work Session Completed!"
                : finishedMode === "shortBreak"
                ? "Short Break Finished!"
                : "Long Break Finished!";
            try {
              new Notification(title, {
                body: "Click to return to Zanshin Focus Timer.",
              });
            } catch {
              // Ignore notification constructor errors
            }
          }
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
          onToggleSettings={() => {
            unlockAudioContext();
            setShowSettings((prev) => !prev);
          }}
        />
      </Card>

      {/* Settings Drawer / Panel */}
      {showSettings && (
        <div className="w-full transition-all duration-300">
          <TimerSettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* Timer Session Completion Notification Modal */}
      <TimerNotificationModal
        completedMode={completedModalMode}
        onClose={() => setCompletedModalMode(null)}
      />
    </div>
  );
}

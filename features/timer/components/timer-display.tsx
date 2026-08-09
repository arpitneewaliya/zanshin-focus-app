"use client";

import * as React from "react";
import { useTimerStore } from "@/stores/timerStore";

export function TimerDisplay() {
  const {
    mode,
    timeLeft,
    completedSessions,
    longBreakInterval,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
  } = useTimerStore();

  // Determine total duration for progress calculation
  const totalDurationSeconds = React.useMemo(() => {
    switch (mode) {
      case "work":
        return workDuration * 60;
      case "shortBreak":
        return shortBreakDuration * 60;
      case "longBreak":
        return longBreakDuration * 60;
    }
  }, [mode, workDuration, shortBreakDuration, longBreakDuration]);

  // Format time MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  // SVG Circle Progress calculation
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = totalDurationSeconds > 0 ? timeLeft / totalDurationSeconds : 0;
  const strokeDashoffset = circumference * (1 - progress);

  // Mode title display
  const modeTitle =
    mode === "work"
      ? "Work Session"
      : mode === "shortBreak"
      ? "Short Break"
      : "Long Break";

  // Session stats calculation
  const sessionsUntilLongBreak =
    longBreakInterval - (completedSessions % longBreakInterval);

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      {/* SVG Circular Progress Ring */}
      <div className="relative size-72 sm:size-80 flex items-center justify-center">
        <svg
          className="size-full -rotate-90 transform"
          viewBox="0 0 260 260"
        >
          {/* Track Circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            className="stroke-muted fill-none"
            strokeWidth="8"
          />
          {/* Animated Progress Circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            className="stroke-primary fill-none transition-all duration-300 ease-linear"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center Timer Text Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {modeTitle}
          </span>
          <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-foreground select-none">
            {formattedTime}
          </span>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Session #{completedSessions + 1}
              {mode === "work" && (
                <span className="opacity-75">
                  {" "}
                  ({sessionsUntilLongBreak} to long break)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { create } from "zustand";

export type TimerMode = "work" | "shortBreak" | "longBreak";

export interface TimerSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // sessions before long break
}

interface TimerState extends TimerSettings {
  mode: TimerMode;
  timeLeft: number; // in seconds
  isRunning: boolean;
  completedSessions: number;

  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: (onSessionComplete?: (completedMode: TimerMode) => void) => void;
  skip: () => void;
  setMode: (mode: TimerMode) => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  hydrateSettings: (settings: Partial<TimerSettings>) => void;
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
};

const getDurationForMode = (mode: TimerMode, settings: TimerSettings): number => {
  switch (mode) {
    case "work":
      return settings.workDuration * 60;
    case "shortBreak":
      return settings.shortBreakDuration * 60;
    case "longBreak":
      return settings.longBreakDuration * 60;
  }
};

export const useTimerStore = create<TimerState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  mode: "work",
  timeLeft: DEFAULT_SETTINGS.workDuration * 60,
  isRunning: false,
  completedSessions: 0,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),

  reset: () => {
    const state = get();
    set({
      isRunning: false,
      timeLeft: getDurationForMode(state.mode, state),
    });
  },

  setMode: (newMode: TimerMode) => {
    const state = get();
    set({
      mode: newMode,
      isRunning: false,
      timeLeft: getDurationForMode(newMode, state),
    });
  },

  tick: (onSessionComplete?: (completedMode: TimerMode) => void) => {
    const state = get();
    if (!state.isRunning) return;

    if (state.timeLeft > 1) {
      set({ timeLeft: state.timeLeft - 1 });
    } else {
      const finishedMode = state.mode;

      // Session finished
      if (onSessionComplete) {
        onSessionComplete(finishedMode);
      }

      if (state.mode === "work") {
        const nextSessions = state.completedSessions + 1;
        const isLongBreak = nextSessions % state.longBreakInterval === 0;
        const nextMode: TimerMode = isLongBreak ? "longBreak" : "shortBreak";

        set({
          completedSessions: nextSessions,
          mode: nextMode,
          isRunning: false,
          timeLeft: getDurationForMode(nextMode, state),
        });
      } else {
        // Break finished -> back to work
        set({
          mode: "work",
          isRunning: false,
          timeLeft: getDurationForMode("work", state),
        });
      }
    }
  },

  skip: () => {
    const state = get();
    if (state.mode === "work") {
      const nextSessions = state.completedSessions + 1;
      const isLongBreak = nextSessions % state.longBreakInterval === 0;
      const nextMode: TimerMode = isLongBreak ? "longBreak" : "shortBreak";

      set({
        completedSessions: nextSessions,
        mode: nextMode,
        isRunning: false,
        timeLeft: getDurationForMode(nextMode, state),
      });
    } else {
      set({
        mode: "work",
        isRunning: false,
        timeLeft: getDurationForMode("work", state),
      });
    }
  },

  updateSettings: (newSettings: Partial<TimerSettings>) => {
    const currentState = get();
    const updatedSettings = {
      ...currentState,
      ...newSettings,
    };

    const isCurrentModeAffected =
      (currentState.mode === "work" && newSettings.workDuration !== undefined) ||
      (currentState.mode === "shortBreak" && newSettings.shortBreakDuration !== undefined) ||
      (currentState.mode === "longBreak" && newSettings.longBreakDuration !== undefined);

    set({
      ...newSettings,
      // If timer isn't running and current mode setting changed, reset timeLeft
      timeLeft:
        !currentState.isRunning && isCurrentModeAffected
          ? getDurationForMode(currentState.mode, updatedSettings)
          : currentState.timeLeft,
    });
  },

  hydrateSettings: (hydratedSettings: Partial<TimerSettings>) => {
    const currentState = get();
    const updatedSettings = {
      ...currentState,
      ...hydratedSettings,
    };

    // If timer is not running, adjust timeLeft to match the new duration
    set({
      ...hydratedSettings,
      timeLeft: !currentState.isRunning
        ? getDurationForMode(currentState.mode, updatedSettings)
        : currentState.timeLeft,
    });
  },
}));

"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ClockStyle, PomodoroMode } from "@prisma/client";

export type TimerSettingsData = {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
};

export type UserSettingsData = {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  showSeconds: boolean;
  showDate: boolean;
  use24Hour: boolean;
  clockStyle: "digital" | "minimal" | "analog" | "text";
};

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  guest?: boolean;
};

/**
 * Retrieves the current authenticated user's settings.
 * Returns null if the user is unauthenticated or has no custom settings yet.
 */
export async function getUserSettings(): Promise<ActionResult<UserSettingsData | null>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: true, data: null, guest: true };
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: {
        workDuration: true,
        shortBreakDuration: true,
        longBreakDuration: true,
        longBreakInterval: true,
        showSeconds: true,
        showDate: true,
        use24Hour: true,
        clockStyle: true,
      },
    });

    if (!settings) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        workDuration: settings.workDuration,
        shortBreakDuration: settings.shortBreakDuration,
        longBreakDuration: settings.longBreakDuration,
        longBreakInterval: settings.longBreakInterval,
        showSeconds: settings.showSeconds,
        showDate: settings.showDate,
        use24Hour: settings.use24Hour,
        clockStyle: settings.clockStyle as UserSettingsData["clockStyle"],
      },
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return { success: false, error: "Failed to fetch settings" };
  }
}

/**
 * Updates the current authenticated user's general preferences in the database.
 */
export async function updateUserSettings(
  settings: Partial<UserSettingsData>
): Promise<ActionResult<UserSettingsData>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in to sync settings." };
    }

    // Input validation & clamping
    const updates: Partial<{
      workDuration: number;
      shortBreakDuration: number;
      longBreakDuration: number;
      longBreakInterval: number;
      showSeconds: boolean;
      showDate: boolean;
      use24Hour: boolean;
      clockStyle: ClockStyle;
    }> = {};

    if (typeof settings.workDuration === "number") {
      updates.workDuration = Math.min(Math.max(Math.round(settings.workDuration), 1), 60);
    }
    if (typeof settings.shortBreakDuration === "number") {
      updates.shortBreakDuration = Math.min(Math.max(Math.round(settings.shortBreakDuration), 1), 30);
    }
    if (typeof settings.longBreakDuration === "number") {
      updates.longBreakDuration = Math.min(Math.max(Math.round(settings.longBreakDuration), 1), 45);
    }
    if (typeof settings.longBreakInterval === "number") {
      updates.longBreakInterval = Math.min(Math.max(Math.round(settings.longBreakInterval), 1), 10);
    }
    if (typeof settings.showSeconds === "boolean") {
      updates.showSeconds = settings.showSeconds;
    }
    if (typeof settings.showDate === "boolean") {
      updates.showDate = settings.showDate;
    }
    if (typeof settings.use24Hour === "boolean") {
      updates.use24Hour = settings.use24Hour;
    }
    if (
      settings.clockStyle &&
      ["digital", "minimal", "analog", "text"].includes(settings.clockStyle)
    ) {
      updates.clockStyle = settings.clockStyle as ClockStyle;
    }

    // Ensure User row exists
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email || "",
        name:
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          null,
      },
    });

    const saved = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: updates,
      create: {
        userId: user.id,
        workDuration: updates.workDuration ?? 25,
        shortBreakDuration: updates.shortBreakDuration ?? 5,
        longBreakDuration: updates.longBreakDuration ?? 15,
        longBreakInterval: updates.longBreakInterval ?? 4,
        showSeconds: updates.showSeconds ?? false,
        showDate: updates.showDate ?? true,
        use24Hour: updates.use24Hour ?? true,
        clockStyle: updates.clockStyle ?? "digital",
      },
      select: {
        workDuration: true,
        shortBreakDuration: true,
        longBreakDuration: true,
        longBreakInterval: true,
        showSeconds: true,
        showDate: true,
        use24Hour: true,
        clockStyle: true,
      },
    });

    return {
      success: true,
      data: {
        workDuration: saved.workDuration,
        shortBreakDuration: saved.shortBreakDuration,
        longBreakDuration: saved.longBreakDuration,
        longBreakInterval: saved.longBreakInterval,
        showSeconds: saved.showSeconds,
        showDate: saved.showDate,
        use24Hour: saved.use24Hour,
        clockStyle: saved.clockStyle as UserSettingsData["clockStyle"],
      },
    };
  } catch (error) {
    console.error("Error updating user settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}

/**
 * Backwards-compatible alias for TimerSettings
 */
export async function updateTimerSettings(
  settings: Partial<TimerSettingsData>
): Promise<ActionResult<TimerSettingsData>> {
  const res = await updateUserSettings(settings);
  if (!res.success || !res.data) {
    return { success: false, error: res.error };
  }
  return {
    success: true,
    data: {
      workDuration: res.data.workDuration,
      shortBreakDuration: res.data.shortBreakDuration,
      longBreakDuration: res.data.longBreakDuration,
      longBreakInterval: res.data.longBreakInterval,
    },
  };
}

/**
 * Logs a completed Pomodoro session for the authenticated user.
 * For unauthenticated users, gracefully returns without failing.
 */
export async function logPomodoroSession(
  mode: PomodoroMode,
  durationSec: number
): Promise<ActionResult<{ id?: string; completedAt?: Date }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      // Unauthenticated / guest mode: no DB record created
      return { success: true, guest: true };
    }

    if (!["work", "shortBreak", "longBreak"].includes(mode)) {
      return { success: false, error: "Invalid session mode" };
    }

    const validatedDuration = Math.max(Math.round(durationSec), 1);

    // Ensure User row exists
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email || "",
        name:
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          null,
      },
    });

    const session = await prisma.pomodoroSession.create({
      data: {
        userId: user.id,
        mode,
        durationSec: validatedDuration,
      },
      select: {
        id: true,
        completedAt: true,
      },
    });

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error("Error logging pomodoro session:", error);
    return { success: false, error: "Failed to log session" };
  }
}

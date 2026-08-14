"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { PomodoroMode } from "@prisma/client";

export type TimerSettingsData = {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
};

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  guest?: boolean;
};

/**
 * Retrieves the current authenticated user's timer settings.
 * Returns null if the user is unauthenticated or has no custom settings yet.
 */
export async function getUserSettings(): Promise<ActionResult<TimerSettingsData | null>> {
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
      },
    };
  } catch (error) {
    console.error("Error fetching user timer settings:", error);
    return { success: false, error: "Failed to fetch timer settings" };
  }
}

/**
 * Updates the current authenticated user's timer settings in the database.
 */
export async function updateTimerSettings(
  settings: Partial<TimerSettingsData>
): Promise<ActionResult<TimerSettingsData>> {
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
    const updates: Partial<TimerSettingsData> = {};
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

    // Ensure User row exists
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email || "",
        name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || null,
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
      },
      select: {
        workDuration: true,
        shortBreakDuration: true,
        longBreakDuration: true,
        longBreakInterval: true,
      },
    });

    return {
      success: true,
      data: saved,
    };
  } catch (error) {
    console.error("Error updating timer settings:", error);
    return { success: false, error: "Failed to save timer settings" };
  }
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
        name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || null,
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

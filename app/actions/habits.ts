"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { HabitStatus, Prisma } from "@prisma/client";
import {
  Habit,
  HabitColor,
  HabitCompletionLog,
  HabitFrequency,
  CompletionStatus,
} from "@/features/habit-tracker/types";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  guest?: boolean;
};

function formatHabit(raw: {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string;
  frequency: Prisma.JsonValue;
  createdDate: Date;
  archivedDate: Date | null;
}): Habit {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
    color: raw.color as HabitColor,
    frequency: raw.frequency as unknown as HabitFrequency,
    createdDate: raw.createdDate.toISOString().split("T")[0],
    archivedDate: raw.archivedDate
      ? raw.archivedDate.toISOString().split("T")[0]
      : null,
  };
}

function formatCompletionLog(raw: {
  id: string;
  habitId: string;
  date: Date;
  status: HabitStatus;
}): HabitCompletionLog {
  return {
    id: raw.id,
    habitId: raw.habitId,
    date: raw.date.toISOString().split("T")[0],
    status: raw.status as CompletionStatus,
  };
}

/**
 * Retrieves all habits and all completion logs for the authenticated user.
 */
export async function getHabitsWithLogs(): Promise<
  ActionResult<{ habits: Habit[]; completionLogs: HabitCompletionLog[] }>
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const habitsRaw = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        completionLogs: true,
      },
      orderBy: {
        createdDate: "asc",
      },
    });

    const habits: Habit[] = [];
    const completionLogs: HabitCompletionLog[] = [];

    for (const h of habitsRaw) {
      habits.push(formatHabit(h));
      for (const log of h.completionLogs) {
        completionLogs.push(formatCompletionLog(log));
      }
    }

    return {
      success: true,
      data: {
        habits,
        completionLogs,
      },
    };
  } catch (error) {
    console.error("Error fetching habits and logs:", error);
    return { success: false, error: "Failed to fetch habits" };
  }
}

/**
 * Creates a new habit for the authenticated user.
 */
export async function createHabit(data: {
  name: string;
  description?: string;
  color: HabitColor;
  frequency: HabitFrequency;
}): Promise<ActionResult<Habit>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const name = data.name.trim();
    if (!name) {
      return { success: false, error: "Habit name cannot be empty." };
    }

    // Ensure user exists in Prisma
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

    const created = await prisma.habit.create({
      data: {
        userId: user.id,
        name,
        description: data.description?.trim() || null,
        color: data.color,
        frequency: data.frequency as unknown as Prisma.InputJsonValue,
        createdDate: new Date(),
        archivedDate: null,
      },
    });

    revalidatePath("/habit-tracker");

    return {
      success: true,
      data: formatHabit(created),
    };
  } catch (error) {
    console.error("Error creating habit:", error);
    return { success: false, error: "Failed to create habit" };
  }
}

/**
 * Updates an existing habit for the authenticated user.
 */
export async function updateHabit(
  id: string,
  updates: Partial<Pick<Habit, "name" | "description" | "color" | "frequency">>
): Promise<ActionResult<Habit>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const existing = await prisma.habit.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Habit not found." };
    }

    const updateData: {
      name?: string;
      description?: string | null;
      color?: string;
      frequency?: Prisma.InputJsonValue;
    } = {};

    if (updates.name !== undefined) {
      const trimmed = updates.name.trim();
      if (!trimmed) {
        return { success: false, error: "Habit name cannot be empty." };
      }
      updateData.name = trimmed;
    }

    if (updates.description !== undefined) {
      updateData.description = updates.description?.trim() || null;
    }

    if (updates.color !== undefined) {
      updateData.color = updates.color;
    }

    if (updates.frequency !== undefined) {
      updateData.frequency = updates.frequency as unknown as Prisma.InputJsonValue;
    }

    const updated = await prisma.habit.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/habit-tracker");

    return {
      success: true,
      data: formatHabit(updated),
    };
  } catch (error) {
    console.error("Error updating habit:", error);
    return { success: false, error: "Failed to update habit" };
  }
}

/**
 * Archives a habit (sets archivedDate).
 */
export async function archiveHabit(id: string): Promise<ActionResult<Habit>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const existing = await prisma.habit.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Habit not found." };
    }

    const updated = await prisma.habit.update({
      where: { id },
      data: { archivedDate: new Date() },
    });

    revalidatePath("/habit-tracker");

    return {
      success: true,
      data: formatHabit(updated),
    };
  } catch (error) {
    console.error("Error archiving habit:", error);
    return { success: false, error: "Failed to archive habit" };
  }
}

/**
 * Unarchives a habit (clears archivedDate).
 */
export async function unarchiveHabit(id: string): Promise<ActionResult<Habit>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const existing = await prisma.habit.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Habit not found." };
    }

    const updated = await prisma.habit.update({
      where: { id },
      data: { archivedDate: null },
    });

    revalidatePath("/habit-tracker");

    return {
      success: true,
      data: formatHabit(updated),
    };
  } catch (error) {
    console.error("Error unarchiving habit:", error);
    return { success: false, error: "Failed to unarchive habit" };
  }
}

/**
 * Permanently deletes a habit and its cascaded completion logs.
 */
export async function deleteHabit(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const existing = await prisma.habit.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Habit not found." };
    }

    await prisma.habit.delete({
      where: { id },
    });

    revalidatePath("/habit-tracker");

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    console.error("Error deleting habit:", error);
    return { success: false, error: "Failed to delete habit" };
  }
}

/**
 * Upserts a completion log on the [habitId, date] unique constraint.
 */
export async function upsertCompletionLog(
  habitId: string,
  dateStr: string,
  status: CompletionStatus
): Promise<ActionResult<HabitCompletionLog>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Verify habit ownership
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: user.id },
    });

    if (!habit) {
      return { success: false, error: "Habit not found." };
    }

    const parsedDate = new Date(dateStr + "T00:00:00.000Z");

    const log = await prisma.habitCompletionLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date: parsedDate,
        },
      },
      update: {
        status: status as HabitStatus,
      },
      create: {
        habitId,
        date: parsedDate,
        status: status as HabitStatus,
      },
    });

    revalidatePath("/habit-tracker");

    return {
      success: true,
      data: formatCompletionLog(log),
    };
  } catch (error) {
    console.error("Error saving completion log:", error);
    return { success: false, error: "Failed to save completion status" };
  }
}

/**
 * Deletes a completion log for a specific habit and date.
 */
export async function deleteCompletionLog(
  habitId: string,
  dateStr: string
): Promise<ActionResult<{ habitId: string; date: string }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Verify habit ownership
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: user.id },
    });

    if (!habit) {
      return { success: false, error: "Habit not found." };
    }

    const parsedDate = new Date(dateStr + "T00:00:00.000Z");

    await prisma.habitCompletionLog.deleteMany({
      where: {
        habitId,
        date: parsedDate,
      },
    });

    revalidatePath("/habit-tracker");

    return {
      success: true,
      data: { habitId, date: dateStr },
    };
  } catch (error) {
    console.error("Error deleting completion log:", error);
    return { success: false, error: "Failed to undo completion status" };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { TaskPriority as PrismaTaskPriority } from "@prisma/client";
import { Task, TaskPriority } from "@/features/tasks/types";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  guest?: boolean;
};

function formatTask(task: {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: PrismaTaskPriority;
  completed: boolean;
  createdAt: Date;
}): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : undefined,
    priority: task.priority as TaskPriority,
    completed: task.completed,
    createdAt: task.createdAt.toISOString(),
  };
}

/**
 * Retrieves all tasks for the current authenticated user.
 */
export async function getTasks(): Promise<ActionResult<Task[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: tasks.map(formatTask),
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }
}

/**
 * Creates a new task for the authenticated user.
 */
export async function createTask(data: {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
}): Promise<ActionResult<Task>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const title = data.title.trim();
    if (!title) {
      return { success: false, error: "Task title cannot be empty." };
    }

    // Ensure User row exists in DB
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

    const parsedDueDate = data.dueDate ? new Date(data.dueDate + "T00:00:00.000Z") : null;
    const priority: PrismaTaskPriority = (data.priority as PrismaTaskPriority) || "medium";

    const created = await prisma.task.create({
      data: {
        userId: user.id,
        title,
        description: data.description?.trim() || null,
        dueDate: parsedDueDate,
        priority,
        completed: false,
      },
    });

    revalidatePath("/tasks");

    return {
      success: true,
      data: formatTask(created),
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

/**
 * Updates an existing task for the authenticated user.
 */
export async function updateTask(
  id: string,
  updates: Partial<Pick<Task, "title" | "description" | "dueDate" | "priority">>
): Promise<ActionResult<Task>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Task not found." };
    }

    const updateData: {
      title?: string;
      description?: string | null;
      dueDate?: Date | null;
      priority?: PrismaTaskPriority;
    } = {};

    if (updates.title !== undefined) {
      const trimmedTitle = updates.title.trim();
      if (!trimmedTitle) {
        return { success: false, error: "Task title cannot be empty." };
      }
      updateData.title = trimmedTitle;
    }

    if (updates.description !== undefined) {
      updateData.description = updates.description?.trim() || null;
    }

    if (updates.dueDate !== undefined) {
      updateData.dueDate = updates.dueDate
        ? new Date(updates.dueDate + "T00:00:00.000Z")
        : null;
    }

    if (updates.priority !== undefined) {
      updateData.priority = updates.priority as PrismaTaskPriority;
    }

    const updated = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/tasks");

    return {
      success: true,
      data: formatTask(updated),
    };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

/**
 * Deletes a task for the authenticated user.
 */
export async function deleteTask(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Task not found." };
    }

    await prisma.task.delete({
      where: { id },
    });

    revalidatePath("/tasks");

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

/**
 * Toggles a task's completion status.
 */
export async function toggleTaskComplete(id: string): Promise<ActionResult<Task>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Task not found." };
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        completed: !existing.completed,
      },
    });

    revalidatePath("/tasks");

    return {
      success: true,
      data: formatTask(updated),
    };
  } catch (error) {
    console.error("Error toggling task completion:", error);
    return { success: false, error: "Failed to toggle task" };
  }
}

/**
 * Clears all completed tasks for the authenticated user.
 */
export async function clearCompletedTasks(): Promise<ActionResult<{ count: number }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const result = await prisma.task.deleteMany({
      where: {
        userId: user.id,
        completed: true,
      },
    });

    revalidatePath("/tasks");

    return {
      success: true,
      data: { count: result.count },
    };
  } catch (error) {
    console.error("Error clearing completed tasks:", error);
    return { success: false, error: "Failed to clear completed tasks" };
  }
}

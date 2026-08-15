"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { JournalEntry, deriveTitle } from "@/features/journal/types";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  guest?: boolean;
};

function formatJournalEntry(entry: {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}): JournalEntry {
  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

/**
 * Retrieves all journal entries for the current authenticated user.
 */
export async function getJournalEntries(): Promise<ActionResult<JournalEntry[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return {
      success: true,
      data: entries.map(formatJournalEntry),
    };
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return { success: false, error: "Failed to fetch journal entries" };
  }
}

/**
 * Creates a new journal entry for the authenticated user.
 */
export async function createJournalEntry(
  initialTitle = "",
  initialContent = ""
): Promise<ActionResult<JournalEntry>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
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

    const computedTitle = deriveTitle(initialTitle, initialContent);

    const created = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        title: computedTitle,
        content: initialContent,
      },
    });

    revalidatePath("/journal");

    return {
      success: true,
      data: formatJournalEntry(created),
    };
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return { success: false, error: "Failed to create journal entry" };
  }
}

/**
 * Updates an existing journal entry for the authenticated user.
 */
export async function updateJournalEntry(
  id: string,
  updates: { title?: string; content?: string }
): Promise<ActionResult<JournalEntry>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const existing = await prisma.journalEntry.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Journal entry not found." };
    }

    const newContent =
      updates.content !== undefined ? updates.content : existing.content;
    const rawTitle =
      updates.title !== undefined ? updates.title : existing.title;
    const finalTitle = deriveTitle(rawTitle, newContent);

    const updated = await prisma.journalEntry.update({
      where: { id },
      data: {
        title: finalTitle,
        content: newContent,
      },
    });

    revalidatePath("/journal");

    return {
      success: true,
      data: formatJournalEntry(updated),
    };
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return { success: false, error: "Failed to update journal entry" };
  }
}

/**
 * Deletes a journal entry for the authenticated user.
 */
export async function deleteJournalEntry(
  id: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const existing = await prisma.journalEntry.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Journal entry not found." };
    }

    await prisma.journalEntry.delete({
      where: { id },
    });

    revalidatePath("/journal");

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return { success: false, error: "Failed to delete journal entry" };
  }
}

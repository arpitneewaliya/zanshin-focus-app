"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
};

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Retrieves the current authenticated user's profile from the database.
 * If the Prisma user record does not exist yet, creates it.
 */
export async function getUserProfile(): Promise<ActionResult<UserProfile | null>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: true, data: null };
    }

    // Fetch from Prisma or upsert if not yet present
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser && user.email) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || null,
        },
      });
    }

    if (!dbUser) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

/**
 * Updates the current authenticated user's display name.
 */
export async function updateUserName(
  name: string
): Promise<ActionResult<{ name: string | null }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in again." };
    }

    const trimmed = name.trim();
    if (trimmed.length > 60) {
      return { success: false, error: "Display name must be 60 characters or less." };
    }

    const finalName = trimmed.length > 0 ? trimmed : null;

    // Update in Prisma
    const updatedUser = await prisma.user.upsert({
      where: { id: user.id },
      update: { name: finalName },
      create: {
        id: user.id,
        email: user.email || "",
        name: finalName,
      },
    });

    // Also update Supabase auth metadata to stay consistent
    await supabase.auth.updateUser({
      data: {
        full_name: finalName,
        name: finalName,
      },
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      data: { name: updatedUser.name },
    };
  } catch (error) {
    console.error("Error updating user name:", error);
    return { success: false, error: "Failed to update display name. Please try again." };
  }
}

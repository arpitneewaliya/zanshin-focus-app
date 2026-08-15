"use server";

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
import {
  calculateHabitStreak,
  getHeatmapGrid,
  formatDateKey,
} from "@/features/habit-tracker/utils";
import {
  DashboardData,
  DailyFocusPoint,
  HabitSummaryItem,
} from "@/features/dashboard/types";

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
 * Strips basic markdown symbols to produce a clean text snippet
 */
function createSnippet(content: string, maxLength: number = 140): string {
  const plainText = content
    .replace(/[#*`_~>[\]()!-]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + "…";
}

/**
 * Retrieves all aggregated metrics for the central dashboard
 */
export async function getDashboardData(): Promise<ActionResult<DashboardData>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const today = new Date();
    const todayStr = formatDateKey(today);

    // Compute dates for the last 7 days (6 days ago -> today)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7DaysDates: { date: Date; dateStr: string; dayLabel: string; isToday: boolean }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = formatDateKey(d);
      last7DaysDates.push({
        date: d,
        dateStr: dStr,
        dayLabel: dayNames[d.getDay()],
        isToday: dStr === todayStr,
      });
    }

    // Start of 7-day window (midnight of 6 days ago in local/UTC)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Start of today
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    // Start of current week (Monday)
    const currentDay = today.getDay();
    const distToMonday = (currentDay + 6) % 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - distToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Guest fallback if unauthenticated
    if (authError || !user) {
      const default7Days: DailyFocusPoint[] = last7DaysDates.map((item) => ({
        dateStr: item.dateStr,
        dayLabel: item.dayLabel,
        minutes: 0,
        isToday: item.isToday,
      }));

      return {
        success: true,
        guest: true,
        data: {
          focus: {
            todayMinutes: 0,
            todaySessionsCount: 0,
            dailyAverage7DaysMinutes: 0,
            diffFromAvgPercent: null,
            last7Days: default7Days,
          },
          tasks: {
            openCount: 0,
            completedCount: 0,
            completedTodayCount: 0,
            completedThisWeekCount: 0,
            overdueCount: 0,
            totalCount: 0,
          },
          habits: [],
          journal: {
            recentEntry: null,
            entriesThisWeekCount: 0,
            totalEntriesCount: 0,
          },
          isGuest: true,
        },
      };
    }

    // Execute queries in parallel for peak efficiency
    const [
      pomodoroSessions,
      tasksRaw,
      habitsRaw,
      recentJournalEntry,
      journalEntriesThisWeek,
      totalJournalEntries,
    ] = await Promise.all([
      // 1. Pomodoro sessions in the last 7 days
      prisma.pomodoroSession.findMany({
        where: {
          userId: user.id,
          mode: "work",
          completedAt: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          durationSec: true,
          completedAt: true,
        },
      }),

      // 2. All tasks for the user
      prisma.task.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          completed: true,
          dueDate: true,
          createdAt: true,
        },
      }),

      // 3. Active habits with their completion logs
      prisma.habit.findMany({
        where: {
          userId: user.id,
          archivedDate: null,
        },
        include: {
          completionLogs: true,
        },
        orderBy: {
          createdDate: "asc",
        },
      }),

      // 4. Most recent journal entry
      prisma.journalEntry.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          content: true,
          updatedAt: true,
        },
      }),

      // 5. Journal entries this week count
      prisma.journalEntry.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: startOfWeek,
          },
        },
      }),

      // 6. Total journal entries count
      prisma.journalEntry.count({
        where: { userId: user.id },
      }),
    ]);

    // ─────────────────────────────────────────────────────────
    // Focus Calculations
    // ─────────────────────────────────────────────────────────
    const minutesByDate = new Map<string, number>();
    let todayMinutes = 0;
    let todaySessionsCount = 0;
    let total7DaysMinutes = 0;

    for (const session of pomodoroSessions) {
      const sessionDateStr = formatDateKey(new Date(session.completedAt));
      const mins = Math.round(session.durationSec / 60);
      const existing = minutesByDate.get(sessionDateStr) || 0;
      minutesByDate.set(sessionDateStr, existing + mins);

      total7DaysMinutes += mins;

      if (sessionDateStr === todayStr) {
        todayMinutes += mins;
        todaySessionsCount++;
      }
    }

    const last7Days: DailyFocusPoint[] = last7DaysDates.map((item) => ({
      dateStr: item.dateStr,
      dayLabel: item.dayLabel,
      minutes: minutesByDate.get(item.dateStr) || 0,
      isToday: item.isToday,
    }));

    const dailyAverage7DaysMinutes = Math.round(total7DaysMinutes / 7);
    let diffFromAvgPercent: number | null = null;
    if (dailyAverage7DaysMinutes > 0) {
      diffFromAvgPercent = Math.round(
        ((todayMinutes - dailyAverage7DaysMinutes) / dailyAverage7DaysMinutes) * 100
      );
    }

    // ─────────────────────────────────────────────────────────
    // Task Calculations
    // ─────────────────────────────────────────────────────────
    let openCount = 0;
    let completedCount = 0;
    let completedTodayCount = 0;
    let completedThisWeekCount = 0;
    let overdueCount = 0;

    for (const task of tasksRaw) {
      if (task.completed) {
        completedCount++;
        if (task.createdAt >= startOfToday) {
          completedTodayCount++;
        }
        if (task.createdAt >= startOfWeek) {
          completedThisWeekCount++;
        }
      } else {
        openCount++;
        if (task.dueDate) {
          const taskDueStr = task.dueDate.toISOString().split("T")[0];
          if (taskDueStr < todayStr) {
            overdueCount++;
          }
        }
      }
    }

    // ─────────────────────────────────────────────────────────
    // Habit Calculations (Reusing features/habit-tracker/utils)
    // ─────────────────────────────────────────────────────────
    const habits: HabitSummaryItem[] = habitsRaw.map((raw) => {
      const habit = formatHabit(raw);
      const logs = raw.completionLogs.map(formatCompletionLog);
      const streak = calculateHabitStreak(habit, logs, todayStr);
      const miniGrid = getHeatmapGrid(habit, logs, 5); // 5 weeks (~35 days)
      return {
        habit,
        streak,
        miniGrid,
      };
    });

    // ─────────────────────────────────────────────────────────
    // Journal Calculations
    // ─────────────────────────────────────────────────────────
    const journalRecent = recentJournalEntry
      ? {
          id: recentJournalEntry.id,
          title: recentJournalEntry.title || "Untitled Entry",
          snippet: createSnippet(recentJournalEntry.content),
          updatedAt: recentJournalEntry.updatedAt.toISOString(),
        }
      : null;

    return {
      success: true,
      guest: false,
      data: {
        focus: {
          todayMinutes,
          todaySessionsCount,
          dailyAverage7DaysMinutes,
          diffFromAvgPercent,
          last7Days,
        },
        tasks: {
          openCount,
          completedCount,
          completedTodayCount,
          completedThisWeekCount,
          overdueCount,
          totalCount: tasksRaw.length,
        },
        habits,
        journal: {
          recentEntry: journalRecent,
          entriesThisWeekCount: journalEntriesThisWeek,
          totalEntriesCount: totalJournalEntries,
        },
        isGuest: false,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { success: false, error: "Failed to load dashboard data" };
  }
}

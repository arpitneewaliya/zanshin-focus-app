import {
  Habit,
  HabitColor,
  HabitCompletionLog,
  HabitStreak,
  HeatmapCell,
} from "./types";

/**
 * Format a Date object to YYYY-MM-DD string in local time
 */
export function formatDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to local Date object at start of day
 */
export function parseDateKey(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Check if a date is scheduled for a habit
 */
export function isDateScheduled(habit: Habit, dateInput: Date | string): boolean {
  const date = typeof dateInput === "string" ? parseDateKey(dateInput) : dateInput;
  const dateStr = formatDateKey(date);

  // Not scheduled before creation date
  if (dateStr < habit.createdDate) {
    return false;
  }

  const { frequency } = habit;
  if (frequency.type === "daily") {
    return true;
  }

  if (frequency.type === "weekdays") {
    const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    return habit.frequency.daysOfWeek?.includes(dayOfWeek) ?? false;
  }

  if (frequency.type === "weekly_target") {
    return true; // Any day can count towards weekly target
  }

  return true;
}

/**
 * Calculate current streak and longest streak for a habit adhering strictly to AGENTS.md rules:
 * Streak = consecutive scheduled occurrences completed.
 * Unscheduled days are neutral and don't break a streak.
 */
export function calculateHabitStreak(
  habit: Habit,
  logs: HabitCompletionLog[],
  targetDateStr: string = formatDateKey()
): HabitStreak {
  const habitLogsMap = new Map<string, "completed" | "missed">();
  for (const log of logs) {
    if (log.habitId === habit.id) {
      habitLogsMap.set(log.date, log.status);
    }
  }

  if (habit.frequency.type === "weekly_target") {
    const targetPerWeek = habit.frequency.targetDaysPerWeek || 1;
    let currentStreak = 0;
    let longestStreak = 0;

    // Get created date and target date
    const startDate = parseDateKey(habit.createdDate);
    const endDate = parseDateKey(targetDateStr);

    // Adjust start date to Monday of that week
    const startDay = startDate.getDay();
    const distToMon = (startDay + 6) % 7;
    const currentWeekMon = new Date(startDate);
    currentWeekMon.setDate(startDate.getDate() - distToMon);

    const targetDay = endDate.getDay();
    const distToMonEnd = (targetDay + 6) % 7;
    const lastWeekMon = new Date(endDate);
    lastWeekMon.setDate(endDate.getDate() - distToMonEnd);

    const iterWeek = new Date(currentWeekMon);
    while (iterWeek <= lastWeekMon) {
      const isCurrentWeek = iterWeek.getTime() === lastWeekMon.getTime();
      let completedInWeek = 0;

      for (let i = 0; i < 7; i++) {
        const d = new Date(iterWeek);
        d.setDate(iterWeek.getDate() + i);
        const dStr = formatDateKey(d);
        if (habitLogsMap.get(dStr) === "completed") {
          completedInWeek++;
        }
      }

      if (completedInWeek >= targetPerWeek) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else if (!isCurrentWeek) {
        currentStreak = 0;
      }

      iterWeek.setDate(iterWeek.getDate() + 7);
    }

    return { currentStreak, longestStreak };
  }

  // Daily or Specific Weekdays logic
  const startDate = parseDateKey(habit.createdDate);
  const endDate = parseDateKey(targetDateStr);

  const scheduledDates: string[] = [];
  const curr = new Date(startDate);

  while (curr <= endDate) {
    if (isDateScheduled(habit, curr)) {
      scheduledDates.push(formatDateKey(curr));
    }
    curr.setDate(curr.getDate() + 1);
  }

  let currentStreak = 0;
  let longestStreak = 0;

  for (const dateStr of scheduledDates) {
    const status = habitLogsMap.get(dateStr);

    if (status === "completed") {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else if (status === "missed") {
      currentStreak = 0;
    } else {
      // Unmarked date
      if (dateStr < targetDateStr) {
        currentStreak = 0; // Past scheduled date missed
      }
      // If dateStr === targetDateStr (today), it's pending so we keep currentStreak intact
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Generate 52-week heatmap grid data for a habit
 */
export function getHeatmapGrid(
  habit: Habit,
  logs: HabitCompletionLog[],
  weeksCount: number = 52
): HeatmapCell[][] {
  const logMap = new Map<string, "completed" | "missed">();
  for (const log of logs) {
    if (log.habitId === habit.id) {
      logMap.set(log.date, log.status);
    }
  }

  const today = new Date();
  const todayStr = formatDateKey(today);

  // Align end date to Saturday of current week (or Sunday)
  const currentDayOfWeek = today.getDay(); // 0 = Sun, ..., 6 = Sat
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - currentDayOfWeek)); // End on Saturday

  // Calculate start date (weeksCount weeks back starting on Sunday)
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (weeksCount * 7 - 1));

  const grid: HeatmapCell[][] = [];
  let currentWeek: HeatmapCell[] = [];

  const curr = new Date(startDate);
  while (curr <= endDate) {
    const dateStr = formatDateKey(curr);
    const status = logMap.get(dateStr) || "none";
    const isScheduled = isDateScheduled(habit, curr);
    const isToday = dateStr === todayStr;
    const isFuture = dateStr > todayStr;
    const isBeforeCreation = dateStr < habit.createdDate;

    currentWeek.push({
      date: new Date(curr),
      dateStr,
      status,
      isScheduled,
      isToday,
      isFuture,
      isBeforeCreation,
    });

    if (currentWeek.length === 7) {
      grid.push(currentWeek);
      currentWeek = [];
    }

    curr.setDate(curr.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    grid.push(currentWeek);
  }

  return grid;
}

/**
 * Map habit colors to Tailwind styles
 */
export function getHabitColorClasses(color: HabitColor) {
  const colorMap: Record<
    HabitColor,
    {
      label: string;
      dot: string;
      badge: string;
      text: string;
      activeBg: string;
      heatmapCompleted: string;
      heatmapPending: string;
      ring: string;
    }
  > = {
    indigo: {
      label: "Indigo",
      dot: "bg-indigo-500",
      badge:
        "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
      text: "text-indigo-600 dark:text-indigo-400",
      activeBg: "bg-indigo-500 text-white hover:bg-indigo-600",
      heatmapCompleted: "bg-indigo-500 border-indigo-600/50",
      heatmapPending: "bg-indigo-500/20 border-indigo-500/30",
      ring: "ring-indigo-500",
    },
    emerald: {
      label: "Emerald",
      dot: "bg-emerald-500",
      badge:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      text: "text-emerald-600 dark:text-emerald-400",
      activeBg: "bg-emerald-500 text-white hover:bg-emerald-600",
      heatmapCompleted: "bg-emerald-500 border-emerald-600/50",
      heatmapPending: "bg-emerald-500/20 border-emerald-500/30",
      ring: "ring-emerald-500",
    },
    amber: {
      label: "Amber",
      dot: "bg-amber-500",
      badge:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
      text: "text-amber-600 dark:text-amber-400",
      activeBg: "bg-amber-500 text-white hover:bg-amber-600",
      heatmapCompleted: "bg-amber-500 border-amber-600/50",
      heatmapPending: "bg-amber-500/20 border-amber-500/30",
      ring: "ring-amber-500",
    },
    rose: {
      label: "Rose",
      dot: "bg-rose-500",
      badge:
        "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
      text: "text-rose-600 dark:text-rose-400",
      activeBg: "bg-rose-500 text-white hover:bg-rose-600",
      heatmapCompleted: "bg-rose-500 border-rose-600/50",
      heatmapPending: "bg-rose-500/20 border-rose-500/30",
      ring: "ring-rose-500",
    },
    violet: {
      label: "Violet",
      dot: "bg-violet-500",
      badge:
        "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
      text: "text-violet-600 dark:text-violet-400",
      activeBg: "bg-violet-500 text-white hover:bg-violet-600",
      heatmapCompleted: "bg-violet-500 border-violet-600/50",
      heatmapPending: "bg-violet-500/20 border-violet-500/30",
      ring: "ring-violet-500",
    },
    cyan: {
      label: "Cyan",
      dot: "bg-cyan-500",
      badge:
        "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
      text: "text-cyan-600 dark:text-cyan-400",
      activeBg: "bg-cyan-500 text-white hover:bg-cyan-600",
      heatmapCompleted: "bg-cyan-500 border-cyan-600/50",
      heatmapPending: "bg-cyan-500/20 border-cyan-500/30",
      ring: "ring-cyan-500",
    },
    sky: {
      label: "Sky",
      dot: "bg-sky-500",
      badge:
        "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
      text: "text-sky-600 dark:text-sky-400",
      activeBg: "bg-sky-500 text-white hover:bg-sky-600",
      heatmapCompleted: "bg-sky-500 border-sky-600/50",
      heatmapPending: "bg-sky-500/20 border-sky-500/30",
      ring: "ring-sky-500",
    },
    orange: {
      label: "Orange",
      dot: "bg-orange-500",
      badge:
        "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
      text: "text-orange-600 dark:text-orange-400",
      activeBg: "bg-orange-500 text-white hover:bg-orange-600",
      heatmapCompleted: "bg-orange-500 border-orange-600/50",
      heatmapPending: "bg-orange-500/20 border-orange-500/30",
      ring: "ring-orange-500",
    },
  };

  return colorMap[color] || colorMap.indigo;
}

/**
 * Format frequency object into human readable label
 */
export function formatFrequencyLabel(habit: Habit): string {
  const { type, daysOfWeek, targetDaysPerWeek } = habit.frequency;
  if (type === "daily") return "Daily";
  if (type === "weekly_target") return `${targetDaysPerWeek || 1}x / week`;
  if (type === "weekdays" && daysOfWeek) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (daysOfWeek.length === 5 && daysOfWeek.every((d) => d >= 1 && d <= 5)) {
      return "Mon – Fri";
    }
    if (daysOfWeek.length === 2 && daysOfWeek.includes(0) && daysOfWeek.includes(6)) {
      return "Weekends";
    }
    return daysOfWeek.map((d) => dayNames[d]).join(", ");
  }
  return "Custom";
}

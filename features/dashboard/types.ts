import { Habit, HabitStreak, HeatmapCell } from "@/features/habit-tracker/types";
import { TaskPriority } from "@/features/tasks/types";

export interface DailyFocusPoint {
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // "Mon", "Tue", etc.
  minutes: number;
  isToday: boolean;
}

export interface FocusMetrics {
  todayMinutes: number;
  todaySessionsCount: number;
  dailyAverage7DaysMinutes: number;
  diffFromAvgPercent: number | null; // e.g. +20% or -15%, null if avg is 0
  last7Days: DailyFocusPoint[];
}

export interface TaskSummaryItem {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate?: string | null;
  completed: boolean;
}

export interface TaskMetrics {
  openCount: number;
  completedCount: number;
  completedTodayCount: number;
  completedThisWeekCount: number;
  overdueCount: number;
  totalCount: number;
  recentTasks?: TaskSummaryItem[];
}

export interface HabitSummaryItem {
  habit: Habit;
  streak: HabitStreak;
  miniGrid: HeatmapCell[][];
  completedToday: boolean;
}

export interface JournalMetrics {
  recentEntry: {
    id: string;
    title: string;
    snippet: string;
    updatedAt: string;
  } | null;
  entriesThisWeekCount: number;
  totalEntriesCount: number;
}

export interface DashboardData {
  focus: FocusMetrics;
  tasks: TaskMetrics;
  habits: HabitSummaryItem[];
  journal: JournalMetrics;
  isGuest: boolean;
  userName?: string | null;
}

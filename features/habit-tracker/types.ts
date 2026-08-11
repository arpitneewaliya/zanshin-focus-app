export type HabitColor =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "cyan"
  | "sky"
  | "orange";

export type HabitFrequencyType = "daily" | "weekdays" | "weekly_target";

export interface HabitFrequency {
  type: HabitFrequencyType;
  /** Days of the week for specific weekdays: 0 = Sun, 1 = Mon, ..., 6 = Sat */
  daysOfWeek?: number[];
  /** Target count of days per week for N times per week (1 - 7) */
  targetDaysPerWeek?: number;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: HabitColor;
  frequency: HabitFrequency;
  createdDate: string; // YYYY-MM-DD
  archivedDate?: string | null; // YYYY-MM-DD when archived, null if active
}

export type CompletionStatus = "completed" | "missed";

export interface HabitCompletionLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: CompletionStatus;
}

export interface HabitStreak {
  currentStreak: number;
  longestStreak: number;
}

export interface HeatmapCell {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  status: CompletionStatus | "none";
  isScheduled: boolean;
  isToday: boolean;
  isFuture: boolean;
  isBeforeCreation: boolean;
}

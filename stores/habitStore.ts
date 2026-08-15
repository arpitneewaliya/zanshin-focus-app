import { create } from "zustand";
import {
  Habit,
  HabitColor,
  HabitCompletionLog,
  HabitFrequency,
  CompletionStatus,
} from "@/features/habit-tracker/types";
import { formatDateKey } from "@/features/habit-tracker/utils";

interface HabitState {
  habits: Habit[];
  completionLogs: HabitCompletionLog[];

  // Actions
  setHabitsAndLogs: (habits: Habit[], logs: HabitCompletionLog[]) => void;
  addHabit: (habit: Habit) => void;
  editHabit: (
    id: string,
    updates: Partial<Pick<Habit, "name" | "description" | "color" | "frequency">>
  ) => void;
  archiveHabit: (id: string, archivedDate?: string) => void;
  unarchiveHabit: (id: string) => void;
  deleteHabit: (id: string) => void;

  setLog: (log: HabitCompletionLog) => void;
  removeLog: (habitId: string, dateStr: string) => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  completionLogs: [],

  setHabitsAndLogs: (habits, completionLogs) => set({ habits, completionLogs }),

  addHabit: (newHabit) => {
    set((state) => ({
      habits: [newHabit, ...state.habits.filter((h) => h.id !== newHabit.id)],
    }));
  },

  editHabit: (id, updates) => {
    set((state) => ({
      habits: state.habits.map((habit) => {
        if (habit.id !== id) return habit;
        return {
          ...habit,
          name: updates.name !== undefined ? updates.name.trim() : habit.name,
          description:
            updates.description !== undefined
              ? updates.description.trim() || undefined
              : habit.description,
          color: updates.color ?? habit.color,
          frequency: updates.frequency ?? habit.frequency,
        };
      }),
    }));
  },

  archiveHabit: (id, archivedDate = formatDateKey()) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, archivedDate } : habit
      ),
    }));
  },

  unarchiveHabit: (id) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, archivedDate: null } : habit
      ),
    }));
  },

  deleteHabit: (id) => {
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id),
      completionLogs: state.completionLogs.filter((log) => log.habitId !== id),
    }));
  },

  setLog: (newLog) => {
    set((state) => {
      const filtered = state.completionLogs.filter(
        (l) => !(l.habitId === newLog.habitId && l.date === newLog.date)
      );
      return { completionLogs: [...filtered, newLog] };
    });
  },

  removeLog: (habitId, dateStr) => {
    set((state) => ({
      completionLogs: state.completionLogs.filter(
        (l) => !(l.habitId === habitId && l.date === dateStr)
      ),
    }));
  },
}));

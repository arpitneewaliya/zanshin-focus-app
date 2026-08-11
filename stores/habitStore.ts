import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Habit,
  HabitColor,
  HabitCompletionLog,
  HabitFrequency,
} from "@/features/habit-tracker/types";
import { formatDateKey } from "@/features/habit-tracker/utils";

interface HabitState {
  habits: Habit[];
  completionLogs: HabitCompletionLog[];

  // Actions
  addHabit: (data: {
    name: string;
    description?: string;
    color: HabitColor;
    frequency: HabitFrequency;
  }) => void;

  editHabit: (
    id: string,
    updates: Partial<Pick<Habit, "name" | "description" | "color" | "frequency">>
  ) => void;

  archiveHabit: (id: string) => void;
  unarchiveHabit: (id: string) => void;
  deleteHabit: (id: string) => void;

  markHabitCompleted: (habitId: string, dateStr?: string) => void;
  markHabitMissed: (habitId: string, dateStr?: string) => void;
  undoHabitStatus: (habitId: string, dateStr?: string) => void;
  toggleHabitStatus: (habitId: string, dateStr?: string) => void;
}

// Generate realistic initial demo logs for realistic heatmaps and streaks
function generateDemoLogs(): HabitCompletionLog[] {
  const logs: HabitCompletionLog[] = [];
  const today = new Date();

  // Helper to subtract days
  const subDays = (d: Date, days: number) => {
    const res = new Date(d);
    res.setDate(res.getDate() - days);
    return formatDateKey(res);
  };

  // Demo Habit 1 (Morning Deep Work - Daily, active streak ~14)
  for (let i = 0; i <= 60; i++) {
    const dStr = subDays(today, i);
    // Complete most days, especially past 14 days
    if (i <= 14 || (i % 7 !== 2 && i % 7 !== 5)) {
      logs.push({
        id: `demo-log-h1-${i}`,
        habitId: "demo-habit-1",
        date: dStr,
        status: "completed",
      });
    } else if (i > 14 && i % 7 === 2) {
      logs.push({
        id: `demo-log-h1-${i}`,
        habitId: "demo-habit-1",
        date: dStr,
        status: "missed",
      });
    }
  }

  // Demo Habit 2 (Gym & Fitness - Mon/Wed/Fri, active streak ~6)
  for (let i = 0; i <= 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay();
    const dStr = formatDateKey(d);

    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      if (i <= 14) {
        logs.push({
          id: `demo-log-h2-${i}`,
          habitId: "demo-habit-2",
          date: dStr,
          status: "completed",
        });
      } else if (i % 2 === 0) {
        logs.push({
          id: `demo-log-h2-${i}`,
          habitId: "demo-habit-2",
          date: dStr,
          status: "completed",
        });
      }
    }
  }

  // Demo Habit 3 (Read 20 Pages - 5x/week, active streak ~3)
  for (let i = 0; i <= 45; i++) {
    const dStr = subDays(today, i);
    if (i % 7 !== 0 && i % 7 !== 6) {
      logs.push({
        id: `demo-log-h3-${i}`,
        habitId: "demo-habit-3",
        date: dStr,
        status: "completed",
      });
    }
  }

  return logs;
}

const initialHabits: Habit[] = [
  {
    id: "demo-habit-1",
    name: "Morning Deep Work",
    description: "Focus on priority engineering & creative writing before checking messages.",
    color: "indigo",
    frequency: { type: "daily" },
    createdDate: formatDateKey(new Date(Date.now() - 60 * 86400000)),
    archivedDate: null,
  },
  {
    id: "demo-habit-2",
    name: "Gym & Resistance Training",
    description: "Consistency over intensity — strength training session.",
    color: "emerald",
    frequency: { type: "weekdays", daysOfWeek: [1, 3, 5] },
    createdDate: formatDateKey(new Date(Date.now() - 60 * 86400000)),
    archivedDate: null,
  },
  {
    id: "demo-habit-3",
    name: "Read 20 Pages",
    description: "Read non-fiction books on psychology, architecture, or design.",
    color: "amber",
    frequency: { type: "weekly_target", targetDaysPerWeek: 5 },
    createdDate: formatDateKey(new Date(Date.now() - 45 * 86400000)),
    archivedDate: null,
  },
];

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: initialHabits,
      completionLogs: generateDemoLogs(),

      addHabit: ({ name, description, color, frequency }) => {
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `habit-${Date.now()}`;

        const newHabit: Habit = {
          id,
          name: name.trim(),
          description: description?.trim() || undefined,
          color,
          frequency,
          createdDate: formatDateKey(),
          archivedDate: null,
        };

        set((state) => ({
          habits: [newHabit, ...state.habits],
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

      archiveHabit: (id) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? { ...habit, archivedDate: formatDateKey() }
              : habit
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
          completionLogs: state.completionLogs.filter(
            (log) => log.habitId !== id
          ),
        }));
      },

      markHabitCompleted: (habitId, dateStr = formatDateKey()) => {
        set((state) => {
          const filtered = state.completionLogs.filter(
            (l) => !(l.habitId === habitId && l.date === dateStr)
          );
          const newLog: HabitCompletionLog = {
            id:
              typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `log-${Date.now()}-${Math.random()}`,
            habitId,
            date: dateStr,
            status: "completed",
          };
          return { completionLogs: [...filtered, newLog] };
        });
      },

      markHabitMissed: (habitId, dateStr = formatDateKey()) => {
        set((state) => {
          const filtered = state.completionLogs.filter(
            (l) => !(l.habitId === habitId && l.date === dateStr)
          );
          const newLog: HabitCompletionLog = {
            id:
              typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `log-${Date.now()}-${Math.random()}`,
            habitId,
            date: dateStr,
            status: "missed",
          };
          return { completionLogs: [...filtered, newLog] };
        });
      },

      undoHabitStatus: (habitId, dateStr = formatDateKey()) => {
        set((state) => ({
          completionLogs: state.completionLogs.filter(
            (l) => !(l.habitId === habitId && l.date === dateStr)
          ),
        }));
      },

      toggleHabitStatus: (habitId, dateStr = formatDateKey()) => {
        const existing = get().completionLogs.find(
          (l) => l.habitId === habitId && l.date === dateStr
        );

        if (!existing) {
          get().markHabitCompleted(habitId, dateStr);
        } else if (existing.status === "completed") {
          get().markHabitMissed(habitId, dateStr);
        } else {
          get().undoHabitStatus(habitId, dateStr);
        }
      },
    }),
    {
      name: "zanshin-habits-storage",
    }
  )
);

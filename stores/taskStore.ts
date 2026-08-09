import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Task,
  TaskPriority,
  FilterStatus,
  FilterPriority,
  SortBy,
  SortOrder,
} from "@/features/tasks/types";

interface TaskState {
  tasks: Task[];
  filterStatus: FilterStatus;
  filterPriority: FilterPriority;
  sortBy: SortBy;
  sortOrder: SortOrder;

  // Actions
  addTask: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: TaskPriority;
  }) => void;
  editTask: (
    id: string,
    updates: Partial<Pick<Task, "title" | "description" | "dueDate" | "priority">>
  ) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setFilterPriority: (priority: FilterPriority) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  clearCompletedTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: "demo-task-1",
          title: "Complete Pomodoro Focus Session",
          description: "Run a 25-minute deep work session with distraction blocking.",
          dueDate: new Date().toISOString().split("T")[0],
          priority: "high",
          completed: false,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: "demo-task-2",
          title: "Organize Weekly Project Notes",
          description: "Review personal journal entries and summarize key takeaways.",
          dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          priority: "medium",
          completed: false,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: "demo-task-3",
          title: "Refactor Theme Variables",
          description: "Ensure color palette consistency across all features.",
          dueDate: undefined,
          priority: "low",
          completed: true,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
      ],
      filterStatus: "all",
      filterPriority: "all",
      sortBy: "createdAt",
      sortOrder: "desc",

      addTask: ({ title, description, dueDate, priority = "medium" }) => {
        const newTask: Task = {
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`,
          title: title.trim(),
          description: description?.trim() || undefined,
          dueDate: dueDate || undefined,
          priority,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },

      editTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            return {
              ...task,
              title: updates.title !== undefined ? updates.title.trim() : task.title,
              description:
                updates.description !== undefined
                  ? updates.description.trim() || undefined
                  : task.description,
              dueDate: updates.dueDate !== undefined ? updates.dueDate || undefined : task.dueDate,
              priority: updates.priority ?? task.priority,
            };
          }),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleTaskComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },

      setFilterStatus: (status) => set({ filterStatus: status }),
      setFilterPriority: (priority) => set({ filterPriority: priority }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),

      clearCompletedTasks: () => {
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        }));
      },
    }),
    {
      name: "zanshin-tasks-storage",
    }
  )
);

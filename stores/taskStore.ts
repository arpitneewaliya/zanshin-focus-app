import { create } from "zustand";
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
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
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

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  filterStatus: "all",
  filterPriority: "all",
  sortBy: "createdAt",
  sortOrder: "desc",

  setTasks: (tasks) => set({ tasks }),

  addTask: (newTask) => {
    set((state) => ({
      tasks: [newTask, ...state.tasks.filter((t) => t.id !== newTask.id)],
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
          dueDate:
            updates.dueDate !== undefined ? updates.dueDate || undefined : task.dueDate,
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
}));

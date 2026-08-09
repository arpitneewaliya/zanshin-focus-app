export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // YYYY-MM-DD format
  priority: TaskPriority;
  completed: boolean;
  createdAt: string; // ISO timestamp
}

export type FilterStatus = "all" | "active" | "completed";
export type FilterPriority = "all" | "low" | "medium" | "high";
export type SortBy = "dueDate" | "priority" | "createdAt";
export type SortOrder = "asc" | "desc";

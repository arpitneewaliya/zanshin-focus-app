"use client";

import {
  FilterStatus,
  FilterPriority,
  SortBy,
} from "@/features/tasks/types";
import { useTaskStore } from "@/stores/taskStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowUpDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFiltersProps {
  onAddNewTask: () => void;
}

const statusOptions: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All Tasks" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function TaskFilters({ onAddNewTask }: TaskFiltersProps) {
  const filterStatus = useTaskStore((state) => state.filterStatus);
  const filterPriority = useTaskStore((state) => state.filterPriority);
  const sortBy = useTaskStore((state) => state.sortBy);
  const sortOrder = useTaskStore((state) => state.sortOrder);

  const setFilterStatus = useTaskStore((state) => state.setFilterStatus);
  const setFilterPriority = useTaskStore((state) => state.setFilterPriority);
  const setSortBy = useTaskStore((state) => state.setSortBy);
  const setSortOrder = useTaskStore((state) => state.setSortOrder);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-xl border border-border/50 bg-card/40 backdrop-blur-xs">
      {/* Left side: Status Filter Pills */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/40 w-fit">
        {statusOptions.map((option) => {
          const isActive = filterStatus === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer select-none",
                isActive
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Right side: Priority Filter, Sorting, Add Button */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Priority Filter */}
        <Select
          value={filterPriority}
          onValueChange={(val) => setFilterPriority(val as FilterPriority)}
        >
          <SelectTrigger className="h-8 text-xs w-[130px]">
            <div className="flex items-center gap-1.5 truncate">
              <Filter className="size-3 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Priority" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By Dropdown */}
        <Select
          value={sortBy}
          onValueChange={(val) => setSortBy(val as SortBy)}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Direction Toggle */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={toggleSortOrder}
          title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          className="h-8 size-8"
        >
          <ArrowUpDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              sortOrder === "asc" && "rotate-180"
            )}
          />
          <span className="sr-only">Toggle sort direction</span>
        </Button>

        {/* Primary Add Task Button */}
        <Button onClick={onAddNewTask} size="sm" className="h-8 gap-1.5 ml-auto sm:ml-0">
          <Plus className="size-3.5" />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  );
}

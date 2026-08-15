"use client";

import { useState } from "react";
import { Task, TaskPriority } from "@/features/tasks/types";
import { useTaskStore } from "@/stores/taskStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask as createTaskAction, updateTask as updateTaskAction } from "@/app/actions/tasks";
import { Plus, Edit2, Calendar, AlertCircle, Loader2 } from "lucide-react";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task | null;
}

function TaskFormContent({
  taskToEdit,
  onClose,
}: {
  taskToEdit?: Task | null;
  onClose: () => void;
}) {
  const addTask = useTaskStore((state) => state.addTask);
  const editTask = useTaskStore((state) => state.editTask);

  const isEditing = Boolean(taskToEdit);

  const [title, setTitle] = useState(taskToEdit?.title ?? "");
  const [description, setDescription] = useState(taskToEdit?.description ?? "");
  const [dueDate, setDueDate] = useState(taskToEdit?.dueDate ?? "");
  const [priority, setPriority] = useState<TaskPriority>(
    taskToEdit?.priority ?? "medium"
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (isEditing && taskToEdit) {
        const result = await updateTaskAction(taskToEdit.id, {
          title,
          description: description || undefined,
          dueDate: dueDate || undefined,
          priority,
        });

        if (!result.success || !result.data) {
          setError(result.error || "Failed to update task");
          setIsSubmitting(false);
          return;
        }

        editTask(taskToEdit.id, result.data);
      } else {
        const result = await createTaskAction({
          title,
          description: description || undefined,
          dueDate: dueDate || undefined,
          priority,
        });

        if (!result.success || !result.data) {
          setError(result.error || "Failed to create task");
          setIsSubmitting(false);
          return;
        }

        addTask(result.data);
      }

      onClose();
    } catch (err) {
      console.error("Error submitting task form:", err);
      setError("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
          {isEditing ? (
            <>
              <Edit2 className="size-5 text-primary" />
              Edit Task
            </>
          ) : (
            <>
              <Plus className="size-5 text-primary" />
              Create New Task
            </>
          )}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update task details, due date, or priority level."
            : "Add a focus task to keep track of your productivity goals."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Title Field */}
        <div className="space-y-1.5">
          <Label htmlFor="task-title" className="text-sm font-medium">
            Task Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="task-title"
            placeholder="e.g. Draft quarterly feature spec"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            disabled={isSubmitting}
            autoFocus
            className={error ? "border-destructive focus-visible:ring-destructive/20" : ""}
          />
          {error && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="size-3.5" />
              {error}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-1.5">
          <Label htmlFor="task-description" className="text-sm font-medium">
            Description <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="task-description"
            placeholder="Add key subtasks, requirements, or links..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Priority & Due Date grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Priority */}
          <div className="space-y-1.5">
            <Label htmlFor="task-priority" className="text-sm font-medium">
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={(val) => setPriority(val as TaskPriority)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="task-priority" className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Low Priority
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    Medium Priority
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-rose-500" />
                    High Priority
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label htmlFor="task-due-date" className="text-sm font-medium">
              Due Date <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <div className="relative">
              <Input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
                className="pr-8"
              />
              <Calendar className="size-4 absolute right-2.5 top-2.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" />
                Saving...
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Task"
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function TaskFormDialog({
  open,
  onOpenChange,
  taskToEdit,
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        {open && (
          <TaskFormContent
            key={taskToEdit ? taskToEdit.id : "new-task"}
            taskToEdit={taskToEdit}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

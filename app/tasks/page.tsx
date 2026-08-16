import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TaskManagerView } from "@/features/tasks/components/task-manager-view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTasks } from "@/app/actions/tasks";

export const metadata = {
  title: "Task Manager - Zanshin Focus",
  description: "Organize focus tasks, set priorities, track due dates, and manage daily productivity goals.",
};

export default async function TasksPage() {
  const result = await getTasks();
  const initialTasks = result.success && result.data ? result.data : [];
  const initialError = !result.success && !result.guest ? result.error : undefined;

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
        <h1 className="text-xl font-semibold tracking-tight font-heading">
          Task Manager
        </h1>
        <div className="w-24" /> {/* Balance layout */}
      </div>

      {/* Main Task View */}
      <TaskManagerView initialTasks={initialTasks} initialError={initialError} />
    </div>
  );
}

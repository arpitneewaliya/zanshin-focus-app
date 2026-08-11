import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HabitTrackerView } from "@/features/habit-tracker/components/habit-tracker-view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Habit Tracker - Zanshin Focus",
  description:
    "Track recurring habits with calendar heatmaps and consecutive scheduled occurrence streak calculation.",
};

export default function HabitTrackerPage() {
  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
        <h1 className="text-xl font-semibold tracking-tight font-heading">
          Habit Tracker
        </h1>
        <div className="w-24" /> {/* Balance layout */}
      </div>

      {/* Main View */}
      <HabitTrackerView />
    </div>
  );
}

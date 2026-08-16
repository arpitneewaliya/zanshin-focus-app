import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TimerView } from "@/features/timer/components/timer-view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TimerPage() {
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
          Pomodoro Timer
        </h1>
        <div className="w-24" /> {/* Balance layout */}
      </div>

      {/* Main Timer View */}
      <TimerView />
    </div>
  );
}

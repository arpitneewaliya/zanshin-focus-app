import { Timer, ListTodo, BookOpen, Target } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    id: "timer",
    title: "Pomodoro Timer",
    description: "Customizable intervals, break timers, and audio notifications.",
    icon: Timer,
    status: "Phase 1",
  },
  {
    id: "tasks",
    title: "Task Manager",
    description: "Organize priorities, due dates, and track daily focus tasks.",
    icon: ListTodo,
    status: "Phase 2",
  },
  {
    id: "journal",
    title: "Personal Journal",
    description: "Reflect on work sessions with rich text and markdown entries.",
    icon: BookOpen,
    status: "Phase 3",
  },
  {
    id: "focus-mode",
    title: "Focus Mode",
    description: "Distraction-free environment with ambient sounds and visual calm.",
    icon: Target,
    status: "Phase 4",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
          Focus Workspace
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          A minimalist toolset designed for deep work, productivity tracking, and thoughtful reflection.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.id}
              className="relative transition-all duration-200 hover:border-foreground/25 hover:shadow-sm"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-muted text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {feature.title}
                  </CardTitle>
                </div>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {feature.status}
                </span>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

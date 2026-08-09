import Link from "next/link";
import { Timer, ListTodo, BookOpen, Target, ArrowRight } from "lucide-react";
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
    status: "Active",
    href: "/timer",
  },
  {
    id: "tasks",
    title: "Task Manager",
    description: "Organize priorities, due dates, and track daily focus tasks.",
    icon: ListTodo,
    status: "Active",
    href: "/tasks",
  },
  {
    id: "journal",
    title: "Personal Journal",
    description: "Reflect on work sessions with rich text and markdown entries.",
    icon: BookOpen,
    status: "Active",
    href: "/journal",
  },
  {
    id: "focus-mode",
    title: "Focus Mode",
    description: "Distraction-free environment with ambient sounds and visual calm.",
    icon: Target,
    status: "Phase 4",
    href: null,
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
          const isClickable = Boolean(feature.href);

          const cardContent = (
            <Card
              className={`relative transition-all duration-200 ${
                isClickable
                  ? "hover:border-primary/50 hover:shadow-md cursor-pointer group"
                  : "hover:border-foreground/25 hover:shadow-xs"
              }`}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-1.5">
                    {feature.title}
                    {isClickable && (
                      <ArrowRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                    )}
                  </CardTitle>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    isClickable
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
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

          if (isClickable && feature.href) {
            return (
              <Link key={feature.id} href={feature.href} className="block">
                {cardContent}
              </Link>
            );
          }

          return <div key={feature.id}>{cardContent}</div>;
        })}
      </div>
    </div>
  );
}

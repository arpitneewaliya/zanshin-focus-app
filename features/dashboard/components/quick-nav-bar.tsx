import Link from "next/link";
import { Timer, Target, ListTodo, Flame, BookOpen, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const quickLinks = [
  {
    title: "Focus Mode",
    description: "Ambient sounds & distraction blocking",
    icon: Target,
    href: "/focus-mode",
    badge: "Immersive",
  },
  {
    title: "Pomodoro Timer",
    description: "Interval focus sessions & breaks",
    icon: Timer,
    href: "/timer",
    badge: "25m",
  },
  {
    title: "Task Manager",
    description: "Organize priorities & deadlines",
    icon: ListTodo,
    href: "/tasks",
    badge: "Tasks",
  },
  {
    title: "Habit Tracker",
    description: "Streaks & 52-week heatmaps",
    icon: Flame,
    href: "/habit-tracker",
    badge: "Streaks",
  },
  {
    title: "Personal Journal",
    description: "Rich reflections & notes",
    icon: BookOpen,
    href: "/journal",
    badge: "Markdown",
  },
];

export function QuickNavBar() {
  return (
    <Card className="h-full flex flex-col justify-between hover:border-primary/40 transition-colors group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Quick Launch
        </CardTitle>
        <span className="text-xs text-muted-foreground">5 workspaces</span>
      </CardHeader>

      <CardContent className="space-y-2 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickLinks.slice(0, 4).map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="p-2.5 rounded-lg bg-muted/30 border border-border/40 hover:border-primary/50 hover:bg-muted/60 transition-all flex items-center justify-between group/link"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-background text-foreground group-hover/link:bg-primary group-hover/link:text-primary-foreground transition-colors shrink-0">
                    <Icon className="size-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-xs text-foreground group-hover/link:text-primary transition-colors truncate">
                      {link.title}
                    </div>
                  </div>
                </div>
                <ArrowRight className="size-3 text-muted-foreground opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary shrink-0" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useFocusStore, ClockStyle } from "@/stores/focusStore";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Clock,
  Sun,
  Moon,
  Type,
  Maximize,
  Sparkles,
  Calendar,
  Timer,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusSettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const clockStyleOptions: {
  id: ClockStyle;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "digital",
    label: "Digital",
    description: "Standard numeric clock centerpiece",
    icon: Clock,
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Extra-large numerals, maximum whitespace",
    icon: Maximize,
  },
  {
    id: "analog",
    label: "Analog",
    description: "Clean minimal analog clock face",
    icon: Sparkles,
  },
  {
    id: "text",
    label: "Text-based",
    description: "Time expressed softly in prose words",
    icon: Type,
  },
];

export function FocusSettingsPanel({
  isOpen,
  onOpenChange,
}: FocusSettingsPanelProps) {
  const {
    showSeconds,
    setShowSeconds,
    showDate,
    setShowDate,
    use24Hour,
    setUse24Hour,
    clockStyle,
    setClockStyle,
  } = useFocusStore();

  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="max-w-md bg-card/95 backdrop-blur-xl border-border/60 p-6 rounded-3xl shadow-2xl space-y-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <SlidersHorizontal className="size-5" />
            <DialogTitle className="text-xl font-bold tracking-tight">
              Focus Settings
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Customize your distraction-free sanctuary environment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Clock Style Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>Clock Display Style</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {clockStyleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = clockStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setClockStyle(opt.id)}
                    className={cn(
                      "flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer select-none",
                      isSelected
                        ? "bg-primary/10 border-primary text-primary shadow-xs"
                        : "bg-background/40 border-border/40 text-muted-foreground hover:bg-background/80 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 w-full mb-1">
                      <Icon className="size-4 shrink-0" />
                      <span className="text-xs font-semibold">{opt.label}</span>
                    </div>
                    <span className="text-[11px] leading-tight text-muted-foreground opacity-80">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border/40 w-full" />

          {/* Toggle Switches */}
          <div className="space-y-3.5">
            {/* Show Seconds */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium flex items-center gap-1.5">
                  <Timer className="size-3.5 text-muted-foreground" />
                  <span>Show Seconds</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Display live seconds indicator in clock
                </p>
              </div>
              <Switch
                checked={showSeconds}
                onCheckedChange={setShowSeconds}
              />
            </div>

            {/* Show Date */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>Show Date</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Display current day, month and year
                </p>
              </div>
              <Switch
                checked={showDate}
                onCheckedChange={setShowDate}
              />
            </div>

            {/* 12-Hour vs 24-Hour Format */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium flex items-center gap-1.5">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span>24-Hour Format</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Toggle between 24-hour (14:30) and 12-hour (2:30 PM)
                </p>
              </div>
              <Switch
                checked={use24Hour}
                onCheckedChange={setUse24Hour}
              />
            </div>
          </div>

          <div className="h-px bg-border/40 w-full" />

          {/* Theme Mode Toggle (Light / Dark) */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-medium flex items-center gap-1.5">
                {theme === "dark" ? (
                  <Moon className="size-3.5 text-muted-foreground" />
                ) : (
                  <Sun className="size-3.5 text-muted-foreground" />
                )}
                <span>Color Theme</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Switch between dark mode and light mode
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border/40">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setTheme("light")}
                className={cn(
                  "rounded-lg text-xs gap-1 cursor-pointer",
                  theme === "light"
                    ? "bg-background text-foreground shadow-xs font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="size-3.5" />
                <span>Light</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setTheme("dark")}
                className={cn(
                  "rounded-lg text-xs gap-1 cursor-pointer",
                  theme === "dark"
                    ? "bg-background text-foreground shadow-xs font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="size-3.5" />
                <span>Dark</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

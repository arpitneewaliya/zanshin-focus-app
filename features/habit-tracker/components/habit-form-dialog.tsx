"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Habit,
  HabitColor,
  HabitFrequency,
  HabitFrequencyType,
} from "../types";
import { getHabitColorClasses } from "../utils";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface HabitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    color: HabitColor;
    frequency: HabitFrequency;
  }) => void;
  initialHabit?: Habit | null;
}

const COLOR_OPTIONS: HabitColor[] = [
  "indigo",
  "emerald",
  "amber",
  "rose",
  "violet",
  "cyan",
  "sky",
  "orange",
];

const WEEKDAY_NAMES = [
  { day: 1, label: "Mon" },
  { day: 2, label: "Tue" },
  { day: 3, label: "Wed" },
  { day: 4, label: "Thu" },
  { day: 5, label: "Fri" },
  { day: 6, label: "Sat" },
  { day: 0, label: "Sun" },
];

function FormFields({
  initialHabit,
  onSubmit,
  onClose,
}: {
  initialHabit?: Habit | null;
  onSubmit: HabitFormDialogProps["onSubmit"];
  onClose: () => void;
}) {
  const [name, setName] = useState(initialHabit?.name || "");
  const [description, setDescription] = useState(
    initialHabit?.description || ""
  );
  const [color, setColor] = useState<HabitColor>(
    initialHabit?.color || "indigo"
  );
  const [frequencyType, setFrequencyType] = useState<HabitFrequencyType>(
    initialHabit?.frequency.type || "daily"
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialHabit?.frequency.daysOfWeek || [1, 2, 3, 4, 5]
  );
  const [targetPerWeek, setTargetPerWeek] = useState<number>(
    initialHabit?.frequency.targetDaysPerWeek || 3
  );
  const [error, setError] = useState("");

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Habit name is required.");
      return;
    }

    let frequency: HabitFrequency = { type: "daily" };
    if (frequencyType === "weekdays") {
      if (selectedDays.length === 0) {
        setError("Please select at least one weekday.");
        return;
      }
      frequency = {
        type: "weekdays",
        daysOfWeek: [...selectedDays].sort(),
      };
    } else if (frequencyType === "weekly_target") {
      frequency = {
        type: "weekly_target",
        targetDaysPerWeek: targetPerWeek,
      };
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      frequency,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 py-2">
      {/* Habit Name */}
      <div className="space-y-2">
        <Label htmlFor="habit-name" className="text-sm font-medium">
          Habit Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="habit-name"
          placeholder="e.g., Morning Deep Work, Read 20 Pages"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          autoFocus
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="habit-description" className="text-sm font-medium">
          Description <span className="text-muted-foreground font-normal">(Optional)</span>
        </Label>
        <Textarea
          id="habit-description"
          placeholder="Why is this habit important? Add notes or context..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      {/* Color Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tag Color Palette</Label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
          {COLOR_OPTIONS.map((c) => {
            const config = getHabitColorClasses(c);
            const isSelected = color === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "size-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer",
                  config.dot,
                  isSelected
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110 shadow-md"
                    : "opacity-80 hover:opacity-100 hover:scale-105"
                )}
                title={config.label}
              >
                {isSelected && <Check className="size-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frequency Type */}
      <div className="space-y-3 pt-1">
        <Label className="text-sm font-medium">Frequency</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={frequencyType === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setFrequencyType("daily")}
            className="w-full text-xs font-medium"
          >
            Every Day
          </Button>
          <Button
            type="button"
            variant={frequencyType === "weekdays" ? "default" : "outline"}
            size="sm"
            onClick={() => setFrequencyType("weekdays")}
            className="w-full text-xs font-medium"
          >
            Weekdays
          </Button>
          <Button
            type="button"
            variant={
              frequencyType === "weekly_target" ? "default" : "outline"
            }
            size="sm"
            onClick={() => setFrequencyType("weekly_target")}
            className="w-full text-xs font-medium"
          >
            Times / Week
          </Button>
        </div>

        {/* Specific Weekdays Sub-selector */}
        {frequencyType === "weekdays" && (
          <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-2 animate-in fade-in-0 duration-150">
            <span className="text-xs text-muted-foreground block font-medium">
              Select active days:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 justify-between">
              {WEEKDAY_NAMES.map(({ day, label }) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "size-8 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-background text-muted-foreground border-input hover:bg-muted"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Target Per Week Sub-selector */}
        {frequencyType === "weekly_target" && (
          <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-2 animate-in fade-in-0 duration-150">
            <span className="text-xs text-muted-foreground block font-medium">
              Target days per week:
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTargetPerWeek(num)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border cursor-pointer",
                    targetPerWeek === num
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-background text-muted-foreground border-input hover:bg-muted"
                  )}
                >
                  {num}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialHabit ? "Save Changes" : "Create Habit"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function HabitFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialHabit,
}: HabitFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialHabit ? "Edit Habit" : "Create New Habit"}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <FormFields
            key={initialHabit ? initialHabit.id : "new-habit"}
            initialHabit={initialHabit}
            onSubmit={onSubmit}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

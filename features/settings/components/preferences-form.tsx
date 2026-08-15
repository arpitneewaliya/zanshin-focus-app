"use client";

import React, { useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSettingsPreferences, ClockStyleOption } from "@/features/settings/types";
import { useTimerStore } from "@/stores/timerStore";
import { useFocusStore } from "@/stores/focusStore";
import { updateUserSettings } from "@/app/actions/pomodoro";
import { Check, Clock, Sparkles } from "lucide-react";

interface PreferencesFormProps {
  initialSettings: UserSettingsPreferences;
}

export function PreferencesForm({ initialSettings }: PreferencesFormProps) {
  const [settings, setSettings] = useState<UserSettingsPreferences>(initialSettings);
  const [isSaved, setIsSaved] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Partial<UserSettingsPreferences>>({});

  const timerStore = useTimerStore();
  const focusStore = useFocusStore();

  const handleUpdate = (patch: Partial<UserSettingsPreferences>) => {
    // 1. Update local UI state
    setSettings((prev) => ({ ...prev, ...patch }));

    // 2. Sync with client Zustand stores immediately for real-time reactivity
    if (patch.workDuration !== undefined || patch.shortBreakDuration !== undefined ||
        patch.longBreakDuration !== undefined || patch.longBreakInterval !== undefined) {
      timerStore.updateSettings({
        workDuration: patch.workDuration,
        shortBreakDuration: patch.shortBreakDuration,
        longBreakDuration: patch.longBreakDuration,
        longBreakInterval: patch.longBreakInterval,
      });
    }

    if (patch.showSeconds !== undefined) focusStore.setShowSeconds(patch.showSeconds);
    if (patch.showDate !== undefined) focusStore.setShowDate(patch.showDate);
    if (patch.use24Hour !== undefined) focusStore.setUse24Hour(patch.use24Hour);
    if (patch.clockStyle !== undefined) focusStore.setClockStyle(patch.clockStyle);

    // 3. Accumulate pending updates and debounce save to database
    pendingUpdatesRef.current = {
      ...pendingUpdatesRef.current,
      ...patch,
    };

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsSaved(false);

    debounceTimerRef.current = setTimeout(async () => {
      const payload = { ...pendingUpdatesRef.current };
      pendingUpdatesRef.current = {};
      try {
        await updateUserSettings(payload);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      } catch (err) {
        console.error("Failed to save user preferences:", err);
      }
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* Timer Preferences Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Pomodoro Timer Intervals
            </h3>
          </div>
          {isSaved && (
            <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
              <Check className="size-3" />
              Saved automatically
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-muted/20 border border-border/40">
          {/* Work Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-medium">
              <span>Focus Session</span>
              <span className="text-muted-foreground font-mono">{settings.workDuration} min</span>
            </div>
            <Slider
              value={settings.workDuration}
              min={5}
              max={60}
              step={1}
              onValueChange={(val) => handleUpdate({ workDuration: val })}
            />
          </div>

          {/* Short Break */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-medium">
              <span>Short Break</span>
              <span className="text-muted-foreground font-mono">{settings.shortBreakDuration} min</span>
            </div>
            <Slider
              value={settings.shortBreakDuration}
              min={1}
              max={20}
              step={1}
              onValueChange={(val) => handleUpdate({ shortBreakDuration: val })}
            />
          </div>

          {/* Long Break */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-medium">
              <span>Long Break</span>
              <span className="text-muted-foreground font-mono">{settings.longBreakDuration} min</span>
            </div>
            <Slider
              value={settings.longBreakDuration}
              min={5}
              max={45}
              step={1}
              onValueChange={(val) => handleUpdate({ longBreakDuration: val })}
            />
          </div>

          {/* Long Break Interval */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-medium">
              <span>Long Break Interval</span>
              <span className="text-muted-foreground font-mono">Every {settings.longBreakInterval} sessions</span>
            </div>
            <Slider
              value={settings.longBreakInterval}
              min={2}
              max={8}
              step={1}
              onValueChange={(val) => handleUpdate({ longBreakInterval: val })}
            />
          </div>
        </div>
      </div>

      {/* Focus Mode & Clock Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Focus Mode Display
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/20 border border-border/40">
          {/* Clock Style */}
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-medium text-foreground">
              Clock Typography & Layout
            </Label>
            <Select
              value={settings.clockStyle}
              onValueChange={(val) => handleUpdate({ clockStyle: val as ClockStyleOption })}
            >
              <SelectTrigger className="w-full sm:w-64 text-xs h-9">
                <SelectValue placeholder="Select clock style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital" className="text-xs">Digital (Standard font)</SelectItem>
                <SelectItem value="minimal" className="text-xs">Minimal (Light monospace)</SelectItem>
                <SelectItem value="analog" className="text-xs">Analog Dial</SelectItem>
                <SelectItem value="text" className="text-xs">Textual Clock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 24-Hour Time */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/60 border border-border/40">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">24-Hour Format</Label>
              <p className="text-[11px] text-muted-foreground">e.g. 14:30 vs 2:30 PM</p>
            </div>
            <Switch
              checked={settings.use24Hour}
              onCheckedChange={(checked) => handleUpdate({ use24Hour: checked })}
            />
          </div>

          {/* Show Seconds */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/60 border border-border/40">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">Show Seconds</Label>
              <p className="text-[11px] text-muted-foreground">Display ticking seconds in clock</p>
            </div>
            <Switch
              checked={settings.showSeconds}
              onCheckedChange={(checked) => handleUpdate({ showSeconds: checked })}
            />
          </div>

          {/* Show Date */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/60 border border-border/40 md:col-span-2">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">Show Date Header</Label>
              <p className="text-[11px] text-muted-foreground">Show weekday and date below the clock</p>
            </div>
            <Switch
              checked={settings.showDate}
              onCheckedChange={(checked) => handleUpdate({ showDate: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useTimerStore } from "@/stores/timerStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimerSettingsProps {
  onClose?: () => void;
}

export function TimerSettingsPanel({ onClose }: TimerSettingsProps) {
  const {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval,
    updateSettings,
  } = useTimerStore();

  return (
    <Card className="w-full max-w-md mx-auto border-border/60 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Timer Preferences</CardTitle>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-full"
            aria-label="Close settings"
          >
            <X className="size-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        {/* Work Duration */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>Work Duration</span>
            <span className="text-muted-foreground font-mono">{workDuration} min</span>
          </div>
          <Slider
            value={workDuration}
            min={1}
            max={60}
            step={1}
            onValueChange={(val) => updateSettings({ workDuration: val })}
          />
        </div>

        {/* Short Break Duration */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>Short Break Duration</span>
            <span className="text-muted-foreground font-mono">{shortBreakDuration} min</span>
          </div>
          <Slider
            value={shortBreakDuration}
            min={1}
            max={30}
            step={1}
            onValueChange={(val) => updateSettings({ shortBreakDuration: val })}
          />
        </div>

        {/* Long Break Duration */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>Long Break Duration</span>
            <span className="text-muted-foreground font-mono">{longBreakDuration} min</span>
          </div>
          <Slider
            value={longBreakDuration}
            min={1}
            max={45}
            step={1}
            onValueChange={(val) => updateSettings({ longBreakDuration: val })}
          />
        </div>

        {/* Long Break Interval */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>Long Break Interval</span>
            <span className="text-muted-foreground font-mono">Every {longBreakInterval} sessions</span>
          </div>
          <Slider
            value={longBreakInterval}
            min={1}
            max={10}
            step={1}
            onValueChange={(val) => updateSettings({ longBreakInterval: val })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

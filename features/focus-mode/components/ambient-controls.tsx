"use client";

import { AmbientSoundId, AMBIENT_SOUNDS } from "@/features/focus-mode/types";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  VolumeX,
  CloudRain,
  Brain,
  Coffee,
  Trees,
  VolumeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AmbientControlsProps {
  selectedSound: AmbientSoundId;
  onSelectSound: (sound: AmbientSoundId) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const soundIcons: Record<AmbientSoundId, React.ComponentType<{ className?: string }>> = {
  none: VolumeOff,
  rain: CloudRain,
  meditation: Brain,
  cafe: Coffee,
  forest: Trees,
};

export function AmbientControls({
  selectedSound,
  onSelectSound,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
}: AmbientControlsProps) {
  const currentVolumePercentage = Math.round(volume * 100);

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-5 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md shadow-sm space-y-4">
      {/* Sound Selection Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {AMBIENT_SOUNDS.map((sound) => {
          const isSelected = selectedSound === sound.id;
          const Icon = soundIcons[sound.id];

          return (
            <button
              key={sound.id}
              onClick={() => onSelectSound(sound.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-200 cursor-pointer select-none",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-background/40 border-border/40 text-muted-foreground hover:text-foreground hover:bg-background/80"
              )}
              title={sound.description}
            >
              <Icon className="size-3.5" />
              <span>{sound.name}</span>
            </button>
          );
        })}
      </div>

      {/* Volume Control Bar */}
      {selectedSound !== "none" && (
        <div className="flex items-center gap-3 pt-1 px-2">
          {/* Mute Toggle */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleMute}
            title={isMuted ? "Unmute sound" : "Mute sound"}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="size-4 text-destructive" />
            ) : (
              <Volume2 className="size-4" />
            )}
            <span className="sr-only">Toggle mute</span>
          </Button>

          {/* Volume Slider */}
          <div className="flex-1 flex items-center gap-3">
            <Slider
              value={volume * 100}
              onValueChange={(val) => onVolumeChange(val / 100)}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs font-mono text-muted-foreground w-8 text-right shrink-0">
              {isMuted ? "0%" : `${currentVolumePercentage}%`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

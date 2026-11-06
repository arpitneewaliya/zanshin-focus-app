"use client";

import { useMusicPlayerStore } from "@/stores/musicPlayerStore";
import { Headphones, Play, Pause, SkipForward, Volume2, VolumeX, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ZenAmbienceBento() {
  const currentTrack = useMusicPlayerStore((s) => s.currentTrack);
  const isPlaying = useMusicPlayerStore((s) => s.isPlaying);
  const isMuted = useMusicPlayerStore((s) => s.isMuted);
  const togglePlay = useMusicPlayerStore((s) => s.togglePlay);
  const nextTrack = useMusicPlayerStore((s) => s.nextTrack);
  const toggleMute = useMusicPlayerStore((s) => s.toggleMute);

  return (
    <Card className="h-full flex flex-col justify-between border-border/70 hover:border-primary/40 transition-all duration-300 relative overflow-hidden group bg-card/60 backdrop-blur-xs">
      {/* Gentle ambient background glow when playing */}
      {isPlaying && (
        <div className="absolute inset-0 bg-primary/5 rounded-2xl animate-pulse pointer-events-none" />
      )}

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 shadow-xs">
            <Headphones className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
              Zen Ambience
            </CardTitle>
            <p className="text-xs text-muted-foreground">Soundscapes for flow</p>
          </div>
        </div>

        {/* Animated Soundwave Equalizer */}
        <div className="flex items-end gap-1 h-4 px-1" title={isPlaying ? "Audio playing" : "Audio paused"}>
          <span
            className={cn(
              "w-1 bg-primary rounded-full transition-all duration-300",
              isPlaying ? "h-4 animate-[pulse_1s_ease-in-out_infinite]" : "h-1.5 opacity-30"
            )}
          />
          <span
            className={cn(
              "w-1 bg-primary rounded-full transition-all duration-300 delay-75",
              isPlaying ? "h-3 animate-[pulse_0.8s_ease-in-out_infinite]" : "h-2 opacity-30"
            )}
          />
          <span
            className={cn(
              "w-1 bg-primary rounded-full transition-all duration-300 delay-150",
              isPlaying ? "h-4 animate-[pulse_1.2s_ease-in-out_infinite]" : "h-1 opacity-30"
            )}
          />
          <span
            className={cn(
              "w-1 bg-primary rounded-full transition-all duration-300 delay-100",
              isPlaying ? "h-2.5 animate-[pulse_0.9s_ease-in-out_infinite]" : "h-1.5 opacity-30"
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
        {/* Track Title & Artist */}
        <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1 text-center">
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
            {currentTrack?.title || "Deep Focus Sanctuary"}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {currentTrack?.artist || "Zanshin Audio"}
          </p>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center justify-center gap-3">
          {/* Mute toggle */}
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>

          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? "Pause ambient sound" : "Play ambient sound"}
            className="size-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-primary/10"
          >
            {isPlaying ? (
              <Pause className="size-5 fill-primary-foreground" />
            ) : (
              <Play className="size-5 fill-primary-foreground ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            type="button"
            onClick={nextTrack}
            title="Next ambient soundscape"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <SkipForward className="size-4" />
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-sky-500" />
            <span>Synced globally</span>
          </span>
          <span className="text-foreground/70 font-medium">10 tracks</span>
        </div>
      </CardContent>
    </Card>
  );
}


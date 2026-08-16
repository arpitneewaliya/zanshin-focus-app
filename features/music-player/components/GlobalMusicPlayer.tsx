"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Howl } from "howler";
import { motion, AnimatePresence } from "motion/react";
import { useMusicPlayerStore } from "@/stores/musicPlayerStore";
import { TrackList } from "@/features/music-player/components/TrackList";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  Disc,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function GlobalMusicPlayer() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    progress,
    duration,
    seekRequest,
    repeatMode,
    shuffle,
    togglePlay,
    setIsPlaying,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    setProgress,
    setDuration,
    requestSeek,
    clearSeekRequest,
    toggleRepeatMode,
    toggleShuffle,
    toggleQueueOpen,
  } = useMusicPlayerStore();

  const howlRef = useRef<Howl | null>(null);
  const currentSrcRef = useRef<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync Howler instance with currentTrack
  useEffect(() => {
    if (!isMounted || !currentTrack) return;

    if (currentSrcRef.current !== currentTrack.src) {
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }

      currentSrcRef.current = currentTrack.src;

      const howl = new Howl({
        src: [currentTrack.src],
        html5: true,
        volume: isMuted ? 0 : volume,
        onload: () => {
          setDuration(howl.duration());
        },
        onplay: () => {
          setIsPlaying(true);
        },
        onpause: () => {
          setIsPlaying(false);
        },
        onstop: () => {
          setIsPlaying(false);
        },
        onend: () => {
          nextTrack();
        },
        onloaderror: (_id, err) => {
          console.warn("Audio load error:", currentTrack.src, err);
        },
      });

      howlRef.current = howl;

      if (isPlaying) {
        howl.play();
      }
    }
  }, [
    isMounted,
    currentTrack,
    isMuted,
    volume,
    setDuration,
    setIsPlaying,
    nextTrack,
  ]);

  // Sync play/pause state
  useEffect(() => {
    if (!howlRef.current) return;

    if (isPlaying && !howlRef.current.playing()) {
      howlRef.current.play();
    } else if (!isPlaying && howlRef.current.playing()) {
      howlRef.current.pause();
    }
  }, [isPlaying]);

  // Sync volume and mute
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Sync seeking
  useEffect(() => {
    if (howlRef.current && seekRequest !== null) {
      howlRef.current.seek(seekRequest);
      setProgress(seekRequest);
      clearSeekRequest();
    }
  }, [seekRequest, setProgress, clearSeekRequest]);

  // Update progress timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && howlRef.current) {
      interval = setInterval(() => {
        if (howlRef.current && howlRef.current.playing()) {
          const seekVal = howlRef.current.seek() as number;
          if (typeof seekVal === "number" && !isNaN(seekVal)) {
            setProgress(seekVal);
          }
        }
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, setProgress]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
    };
  }, []);

  const isExcludedRoute =
    !pathname ||
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/focus-mode");

  // Stop global music playback on excluded routes (Landing, Auth, Focus Mode)
  useEffect(() => {
    if (isExcludedRoute) {
      if (howlRef.current && howlRef.current.playing()) {
        howlRef.current.pause();
      }
      if (isPlaying) {
        setIsPlaying(false);
      }
    }
  }, [isExcludedRoute, isPlaying, setIsPlaying]);

  // Exclude player when not mounted or on excluded routes
  if (!isMounted || isExcludedRoute) {
    return null;
  }

  if (!currentTrack) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-2.5 sm:px-6"
        >
          <div className="container max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Track Details */}
            <div className="flex items-center gap-3 min-w-0 w-1/4 sm:w-1/3">
              <div
                onClick={() => toggleQueueOpen(true)}
                className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 cursor-pointer group overflow-hidden"
              >
                <Disc
                  className={cn(
                    "h-5 w-5 text-primary transition-transform duration-700",
                    isPlaying ? "animate-spin" : "group-hover:scale-110"
                  )}
                  style={{ animationDuration: "6s" }}
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold truncate leading-tight text-foreground">
                  {currentTrack.title}
                </p>
                <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Center: Controls & Progress Bar */}
            <div className="flex flex-col items-center justify-center gap-1.5 flex-1 max-w-md">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={cn(
                    "h-8 w-8 text-muted-foreground hover:text-foreground",
                    shuffle && "text-primary hover:text-primary bg-primary/10"
                  )}
                  title={shuffle ? "Shuffle On" : "Shuffle Off"}
                >
                  <Shuffle className="h-3.5 w-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevTrack}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  title="Previous Track"
                >
                  <SkipBack className="h-4 w-4 fill-current" />
                </Button>

                <Button
                  variant="default"
                  size="icon"
                  onClick={togglePlay}
                  className="h-9 w-9 rounded-full shadow-sm bg-primary text-primary-foreground hover:scale-105 transition-transform"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current translate-x-[0.5px]" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTrack}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  title="Next Track"
                >
                  <SkipForward className="h-4 w-4 fill-current" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRepeatMode}
                  className={cn(
                    "h-8 w-8 text-muted-foreground hover:text-foreground",
                    repeatMode !== "off" && "text-primary hover:text-primary bg-primary/10"
                  )}
                  title={`Repeat: ${repeatMode}`}
                >
                  {repeatMode === "one" ? (
                    <Repeat1 className="h-3.5 w-3.5" />
                  ) : (
                    <Repeat className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>

              {/* Progress Slider */}
              <div className="w-full flex items-center gap-2 px-1">
                <span className="text-[10px] font-mono text-muted-foreground w-8 text-right select-none">
                  {formatTime(progress)}
                </span>
                <Slider
                  min={0}
                  max={duration || 100}
                  step={1}
                  value={progress}
                  onValueChange={(val) => requestSeek(val)}
                  className="flex-1"
                />
                <span className="text-[10px] font-mono text-muted-foreground w-8 select-none">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Right: Volume & Queue Toggle */}
            <div className="flex items-center justify-end gap-2 w-1/4 sm:w-1/3">
              <div className="hidden sm:flex items-center gap-1.5 w-28">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onValueChange={(val) => setVolume(val)}
                  className="w-16"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleQueueOpen(true)}
                className="h-8 gap-1.5 text-xs border-border/60 hover:bg-muted/60"
              >
                <ListMusic className="h-3.5 w-3.5 text-primary" />
                <span className="hidden md:inline font-medium">Playlist</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <TrackList />
    </>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAmbientSound } from "@/features/focus-mode/hooks/use-ambient-sound";
import { FocusTimerDisplay } from "@/features/focus-mode/components/focus-timer-display";
import { AmbientControls } from "@/features/focus-mode/components/ambient-controls";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "motion/react";

export function FocusModeView() {
  const router = useRouter();
  const {
    selectedSound,
    setSelectedSound,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    stopAll,
  } = useAmbientSound();

  const handleExit = useCallback(() => {
    stopAll();
    router.push("/");
  }, [stopAll, router]);

  // Keyboard shortcut: Press Escape to exit Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleExit]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-background text-foreground flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
    >
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar: Branding & Exit Control */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
            Focus Sanctuary
          </span>
        </div>

        {/* Exit Focus Mode Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExit}
          className="gap-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <X className="size-4" />
          <span className="hidden sm:inline">Exit Focus (Esc)</span>
        </Button>
      </div>

      {/* Main Centered Timer Section */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <FocusTimerDisplay />
      </div>

      {/* Bottom Ambient Audio Controls */}
      <div className="relative z-10 w-full pt-4">
        <AmbientControls
          selectedSound={selectedSound}
          onSelectSound={setSelectedSound}
          volume={volume}
          onVolumeChange={setVolume}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      </div>
    </motion.div>
  );
}

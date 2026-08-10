"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAmbientSound } from "@/features/focus-mode/hooks/use-ambient-sound";
import { FocusClockDisplay } from "@/features/focus-mode/components/focus-clock-display";
import { AmbientControls } from "@/features/focus-mode/components/ambient-controls";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

  const startTimeRef = useRef<number>(Date.now());
  const [summaryMessage, setSummaryMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Request browser fullscreen on mount (with graceful error handling if blocked by browser policy)
  useEffect(() => {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn("Browser fullscreen request blocked or not supported:", err);
      });
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn("Failed to enter fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.warn("Failed to exit fullscreen:", err);
      });
    }
  }, []);

  // Final navigate away helper
  const navigateToDashboard = useCallback(() => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
    }
    stopAll();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    router.push("/");
  }, [stopAll, router]);

  // Handle Exit Focus Trigger
  const handleExit = useCallback(() => {
    // If summary is already displaying, dismiss it immediately
    if (summaryMessage) {
      navigateToDashboard();
      return;
    }

    // Stop ambient sounds & exit browser fullscreen immediately
    stopAll();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    // Calculate elapsed duration
    const elapsedMs = Date.now() - startTimeRef.current;
    const totalSeconds = Math.max(1, Math.floor(elapsedMs / 1000));
    
    let msg = "";
    if (totalSeconds < 60) {
      msg = `You focused for ${totalSeconds} second${totalSeconds === 1 ? "" : "s"}`;
    } else {
      const minutes = Math.floor(totalSeconds / 60);
      msg = `You focused for ${minutes} minute${minutes === 1 ? "" : "s"}`;
    }

    setSummaryMessage(msg);

    // Auto-dismiss summary after 3.5 seconds
    autoDismissTimerRef.current = setTimeout(() => {
      navigateToDashboard();
    }, 3500);
  }, [summaryMessage, stopAll, navigateToDashboard]);

  // Clean up auto-dismiss timer on unmount
  useEffect(() => {
    return () => {
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current);
      }
    };
  }, []);

  // Keyboard shortcut listener (Escape or any key when summary active)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (summaryMessage) {
        // Any keypress dismisses the summary dialog
        navigateToDashboard();
        return;
      }
      if (e.key === "Escape") {
        handleExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [summaryMessage, handleExit, navigateToDashboard]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-background text-foreground flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
    >
      {/* Slow Calming Background Breathing Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Top Header Bar: Branding, Fullscreen Toggle & Exit */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs sm:text-sm font-medium tracking-wider uppercase text-muted-foreground">
            Focus Sanctuary
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="gap-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </Button>

          {/* Exit Focus Mode Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="gap-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <X className="size-4" />
            <span className="hidden sm:inline">Exit Focus (Esc)</span>
          </Button>
        </div>
      </div>

      {/* Main Centered Clock & Breathing Animation */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <FocusClockDisplay />
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

      {/* Focus Session Exit Summary Modal */}
      <AnimatePresence>
        {summaryMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={navigateToDashboard}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card border border-border/60 rounded-3xl p-8 shadow-2xl text-center space-y-6 select-none relative overflow-hidden"
            >
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

              <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="size-7 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  {summaryMessage}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Great work staying distraction-free. Returning to your dashboard...
                </p>
              </div>

              {/* Auto-dismiss countdown bar */}
              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 3.5, ease: "linear" }}
                  className="h-full bg-primary"
                />
              </div>

              <Button
                onClick={navigateToDashboard}
                className="w-full rounded-xl gap-2 font-medium cursor-pointer"
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


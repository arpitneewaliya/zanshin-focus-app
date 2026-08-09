"use client";

import * as React from "react";
import { TimerMode, useTimerStore } from "@/stores/timerStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Coffee, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TimerNotificationModalProps {
  completedMode: TimerMode | null;
  onClose: () => void;
}

export function TimerNotificationModal({
  completedMode,
  onClose,
}: TimerNotificationModalProps) {
  const { start } = useTimerStore();

  const getDetails = (mode: TimerMode) => {
    switch (mode) {
      case "work":
        return {
          title: "Work Session Completed!",
          description:
            "Great focus! Take a well-deserved break to stretch, rest your eyes, and recharge.",
          icon: Sparkles,
          iconColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          nextActionText: "Start Break",
        };
      case "shortBreak":
        return {
          title: "Short Break Finished!",
          description:
            "Break time is over. Ready to dive back in and focus on your next task?",
          icon: Coffee,
          iconColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          nextActionText: "Start Work Session",
        };
      case "longBreak":
        return {
          title: "Long Break Finished!",
          description:
            "Long break completed! You should feel refreshed and ready for your next focus block.",
          icon: CheckCircle2,
          iconColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
          nextActionText: "Start Work Session",
        };
    }
  };

  if (!completedMode) return null;

  const details = getDetails(completedMode);
  const IconComponent = details.icon;

  const handleStartNext = () => {
    onClose();
    start();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-5"
        >
          {/* Close Icon Button top right */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full size-8 text-muted-foreground hover:text-foreground"
            aria-label="Close notification"
          >
            <X className="size-4" />
          </Button>

          {/* Modal Header Icon */}
          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div
              className={`p-3.5 rounded-full border ${details.iconColor} shadow-inner`}
            >
              <IconComponent className="size-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {details.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">
                {details.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl py-5 font-medium"
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={handleStartNext}
              className="flex-1 rounded-xl py-5 font-medium shadow-sm"
            >
              {details.nextActionText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function FocusClockDisplay() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date: e.g. "10 August 2026"
  const dateString = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format time: e.g. "14:32"
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-8 sm:py-12">
      {/* Subtle Soft Breathing Glow Behind Clock */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute size-72 sm:size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />

      {/* Subtle Concentric Breathing Ring */}
      <motion.div
        animate={{
          scale: [0.97, 1.03, 0.97],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute size-80 sm:size-[450px] rounded-full border border-primary/20 pointer-events-none"
      />

      {/* Large Centered Time & Date Display */}
      <motion.div
        animate={{
          scale: [1, 1.01, 1],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="relative z-10 text-center space-y-4"
      >
        <h1 className="text-7xl sm:text-9xl font-black tracking-tight font-mono text-foreground drop-shadow-xs">
          {timeString}
        </h1>
        <p className="text-base sm:text-xl font-medium text-muted-foreground/80 tracking-widest uppercase">
          {dateString}
        </p>
      </motion.div>
    </div>
  );
}

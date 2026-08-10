"use client";

import { useState, useEffect } from "react";
import { useFocusStore } from "@/stores/focusStore";
import { motion } from "motion/react";

const numberWords: string[] = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "twenty-one",
  "twenty-two",
  "twenty-three",
  "twenty-four",
  "twenty-five",
  "twenty-six",
  "twenty-seven",
  "twenty-eight",
  "twenty-nine",
  "thirty",
  "thirty-one",
  "thirty-two",
  "thirty-three",
  "thirty-four",
  "thirty-five",
  "thirty-six",
  "thirty-seven",
  "thirty-eight",
  "thirty-nine",
  "forty",
  "forty-one",
  "forty-two",
  "forty-three",
  "forty-four",
  "forty-five",
  "forty-six",
  "forty-seven",
  "forty-eight",
  "forty-nine",
  "fifty",
  "fifty-one",
  "fifty-two",
  "fifty-three",
  "fifty-four",
  "fifty-five",
  "fifty-six",
  "fifty-seven",
  "fifty-eight",
  "fifty-nine",
];

function getTimeInWords(now: Date, use24Hour: boolean, showSeconds: boolean): string {
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  let timeStr = "";

  if (use24Hour) {
    const hWord = numberWords[h] || String(h);
    if (m === 0) {
      timeStr = `${hWord} hundred hours`;
    } else if (m < 10) {
      timeStr = `${hWord} zero ${numberWords[m]}`;
    } else {
      timeStr = `${hWord} ${numberWords[m]}`;
    }
  } else {
    const period = h >= 12 ? "pm" : "am";
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    const hWord = numberWords[h12];

    if (m === 0) {
      timeStr = `${hWord} o'clock ${period}`;
    } else if (m < 10) {
      timeStr = `${hWord} oh ${numberWords[m]} ${period}`;
    } else {
      timeStr = `${hWord} ${numberWords[m]} ${period}`;
    }
  }

  if (showSeconds) {
    timeStr += ` and ${numberWords[s]} second${s === 1 ? "" : "s"}`;
  }

  return timeStr;
}

function formatTimeString(
  now: Date,
  use24Hour: boolean,
  showSeconds: boolean
): string {
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const secStr = showSeconds ? `:${String(s).padStart(2, "0")}` : "";

  if (use24Hour) {
    const hStr = String(h).padStart(2, "0");
    const mStr = String(m).padStart(2, "0");
    return `${hStr}:${mStr}${secStr}`;
  } else {
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    const hStr = String(h12).padStart(2, "0");
    const mStr = String(m).padStart(2, "0");
    const period = h >= 12 ? "PM" : "AM";
    return `${hStr}:${mStr}${secStr} ${period}`;
  }
}

export function FocusClockDisplay() {
  const [now, setNow] = useState<Date>(() => new Date());
  const { showSeconds, showDate, use24Hour, clockStyle } = useFocusStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dateString = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeFormatted = formatTimeString(now, use24Hour, showSeconds);
  const timeWords = getTimeInWords(now, use24Hour, showSeconds);

  // Analog clock hand angles
  const secondsDeg = (now.getSeconds() / 60) * 360;
  const minutesDeg = ((now.getMinutes() + now.getSeconds() / 60) / 60) * 360;
  const hoursDeg = (((now.getHours() % 12) + now.getMinutes() / 60) / 12) * 360;

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-6 sm:py-10">
      {/* Soft Breathing Ambient Backdrop */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
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
          scale: [0.97, 1.04, 0.97],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute size-80 sm:size-[460px] rounded-full border border-primary/20 pointer-events-none"
      />

      {/* Render Selected Clock Style */}
      {clockStyle === "digital" && (
        <motion.div
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="relative z-10 text-center space-y-4"
        >
          <h1 className="text-6xl sm:text-9xl font-black tracking-tight font-mono text-foreground drop-shadow-xs">
            {timeFormatted}
          </h1>
          {showDate && (
            <p className="text-base sm:text-xl font-medium text-muted-foreground/80 tracking-widest uppercase">
              {dateString}
            </p>
          )}
        </motion.div>
      )}

      {clockStyle === "minimal" && (
        <motion.div
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
          className="relative z-10 text-center space-y-2"
        >
          <h1 className="text-7xl sm:text-[11rem] font-extrabold tracking-tighter font-mono text-foreground leading-none">
            {timeFormatted}
          </h1>
          {showDate && (
            <p className="text-xs sm:text-sm font-medium text-muted-foreground/60 tracking-widest uppercase pt-2">
              {dateString}
            </p>
          )}
        </motion.div>
      )}

      {clockStyle === "analog" && (
        <motion.div
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          {/* SVG Analog Clock Face */}
          <div className="relative size-64 sm:size-80 rounded-full border-2 border-border/80 bg-card/20 backdrop-blur-xs p-4 flex items-center justify-center shadow-lg">
            {/* Hour Markers */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-muted-foreground/40 rounded-full"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-118px)`,
                }}
              />
            ))}

            {/* Hour Hand */}
            <div
              className="absolute w-1.5 h-20 bg-foreground rounded-full origin-bottom bottom-1/2 left-[calc(50%-3px)] transition-transform duration-300"
              style={{ transform: `rotate(${hoursDeg}deg)` }}
            />

            {/* Minute Hand */}
            <div
              className="absolute w-1 h-28 bg-primary rounded-full origin-bottom bottom-1/2 left-[calc(50%-2px)] transition-transform duration-300"
              style={{ transform: `rotate(${minutesDeg}deg)` }}
            />

            {/* Second Hand */}
            {showSeconds && (
              <div
                className="absolute w-0.5 h-32 bg-destructive rounded-full origin-bottom bottom-1/2 left-[calc(50%-1px)] transition-transform duration-100"
                style={{ transform: `rotate(${secondsDeg}deg)` }}
              />
            )}

            {/* Center Pivot Pin */}
            <div className="absolute size-3.5 rounded-full bg-primary ring-4 ring-background" />
          </div>

          {showDate && (
            <p className="text-sm sm:text-base font-medium text-muted-foreground/80 tracking-widest uppercase">
              {dateString}
            </p>
          )}
        </motion.div>
      )}

      {clockStyle === "text" && (
        <motion.div
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="relative z-10 text-center max-w-2xl px-6 space-y-4"
        >
          <h1 className="text-3xl sm:text-6xl font-light tracking-tight text-foreground capitalize leading-snug font-sans">
            "{timeWords}"
          </h1>
          {showDate && (
            <p className="text-sm sm:text-lg font-medium text-muted-foreground/80 tracking-widest uppercase pt-2">
              {dateString}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

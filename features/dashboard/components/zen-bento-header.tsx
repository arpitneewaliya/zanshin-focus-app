"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sunrise, Sun, Sunset, Moon, Timer, Target, Sparkles, RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZenBentoHeaderProps {
  userName?: string | null;
  isGuest: boolean;
}

const ZEN_INTENTIONS = [
  "Remain calm, alert, and fully present before, during, and after action.",
  "Simplicity is the prerequisite for deep, meaningful work.",
  "Do one thing at a time, with undivided presence.",
  "The quieter the mind becomes, the more clearly you see.",
  "Guard your attention — it is the single greatest asset you possess.",
  "Small daily disciplines yield unshakeable mastery.",
  "Flow cannot be forced; clear away the distractions and it arrives.",
];

export function ZenBentoHeader({ userName }: ZenBentoHeaderProps) {
  const [greeting, setGreeting] = useState<{ text: string; icon: typeof Sun }>({
    text: "Welcome",
    icon: Sun,
  });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [todayFormatted, setTodayFormatted] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({ text: "Good morning", icon: Sunrise });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({ text: "Good afternoon", icon: Sun });
    } else if (hour >= 17 && hour < 22) {
      setGreeting({ text: "Good evening", icon: Sunset });
    } else {
      setGreeting({ text: "Peaceful night", icon: Moon });
    }

    setTodayFormatted(
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date())
    );

    // Pick a deterministic quote based on day of year, but allow user to cycle
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setQuoteIndex(dayOfYear % ZEN_INTENTIONS.length);
  }, []);

  const GreetingIcon = greeting.icon;

  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % ZEN_INTENTIONS.length);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
      <div className="space-y-2">
        {/* Date & Zen Badge */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
            <GreetingIcon className="size-3" />
            <span>{greeting.text}</span>
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-muted-foreground font-medium">
            {todayFormatted || "Today"}
          </span>
        </div>

        {/* Dynamic Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-heading text-foreground">
          {userName ? (
            <>
              Welcome back, <span className="text-primary">{userName}</span>
            </>
          ) : (
            "Focus Workspace"
          )}
        </h1>

        {/* Intention / Quote */}
        <div
          onClick={cycleQuote}
          title="Click for next mindful intention"
          className="group inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors max-w-xl"
        >
          <Sparkles className="size-3.5 text-primary/70 shrink-0 group-hover:rotate-12 transition-transform" />
          <span className="italic leading-relaxed">
            &ldquo;{ZEN_INTENTIONS[quoteIndex]}&rdquo;
          </span>
          <RefreshCw className="size-3 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
        </div>
      </div>

      {/* Quick Launch CTA Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end pt-2 md:pt-0">
        <Link
          href="/timer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-2 text-xs h-9 px-3.5 border-border/80 hover:border-primary/40 hover:bg-muted/50 transition-all shadow-xs"
          )}
        >
          <Timer className="size-3.5 text-primary" />
          <span>Start 25m Focus</span>
        </Link>
        <Link
          href="/focus-mode"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "gap-2 text-xs h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all"
          )}
        >
          <Target className="size-3.5" />
          <span>Enter Focus Mode</span>
        </Link>
      </div>
    </div>
  );
}


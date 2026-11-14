"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="fixed inset-0 z-40 flex min-h-dvh w-screen overflow-y-auto lg:overflow-hidden bg-background text-foreground">
      {/* Left Artwork Panel (Desktop only) */}
      <aside className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden bg-slate-950 p-10 xl:p-14 select-none">
        <Image
          src="/images/backgrounds/zen-auth-retro.png"
          alt="Tranquil Japanese Zen sanctuary illustration"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />

        {/* Subtle multi-stop readability scrim */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/15 to-slate-950/65"
          aria-hidden="true"
        />

        {/* Tactile film/woodblock grain overlay */}
        <div
          className="zen-grain pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        {/* Top-left back link */}
        <Link
          href="/"
          className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-black/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to home</span>
        </Link>

        {/* Upper-Third Editorial Overlay (positioned over sky above temple) */}
        <div className="relative z-10 mt-10 xl:mt-14 mb-auto max-w-md mx-auto text-center space-y-3.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-200/95 drop-shadow-sm">
            残心 · ZANSHIN
          </p>
          <h2 className="text-3xl xl:text-4xl font-light uppercase tracking-[0.42em] text-white drop-shadow-md pl-[0.42em]">
            WELCOME
          </h2>
          <p className="text-sm leading-relaxed text-white/90 font-light max-w-xs mx-auto drop-shadow-sm">
            Begin with relaxed alertness. Give the work that matters your undivided attention.
          </p>
        </div>

        {/* Bottom subtle caption */}
        <p className="relative z-10 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          残心 — Sustained, composed awareness
        </p>
      </aside>

      {/* Right Form Canvas */}
      <section className="flex-1 flex flex-col justify-between min-h-dvh lg:h-dvh bg-background px-6 py-6 sm:px-12 sm:py-8 lg:px-16 xl:px-24 overflow-y-auto">
        <div className="flex items-center justify-between w-full">
          <Link
            href="/"
            className="inline-flex lg:hidden items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1 py-1"
          >
            <ArrowLeft className="size-4" />
            <span>Back to home</span>
          </Link>
          <div className="hidden lg:block" />
          <ThemeToggle />
        </div>

        <div className="my-auto w-full max-w-[380px] mx-auto py-8">
          {children}
        </div>

        <div className="h-4" aria-hidden="true" />
      </section>
    </div>
  );
}

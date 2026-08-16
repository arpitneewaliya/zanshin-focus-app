"use client";

import React from "react";
import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="pt-8 pb-12 border-t border-border/50 text-xs text-muted-foreground">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" />
          <span className="font-semibold text-foreground font-heading">
            Zanshin Focus
          </span>
          <span className="text-muted-foreground/50">—</span>
          <span>Mindful productivity workspace</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="hover:text-foreground transition-colors"
          >
            Sign Up
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="text-center text-[11px] text-muted-foreground/60 pt-4">
        &copy; {new Date().getFullYear()} Zanshin Focus. Built for calm, deep momentum.
      </div>
    </footer>
  );
}

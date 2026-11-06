"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";

export function SiteHeader() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/82 backdrop-blur-xl">
      <div className="container mx-auto flex h-15 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 rounded-full bg-primary/25 transition-transform duration-300 group-hover:scale-[2]" />
            <span className="relative size-2.5 rounded-full bg-primary" />
          </span>
          <span className="font-semibold tracking-tight text-foreground">Zanshin Focus</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {isLandingPage && (
            <nav aria-label="Landing page" className="mr-1 hidden items-center gap-1 md:flex">
              <a className="zen-nav-link" href="#workspace">Workspace</a>
              <a className="zen-nav-link" href="#philosophy">Philosophy</a>
            </nav>
          )}
          <UserNav />
          {isLandingPage && (
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden h-8.5 gap-1.5 rounded-full px-3.5 text-xs font-semibold shadow-sm sm:inline-flex"
              )}
            >
              Start free <ArrowUpRight className="size-3.5" />
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

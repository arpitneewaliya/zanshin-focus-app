import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { GlobalMusicPlayer } from "@/features/music-player/components/GlobalMusicPlayer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zanshin Focus",
  description: "Minimalist, distraction-free productivity workspace combining Pomodoro Timer, Task Manager, Personal Journal, and Focus Mode.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased", inter.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-md">
            <div className="container max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-semibold text-lg tracking-tight font-heading">
                  Zanshin Focus
                </span>
              </Link>
              <div className="flex items-center gap-3">
                <UserNav />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 container max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
            {children}
          </main>
          <GlobalMusicPlayer />
        </ThemeProvider>
      </body>
    </html>
  );
}

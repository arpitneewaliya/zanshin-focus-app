import type { Metadata } from "next";
import { Inter, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { GlobalMusicPlayer } from "@/features/music-player/components/GlobalMusicPlayer";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
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
      className={cn("h-full antialiased", inter.variable, geistMono.variable, playfairDisplay.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1 container max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
            {children}
          </main>
          <GlobalMusicPlayer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

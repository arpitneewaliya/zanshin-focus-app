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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

const ogTitle = "Zanshin Focus — Unshakeable Focus for Deep Work";
const ogDescription =
  "Minimalist, distraction-free productivity sanctuary combining Pomodoro Timer, Task Manager, Habit Heatmaps, Personal Journal, and Ambient Focus Mode.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Zanshin Focus",
  description:
    "Minimalist, distraction-free productivity workspace combining Pomodoro Timer, Task Manager, Personal Journal, and Focus Mode.",
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    url: "/",
    siteName: "Zanshin Focus",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zanshin Focus — Unshakeable Focus for Deep Work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: [
      {
        url: "/og-image.png",
        alt: "Zanshin Focus — Unshakeable Focus for Deep Work",
      },
    ],
  },
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

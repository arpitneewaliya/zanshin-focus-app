import { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";

export const metadata: Metadata = {
  title: "Zanshin Focus — Unshakeable Focus for Deep Work",
  description:
    "Minimalist, distraction-free productivity sanctuary combining Pomodoro Timer, Task Manager, Habit Heatmaps, Personal Journal, and Ambient Focus Mode.",
};

export default function HomePage() {
  return <LandingPage />;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ClockStyle = "digital" | "minimal" | "analog" | "text";

export interface FocusSettings {
  showSeconds: boolean;
  showDate: boolean;
  use24Hour: boolean;
  clockStyle: ClockStyle;
}

interface FocusStoreState extends FocusSettings {
  setShowSeconds: (showSeconds: boolean) => void;
  setShowDate: (showDate: boolean) => void;
  setUse24Hour: (use24Hour: boolean) => void;
  setClockStyle: (clockStyle: ClockStyle) => void;
}

export const useFocusStore = create<FocusStoreState>()(
  persist(
    (set) => ({
      showSeconds: false,
      showDate: true,
      use24Hour: true,
      clockStyle: "digital",

      setShowSeconds: (showSeconds) => set({ showSeconds }),
      setShowDate: (showDate) => set({ showDate }),
      setUse24Hour: (use24Hour) => set({ use24Hour }),
      setClockStyle: (clockStyle) => set({ clockStyle }),
    }),
    {
      name: "zanshin-focus-settings",
    }
  )
);

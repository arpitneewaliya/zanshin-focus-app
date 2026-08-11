import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Track, TRACKS } from "@/features/music-player/data/tracks";

export type RepeatMode = "off" | "all" | "one";

interface MusicPlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number; // 0 to 1
  isMuted: boolean;
  progress: number; // current time in seconds
  duration: number; // total duration in seconds
  seekRequest: number | null; // target seek position in seconds
  repeatMode: RepeatMode;
  shuffle: boolean;
  isQueueOpen: boolean;

  // Actions
  setTrack: (track: Track, autoPlay?: boolean) => void;
  togglePlay: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  requestSeek: (time: number) => void;
  clearSeekRequest: () => void;
  toggleRepeatMode: () => void;
  toggleShuffle: () => void;
  toggleQueueOpen: (open?: boolean) => void;
}

export const useMusicPlayerStore = create<MusicPlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: TRACKS[0] || null,
      queue: TRACKS,
      isPlaying: false,
      volume: 0.7,
      isMuted: false,
      progress: 0,
      duration: 0,
      seekRequest: null,
      repeatMode: "off",
      shuffle: false,
      isQueueOpen: false,

      setTrack: (track: Track, autoPlay = true) => {
        set({
          currentTrack: track,
          progress: 0,
          duration: 0,
          isPlaying: autoPlay,
        });
      },

      togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },

      setIsPlaying: (isPlaying: boolean) => {
        set({ isPlaying });
      },

      nextTrack: () => {
        const { currentTrack, queue, shuffle, repeatMode } = get();
        if (!currentTrack || queue.length === 0) return;

        if (repeatMode === "one") {
          // Re-trigger current track from 0
          set({ progress: 0, seekRequest: 0, isPlaying: true });
          return;
        }

        if (shuffle && queue.length > 1) {
          const remainingTracks = queue.filter((t) => t.id !== currentTrack.id);
          const randomIndex = Math.floor(Math.random() * remainingTracks.length);
          const next = remainingTracks[randomIndex];
          set({ currentTrack: next, progress: 0, duration: 0, isPlaying: true });
          return;
        }

        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        let nextIndex = currentIndex + 1;

        if (nextIndex >= queue.length) {
          if (repeatMode === "all") {
            nextIndex = 0;
          } else {
            // End of queue in "off" mode
            set({ isPlaying: false, progress: 0 });
            return;
          }
        }

        set({
          currentTrack: queue[nextIndex],
          progress: 0,
          duration: 0,
          isPlaying: true,
        });
      },

      prevTrack: () => {
        const { currentTrack, queue, progress } = get();
        if (!currentTrack || queue.length === 0) return;

        // If played more than 3s, restart track
        if (progress > 3) {
          set({ progress: 0, seekRequest: 0 });
          return;
        }

        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
        set({
          currentTrack: queue[prevIndex],
          progress: 0,
          duration: 0,
          isPlaying: true,
        });
      },

      setVolume: (volume: number) => {
        const clamped = Math.max(0, Math.min(1, volume));
        set((state) => ({
          volume: clamped,
          isMuted: clamped === 0 ? true : state.isMuted && clamped > 0 ? false : state.isMuted,
        }));
      },

      toggleMute: () => {
        set((state) => ({ isMuted: !state.isMuted }));
      },

      setProgress: (progress: number) => set({ progress }),
      setDuration: (duration: number) => set({ duration }),

      requestSeek: (time: number) => set({ seekRequest: time }),
      clearSeekRequest: () => set({ seekRequest: null }),

      toggleRepeatMode: () => {
        set((state) => {
          const modes: RepeatMode[] = ["off", "all", "one"];
          const nextIndex = (modes.indexOf(state.repeatMode) + 1) % modes.length;
          return { repeatMode: modes[nextIndex] };
        });
      },

      toggleShuffle: () => {
        set((state) => ({ shuffle: !state.shuffle }));
      },

      toggleQueueOpen: (open?: boolean) => {
        set((state) => ({
          isQueueOpen: open !== undefined ? open : !state.isQueueOpen,
        }));
      },
    }),
    {
      name: "zanshin-music-player-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        volume: state.volume,
        currentTrackId: state.currentTrack?.id,
        repeatMode: state.repeatMode,
        shuffle: state.shuffle,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Restore track object from ID after rehydration
          const restoredId = (state as unknown as { currentTrackId?: string }).currentTrackId;
          if (restoredId) {
            const foundTrack = TRACKS.find((t) => t.id === restoredId);
            if (foundTrack) {
              state.currentTrack = foundTrack;
            }
          }
          // Never start playing automatically on page rehydration
          state.isPlaying = false;
        }
      },
    }
  )
);

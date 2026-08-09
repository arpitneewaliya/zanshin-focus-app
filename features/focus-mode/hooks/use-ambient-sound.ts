"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import { AmbientSoundId, AMBIENT_SOUNDS } from "@/features/focus-mode/types";

export function useAmbientSound() {
  const [selectedSound, setSelectedSound] = useState<AmbientSoundId>("none");
  const [volume, setVolume] = useState<number>(0.5); // 0.0 to 1.0
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const howlRef = useRef<Howl | null>(null);
  const currentSrcRef = useRef<string>("");

  // Stop & unload audio instance
  const stopAll = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
    currentSrcRef.current = "";
  }, []);

  // Update audio playback when selectedSound or volume/isMuted changes
  useEffect(() => {
    const targetSound = AMBIENT_SOUNDS.find((s) => s.id === selectedSound);

    if (!targetSound || selectedSound === "none" || !targetSound.src) {
      stopAll();
      return;
    }

    const effectiveVolume = isMuted ? 0 : volume;

    // If already playing the same source, just update volume
    if (howlRef.current && currentSrcRef.current === targetSound.src) {
      howlRef.current.volume(effectiveVolume);
      if (!howlRef.current.playing() && effectiveVolume > 0) {
        howlRef.current.play();
      }
      return;
    }

    // Changing sound track
    stopAll();

    try {
      const newHowl = new Howl({
        src: [targetSound.src],
        loop: true,
        volume: effectiveVolume,
        html5: true,
        onloaderror: () => {
          console.warn(`Could not load ambient audio track: ${targetSound.src}`);
        },
      });

      newHowl.play();
      howlRef.current = newHowl;
      currentSrcRef.current = targetSound.src;
    } catch (err) {
      console.warn("Failed to initialize ambient sound player:", err);
    }
  }, [selectedSound, volume, isMuted, stopAll]);

  // Clean up audio playback on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    selectedSound,
    setSelectedSound,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    stopAll,
  };
}

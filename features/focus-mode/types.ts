export type AmbientSoundId = "none" | "rain" | "meditation" | "cafe" | "forest";

export interface AmbientSoundOption {
  id: AmbientSoundId;
  name: string;
  description: string;
  src: string;
}

export const AMBIENT_SOUNDS: AmbientSoundOption[] = [
  {
    id: "none",
    name: "Off",
    description: "Silent background",
    src: "",
  },
  {
    id: "rain",
    name: "Gentle Rain",
    description: "Calming rainfall & distant thunder",
    src: "/sounds/rain.wav",
  },
  {
    id: "meditation",
    name: "Meditation",
    description: "Constant soothing background frequency",
    src: "/sounds/meditation.mp3",
  },
  {
    id: "cafe",
    name: "Coffee Shop",
    description: "Soft ambient cafe chatter & espresso cup clinks",
    src: "/sounds/cafe.wav",
  },
  {
    id: "forest",
    name: "Forest Birds",
    description: "Peaceful nature canopy & rustling leaves",
    src: "/sounds/forest.wav",
  },
];

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
  duration?: number;
}

export const TRACKS: Track[] = [
  {
    id: "calm-zen",
    title: "Calm Zen",
    artist: "Zanshin Audio",
    src: "/audio/music/calm-zen.mp3",
  },
  {
    id: "chillhop-study",
    title: "Chillhop Study",
    artist: "Zanshin Audio",
    src: "/audio/music/chillhop-study.mp3",
  },
  {
    id: "christmas-music",
    title: "Winter Chill",
    artist: "Zanshin Audio",
    src: "/audio/music/christmas-music.mp3",
  },
  {
    id: "coffee-shop-jazz",
    title: "Coffee Shop Jazz",
    artist: "Zanshin Audio",
    src: "/audio/music/coffee-shop-jazz.mp3",
  },
  {
    id: "focus",
    title: "Deep Focus",
    artist: "Zanshin Audio",
    src: "/audio/music/focus.mp3",
  },
  {
    id: "lofi-rain-night",
    title: "Lofi Rain Night",
    artist: "Zanshin Audio",
    src: "/audio/music/lofi-rain-night.mp3",
  },
  {
    id: "lofi-relax",
    title: "Lofi Relax",
    artist: "Zanshin Audio",
    src: "/audio/music/lofi-relax.mp3",
  },
  {
    id: "lofi-study",
    title: "Lofi Study",
    artist: "Zanshin Audio",
    src: "/audio/music/lofi-study.mp3",
  },
  {
    id: "motivation",
    title: "Daily Motivation",
    artist: "Zanshin Audio",
    src: "/audio/music/motivation.mp3",
  },
  {
    id: "night-drive",
    title: "Night Drive",
    artist: "Zanshin Audio",
    src: "/audio/music/night-drive.mp3",
  },
];

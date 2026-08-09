import { Howl, Howler } from "howler";

/**
 * Generates a valid 16-bit PCM WAV base64 Data URI for a pleasant C5 -> E5 dual-tone bell chime.
 */
function createChimeWavDataUri(): string {
  if (typeof window === "undefined") return "";

  const sampleRate = 22050;
  const duration = 0.7; // seconds
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // WAV Header
  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  // Synthesize C5 (523.25Hz) and E5 (659.25Hz) chime harmonics
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // First tone (C5)
    const env1 = Math.exp(-t * 5);
    const s1 = Math.sin(2 * Math.PI * 523.25 * t) * env1;

    // Second tone (E5), starting slightly after
    let s2 = 0;
    if (t > 0.12) {
      const t2 = t - 0.12;
      const env2 = Math.exp(-t2 * 5);
      s2 = Math.sin(2 * Math.PI * 659.25 * t2) * env2;
    }

    const mixed = s1 * 0.4 + s2 * 0.5;
    const pcm = Math.max(-1, Math.min(1, mixed)) * 32767;
    view.setInt16(44 + i * 2, pcm, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return "data:audio/wav;base64," + btoa(binary);
}

let timerAlarmSound: Howl | null = null;

/**
 * Resumes Howler AudioContext if it was suspended by browser autoplay policy.
 */
export function unlockAudioContext() {
  if (typeof window === "undefined") return;
  try {
    if (Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume();
    }
  } catch (err) {
    console.warn("Could not resume AudioContext:", err);
  }
}

/**
 * Web Audio API oscillator fallback chime.
 */
function playSynthChimeFallback() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = Howler.ctx || new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // C5 Tone
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now);
    g1.gain.setValueAtTime(0.3, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(g1);
    g1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // E5 Tone
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now + 0.12);
    g2.gain.setValueAtTime(0.4, now + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.7);
  } catch (err) {
    console.warn("Synth chime fallback error:", err);
  }
}

/**
 * Plays the completion sound for timer sessions.
 */
export function playTimerCompletionSound() {
  if (typeof window === "undefined") return;

  unlockAudioContext();

  try {
    if (!timerAlarmSound) {
      const chimeDataUri = createChimeWavDataUri();
      timerAlarmSound = new Howl({
        src: [chimeDataUri],
        format: ["wav"],
        volume: 0.85,
        html5: false,
        onloaderror: () => {
          playSynthChimeFallback();
        },
        onplayerror: () => {
          playSynthChimeFallback();
        },
      });
    }

    timerAlarmSound.play();
    // Also trigger synth fallback to guarantee sound output across all browser environments
    playSynthChimeFallback();
  } catch (err) {
    console.warn("Could not play timer sound via Howler:", err);
    playSynthChimeFallback();
  }
}


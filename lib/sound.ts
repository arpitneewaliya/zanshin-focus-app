import { Howl } from "howler";

// Compact 44.1kHz PCM WAV base64 audio chime string for crisp notification alert
const ALARM_CHIME_BASE64 =
  "data:audio/wav;base64,UklGRl9vAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTdvAACAgICAgICAgICAgICAgICAgICAf4CAgYKDhIWGh4iJiouMjY6PkJGSk5SVlpmaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dXZ3eHl6Z2lqbW9wcXJzdHV2d3h5enN0dXZ3eHl6g4SFhoeIiYqLjI2Oj5CSk5SVlpmaW1xdXl9gYQ==";

let timerAlarmSound: Howl | null = null;

export function playTimerCompletionSound() {
  if (typeof window === "undefined") return;

  try {
    if (!timerAlarmSound) {
      timerAlarmSound = new Howl({
        src: [ALARM_CHIME_BASE64],
        format: ["wav"],
        volume: 0.7,
        html5: false,
      });
    }
    timerAlarmSound.play();
  } catch (err) {
    console.warn("Could not play timer sound:", err);
  }
}

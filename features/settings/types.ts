export interface UserProfileData {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

export type ClockStyleOption = "digital" | "minimal" | "analog" | "text";

export interface UserSettingsPreferences {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  showSeconds: boolean;
  showDate: boolean;
  use24Hour: boolean;
  clockStyle: ClockStyleOption;
}

export interface SettingsPageData {
  profile: UserProfileData | null;
  settings: UserSettingsPreferences;
  isGuest: boolean;
}

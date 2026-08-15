import { getUserProfile } from "@/app/actions/account";
import { getUserSettings } from "@/app/actions/pomodoro";
import { SettingsView } from "@/features/settings/components/settings-view";
import { SettingsPageData, UserSettingsPreferences } from "@/features/settings/types";

export const metadata = {
  title: "Settings & Account - Zanshin Focus",
  description:
    "Manage your profile identity, avatar picture, timer intervals, and focus workspace preferences.",
};

const defaultSettings: UserSettingsPreferences = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  showSeconds: false,
  showDate: true,
  use24Hour: true,
  clockStyle: "digital",
};

export default async function SettingsPage() {
  const [profileRes, settingsRes] = await Promise.all([
    getUserProfile(),
    getUserSettings(),
  ]);

  const profile = profileRes.success && profileRes.data ? profileRes.data : null;
  const isGuest = !profile;

  const settings: UserSettingsPreferences =
    settingsRes.success && settingsRes.data
      ? {
          workDuration: settingsRes.data.workDuration,
          shortBreakDuration: settingsRes.data.shortBreakDuration,
          longBreakDuration: settingsRes.data.longBreakDuration,
          longBreakInterval: settingsRes.data.longBreakInterval,
          showSeconds: settingsRes.data.showSeconds,
          showDate: settingsRes.data.showDate,
          use24Hour: settingsRes.data.use24Hour,
          clockStyle: settingsRes.data.clockStyle,
        }
      : defaultSettings;

  const data: SettingsPageData = {
    profile,
    settings,
    isGuest,
  };

  const error =
    (!profileRes.success ? profileRes.error : undefined) ||
    (!settingsRes.success && !settingsRes.guest ? settingsRes.error : undefined);

  return <SettingsView data={data} error={error} />;
}

"use client";

import Link from "next/link";
import { ArrowLeft, UserCircle2, Sliders, Shield, LogIn } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { SettingsPageData } from "@/features/settings/types";
import { ProfilePictureSection } from "./profile-picture-section";
import { ProfileForm } from "./profile-form";
import { PreferencesForm } from "./preferences-form";
import { AccountDangerZone } from "./account-danger-zone";
import { cn } from "@/lib/utils";

interface SettingsViewProps {
  data: SettingsPageData;
  error?: string;
}

export function SettingsView({ data, error }: SettingsViewProps) {
  const { profile, settings, isGuest } = data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
        <h1 className="text-xl font-semibold tracking-tight font-heading">
          Settings & Account
        </h1>
        <div className="w-24" /> {/* Visual balance */}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Guest Mode Alert */}
      {isGuest || !profile ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <UserCircle2 className="size-5" />
              <CardTitle className="text-base font-semibold">
                Sign In to Customize Profile
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              You are currently browsing as a guest. Sign in with your Supabase account to upload custom avatars, edit your display name, and persist your timer and focus settings across all devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              )}
            >
              <LogIn className="size-3.5" />
              <span>Sign In with Supabase</span>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Card 1: Profile & Identity */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <UserCircle2 className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Profile & Identity
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Manage your avatar photo, display name, and account email.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <ProfilePictureSection
                userId={profile.id}
                initialAvatarUrl={profile.avatarUrl}
                userName={profile.name}
                userEmail={profile.email}
              />
              <div className="border-t border-border/50 pt-5">
                <ProfileForm
                  initialName={profile.name}
                  currentEmail={profile.email}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Workspace & Timer Preferences */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Sliders className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Workspace Preferences
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Configure default Pomodoro interval durations and Focus Mode clock styling.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <PreferencesForm initialSettings={settings} />
            </CardContent>
          </Card>

          {/* Card 3: Account & Session */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                  <Shield className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Account & Session
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Security information and active session controls.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <AccountDangerZone userId={profile.id} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { User, Mail, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { updateUserName } from "@/app/actions/account";

interface ProfileFormProps {
  initialName: string | null;
  currentEmail: string;
  onNameUpdated?: (name: string | null) => void;
}

export function ProfileForm({
  initialName,
  currentEmail,
  onNameUpdated,
}: ProfileFormProps) {
  // Name State
  const [name, setName] = useState(initialName || "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Email State
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingName(true);
    setNameError(null);
    setNameSuccess(false);

    try {
      const res = await updateUserName(name);
      if (!res.success) {
        throw new Error(res.error || "Failed to update display name");
      }
      setNameSuccess(true);
      onNameUpdated?.(res.data?.name ?? null);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update display name.";
      setNameError(msg);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim();

    if (!trimmed || trimmed === currentEmail) {
      return;
    }

    setIsUpdatingEmail(true);
    setEmailError(null);
    setEmailSuccessMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.updateUser({
        email: trimmed,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.user) {
        setEmailSuccessMessage(
          `Confirmation email sent to ${trimmed}. Please check your inbox and confirm to finish updating your email.`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update email address.";
      setEmailError(msg);
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Display Name Form */}
      <form onSubmit={handleSaveName} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="displayName" className="text-xs font-semibold text-foreground">
            Display Name
          </Label>
          <div className="relative">
            <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="displayName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arpit Neewaliya"
              maxLength={60}
              className="pl-9 text-sm"
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-muted-foreground">
            <span>Shown across your workspace and dashboard.</span>
            <span>{name.length}/60</span>
          </div>
        </div>

        {nameError && (
          <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
            <AlertCircle className="size-3.5" />
            {nameError}
          </p>
        )}

        {nameSuccess && (
          <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <Check className="size-3.5" />
            Display name saved.
          </p>
        )}

        <div className="pt-1">
          <Button
            type="submit"
            size="sm"
            disabled={isSavingName || name === (initialName || "")}
            className="text-xs gap-1.5"
          >
            {isSavingName ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Name</span>
            )}
          </Button>
        </div>
      </form>

      <div className="border-t border-border/50 pt-5">
        {/* Email Form */}
        <form onSubmit={handleUpdateEmail} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="accountEmail" className="text-xs font-semibold text-foreground">
              Account Email
            </Label>
            <div className="relative">
              <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="accountEmail"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="pl-9 text-sm"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Managed by Supabase Auth. Changing your email requires clicking a verification link sent to your new address.
            </p>
          </div>

          {emailError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{emailError}</span>
            </div>
          )}

          {emailSuccessMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2">
              <Check className="size-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{emailSuccessMessage}</span>
            </div>
          )}

          <div className="pt-1">
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={isUpdatingEmail || emailInput.trim() === currentEmail}
              className="text-xs gap-1.5"
            >
              {isUpdatingEmail ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Change Email</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

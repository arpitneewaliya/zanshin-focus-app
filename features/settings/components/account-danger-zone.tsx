"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AccountDangerZoneProps {
  userId: string;
}

export function AccountDangerZone({ userId }: AccountDangerZoneProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Error signing out:", err);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-destructive">
            <ShieldAlert className="size-4" />
            <span>Session & Account Actions</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Sign out of your active session on this device.
          </p>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="text-xs gap-1.5 shrink-0 cursor-pointer"
        >
          {isSigningOut ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </>
          )}
        </Button>
      </div>

      <div className="text-[11px] text-muted-foreground flex items-center justify-between px-1">
        <span>Account ID: <span className="font-mono text-[10px]">{userId}</span></span>
        <span>Secured with Supabase Auth</span>
      </div>
    </div>
  );
}

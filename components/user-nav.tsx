"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "@/app/actions/account";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LogIn, Settings, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dbName, setDbName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await getUserProfile();
      if (res.success && res.data) {
        setDbName(res.data.name);
        setAvatarUrl(res.data.avatarUrl);
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Initial user fetch
    supabase.auth.getUser().then(({ data }) => {
      const currentUser = data.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile();
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile();
      } else {
        setDbName(null);
        setAvatarUrl(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDbName(null);
    setAvatarUrl(null);
    router.push("/login");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="h-8 w-24 bg-muted/50 rounded-lg animate-pulse shrink-0" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        )}
      >
        <LogIn className="h-3.5 w-3.5" />
        <span>Sign In</span>
      </Link>
    );
  }

  // Name resolution priority: DB name > Supabase metadata > null
  const effectiveName =
    dbName ||
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    null;

  const effectiveAvatar =
    avatarUrl ||
    (user.user_metadata?.avatar_url as string) ||
    (user.user_metadata?.picture as string) ||
    null;

  const emailPrefix = user.email?.split("@")[0] || "User";
  const displayLabel = effectiveName || emailPrefix;
  const initialChar = (effectiveName || emailPrefix).charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer outline-none"
        )}
      >
        <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[11px] font-bold uppercase shrink-0 relative overflow-hidden">
          {effectiveAvatar ? (
            <Image
              src={effectiveAvatar}
              alt={displayLabel}
              fill
              sizes="24px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span>{initialChar || <UserIcon className="h-3 w-3" />}</span>
          )}
        </div>
        <span className="max-w-[120px] truncate hidden sm:inline">
          {displayLabel}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal px-2 py-1.5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase shrink-0 relative overflow-hidden">
                {effectiveAvatar ? (
                  <Image
                    src={effectiveAvatar}
                    alt={displayLabel}
                    fill
                    sizes="32px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span>{initialChar || <UserIcon className="h-4 w-4" />}</span>
                )}
              </div>
              <div className="flex flex-col space-y-0.5 overflow-hidden">
                <p className="text-xs font-semibold leading-tight text-foreground truncate">
                  {effectiveName || (
                    <span className="text-muted-foreground/80 italic font-normal">
                      User
                    </span>
                  )}
                </p>
                <p className="text-[11px] leading-none text-muted-foreground truncate font-mono">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="cursor-pointer text-xs gap-2 py-1.5"
          >
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Settings & Preferences</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-destructive focus:text-destructive cursor-pointer text-xs gap-2 py-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

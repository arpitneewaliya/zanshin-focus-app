"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Loader2, Camera, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { updateUserAvatar } from "@/app/actions/account";

interface ProfilePictureSectionProps {
  userId: string;
  initialAvatarUrl: string | null;
  userName: string | null;
  userEmail: string;
  onAvatarUpdated?: (newUrl: string | null) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function ProfilePictureSection({
  userId,
  initialAvatarUrl,
  userName,
  userEmail,
  onAvatarUpdated,
}: ProfilePictureSectionProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialChar = (userName || userEmail || "U").charAt(0).toUpperCase();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP, or GIF).");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("Image file size exceeds the 5MB limit. Please choose a smaller photo.");
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop() || "png";
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // 2. Upload to Supabase Storage 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload image to storage");
      }

      // 3. Get Public CDN URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 4. Save to Prisma User record via Server Action
      const saveRes = await updateUserAvatar(publicUrl);
      if (!saveRes.success) {
        throw new Error(saveRes.error || "Failed to link avatar to profile");
      }

      setAvatarUrl(publicUrl);
      onAvatarUpdated?.(publicUrl);
      setSuccessMessage("Profile photo updated successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading avatar photo.";
      console.error("Avatar upload error:", err);
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!avatarUrl) return;

    setIsRemoving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const saveRes = await updateUserAvatar(null);
      if (!saveRes.success) {
        throw new Error(saveRes.error || "Failed to remove avatar photo");
      }

      setAvatarUrl(null);
      onAvatarUpdated?.(null);
      setSuccessMessage("Profile photo removed.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error removing avatar photo.";
      console.error("Avatar remove error:", err);
      setErrorMessage(msg);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar Display */}
        <div className="relative group/avatar">
          <div className="size-20 sm:size-24 rounded-full overflow-hidden border-2 border-border/80 bg-muted/60 flex items-center justify-center text-primary shrink-0 relative shadow-xs">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={userName || "Profile"}
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold uppercase font-heading">
                {initialChar || <UserIcon className="size-8 text-muted-foreground" />}
              </span>
            )}
          </div>

          {/* Quick upload overlay on hover */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isRemoving}
            className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer disabled:pointer-events-none"
            aria-label="Upload new profile picture"
          >
            <Camera className="size-5" />
          </button>
        </div>

        {/* Actions & Instructions */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload profile image file"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isRemoving}
              className="text-xs gap-1.5 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="size-3.5 text-primary" />
                  <span>{avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                </>
              )}
            </Button>

            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={isUploading || isRemoving}
                className="text-xs gap-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3.5" />
                    <span>Remove</span>
                  </>
                )}
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP or GIF up to 5MB. Circular cropped automatically.
          </p>

          {/* Feedback messages */}
          {errorMessage && (
            <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-xs text-emerald-500 font-medium">{successMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

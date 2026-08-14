"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserName } from "@/app/actions/account";
import { Loader2, AlertCircle, User } from "lucide-react";

interface EditNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string | null;
  onNameUpdated: (newName: string | null) => void;
}

export function EditNameDialog({
  open,
  onOpenChange,
  currentName,
  onNameUpdated,
}: EditNameDialogProps) {
  const [name, setName] = useState(currentName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state with prop whenever dialog opens
  useEffect(() => {
    if (open) {
      setName(currentName || "");
      setError(null);
    }
  }, [open, currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await updateUserName(name);
      if (res.success && res.data !== undefined) {
        onNameUpdated(res.data.name);
        onOpenChange(false);
      } else {
        setError(res.error || "Failed to update display name.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="gap-1.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Edit Display Name
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              This name will be displayed in the header and across your workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="display-name" className="text-xs font-medium">
                Display Name
              </Label>
              <Input
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                maxLength={60}
                autoFocus
                disabled={isLoading}
                className="text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Leave empty if you prefer using your email prefix.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="gap-1.5"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Changes</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

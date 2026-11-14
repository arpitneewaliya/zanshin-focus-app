import React from "react";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}

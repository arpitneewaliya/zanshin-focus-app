import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Sign In - Zanshin Focus",
  description: "Sign in to your Zanshin Focus account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-2xl bg-muted/20" />}>
      <LoginForm />
    </Suspense>
  );
}

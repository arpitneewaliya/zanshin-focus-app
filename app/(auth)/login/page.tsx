import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Sign In - Zanshin Focus",
  description: "Sign in to your Zanshin Focus account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-8">
      <Suspense fallback={<div className="h-96 w-full max-w-md bg-muted/20 animate-pulse rounded-2xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

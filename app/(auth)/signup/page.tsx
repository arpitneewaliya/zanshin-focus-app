import { SignUpForm } from "@/features/auth/components/signup-form";

export const metadata = {
  title: "Sign Up - Zanshin Focus",
  description: "Create a new Zanshin Focus account.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-8">
      <SignUpForm />
    </div>
  );
}

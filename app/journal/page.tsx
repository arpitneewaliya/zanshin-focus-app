import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JournalView } from "@/features/journal/components/journal-view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getJournalEntries } from "@/app/actions/journal";

export const metadata = {
  title: "Personal Journal - Zanshin Focus",
  description: "Reflect on work sessions with rich text and markdown entries.",
};

export default async function JournalPage() {
  const result = await getJournalEntries();
  const initialEntries = result.success && result.data ? result.data : [];
  const initialError = !result.success && !result.guest ? result.error : undefined;

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
        <h1 className="text-xl font-semibold tracking-tight font-heading">
          Personal Journal
        </h1>
        <div className="w-24" /> {/* Balance layout */}
      </div>

      {/* Main Journal View */}
      <JournalView initialEntries={initialEntries} initialError={initialError} />
    </div>
  );
}

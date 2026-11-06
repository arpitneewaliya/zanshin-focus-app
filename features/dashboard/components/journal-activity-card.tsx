import Link from "next/link";
import { BookOpen, ArrowUpRight, Plus, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { JournalMetrics } from "@/features/dashboard/types";

interface JournalActivityCardProps {
  metrics: JournalMetrics;
}

function formatDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return isoStr;
  }
}

export function JournalActivityCard({ metrics }: JournalActivityCardProps) {
  const { recentEntry } = metrics;

  return (
    <Card className="h-full flex flex-col justify-between hover:border-primary/40 transition-colors group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Personal Reflection
          </CardTitle>
        </div>
        <Link
          href="/journal"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
        >
          Open Journal
          <ArrowUpRight className="size-3" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {recentEntry ? (
          <Link
            href="/journal"
            className="block p-3 rounded-lg bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-sm text-foreground truncate">
                {recentEntry.title}
              </h4>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                <Calendar className="size-3" />
                {formatDate(recentEntry.updatedAt)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {recentEntry.snippet || "No additional notes..."}
            </p>
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center py-5 text-center text-muted-foreground space-y-2">
            <BookOpen className="size-7 stroke-[1.5] text-muted-foreground/40" />
            <p className="text-xs">No journal entries written yet</p>
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="size-3" />
              Write first entry
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2.5">
          <span>Entries written this week:</span>
          <span className="font-medium text-foreground">
            {metrics.entriesThisWeekCount} {metrics.entriesThisWeekCount === 1 ? "entry" : "entries"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

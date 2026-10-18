import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 animate-in fade-in duration-200">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="space-y-4 pt-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}

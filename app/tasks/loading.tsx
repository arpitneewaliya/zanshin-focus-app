import { Skeleton } from "@/components/ui/skeleton";

export default function TasksLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-6 w-32" />
        <div className="w-24" />
      </div>

      {/* Task Creation & Filters skeleton */}
      <div className="space-y-4">
        {/* Input row */}
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>

        {/* Filter chips */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        {/* Task Items */}
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg border border-border/50 bg-card flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-48 sm:w-72" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

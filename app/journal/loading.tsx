import { Skeleton } from "@/components/ui/skeleton";

export default function JournalLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-6 w-36" />
        <div className="w-24" />
      </div>

      {/* Main Journal Layout: Sidebar + Editor */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-14rem)] min-h-[500px]">
        {/* Left Sidebar */}
        <div className="md:col-span-4 border border-border/60 rounded-xl bg-card p-4 space-y-4 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md shrink-0" />
          </div>
          <div className="space-y-2 flex-1 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-lg border border-border/40 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Editor Pane */}
        <div className="md:col-span-8 border border-border/60 rounded-xl bg-card p-6 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <Skeleton className="h-8 w-64" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
          <div className="space-y-3 flex-1 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

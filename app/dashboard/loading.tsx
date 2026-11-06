import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Top Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-64 sm:w-80" />
          <Skeleton className="h-4 w-72 sm:w-96" />
        </div>

        {/* Quick Launcher Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </div>

      {/* Bento Grid Layer 1: Deep Work & Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deep Work Bento Skeleton */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-xl" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5 space-y-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-12 w-36" />
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
                <div className="md:col-span-7 h-36 flex items-end gap-2 pt-2">
                  <Skeleton className="h-20 flex-1 rounded-t" />
                  <Skeleton className="h-28 flex-1 rounded-t" />
                  <Skeleton className="h-16 flex-1 rounded-t" />
                  <Skeleton className="h-32 flex-1 rounded-t" />
                  <Skeleton className="h-24 flex-1 rounded-t" />
                  <Skeleton className="h-12 flex-1 rounded-t" />
                  <Skeleton className="h-36 flex-1 rounded-t" />
                </div>
              </div>
              <div className="pt-3 border-t flex justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Habit Cadence Bento Skeleton */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-xl" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <div className="pt-2 border-t flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bento Grid Layer 2: Priorities, Reflection, & Zen Ambience */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Priorities Skeleton */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-xl" />
                <Skeleton className="h-5 w-28" />
              </div>
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <div className="pt-2 border-t flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reflection Skeleton */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-xl" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <div className="pt-2 border-t flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zen Ambience Skeleton */}
        <div className="md:col-span-2 lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-xl" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-4 w-8" />
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Skeleton className="h-14 w-full rounded-xl" />
              <div className="flex justify-center items-center gap-3">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="size-11 rounded-full" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
              <div className="pt-2 border-t flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

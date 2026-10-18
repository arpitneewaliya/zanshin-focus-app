import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-64 sm:w-80" />
          <Skeleton className="h-4 w-72 sm:w-96" />
        </div>

        {/* Quick Launcher Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="space-y-6">
        {/* Row 1: Focus Metrics & 7-Day Chart */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <Card className="h-full">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-7">
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="pt-2">
                <Skeleton className="h-44 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 2: Habit Streaks & Task Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 3: Journal Activity & Quick Nav */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6">
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-6">
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

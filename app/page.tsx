import { getDashboardData } from "@/app/actions/dashboard";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { DashboardData } from "@/features/dashboard/types";

export const metadata = {
  title: "Dashboard - Zanshin Focus",
  description:
    "Central hub and real-time productivity statistics combining Pomodoro focus sessions, task completion, habit streaks, and personal reflections.",
};

const defaultEmptyData: DashboardData = {
  focus: {
    todayMinutes: 0,
    todaySessionsCount: 0,
    dailyAverage7DaysMinutes: 0,
    diffFromAvgPercent: null,
    last7Days: [],
  },
  tasks: {
    openCount: 0,
    completedCount: 0,
    completedTodayCount: 0,
    completedThisWeekCount: 0,
    overdueCount: 0,
    totalCount: 0,
  },
  habits: [],
  journal: {
    recentEntry: null,
    entriesThisWeekCount: 0,
    totalEntriesCount: 0,
  },
  isGuest: true,
};

export default async function DashboardPage() {
  const result = await getDashboardData();
  const data = result.success && result.data ? result.data : defaultEmptyData;
  const error = !result.success && !result.guest ? result.error : undefined;

  return <DashboardView data={data} error={error} />;
}

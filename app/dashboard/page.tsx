import { Suspense } from "react"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { RecentExams } from "@/components/dashboard/recent-exams"
import { ExamStats } from "@/components/dashboard/exam-stats"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your exams and monitor student progress
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <div className="px-4 lg:px-6">
            <DashboardOverview />
          </div>

          <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
            <ExamStats />
          </div>

          <div className="px-4 lg:px-6">
            <QuickActions />
          </div>

          <div className="px-4 lg:px-6">
            <RecentExams />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
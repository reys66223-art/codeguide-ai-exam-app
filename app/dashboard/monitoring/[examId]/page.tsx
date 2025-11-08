import { Suspense } from "react"
import { MonitoringDashboard } from "@/components/monitoring/monitoring-dashboard"
import { MonitoringSkeleton } from "@/components/monitoring/monitoring-skeleton"
import { PageHeader } from "@/components/page-header"

interface MonitoringPageProps {
  params: {
    examId: string
  }
}

export default function MonitoringPage({ params }: MonitoringPageProps) {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <PageHeader
          title="Live Exam Monitoring"
          description="Real-time monitoring of student progress and activity"
        />

        <Suspense fallback={<MonitoringSkeleton />}>
          <div className="px-4 lg:px-6">
            <MonitoringDashboard examId={params.examId} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
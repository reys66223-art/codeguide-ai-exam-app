import { Suspense } from "react"
import { ResultsDashboard } from "@/components/results/results-dashboard"
import { ResultsSkeleton } from "@/components/results/results-skeleton"
import { PageHeader } from "@/components/page-header"

export default function ResultsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <PageHeader
          title="Exam Results"
          description="View and analyze student performance and AI feedback"
        />

        <Suspense fallback={<ResultsSkeleton />}>
          <div className="px-4 lg:px-6">
            <ResultsDashboard />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
import { Suspense } from "react"
import { ExamList } from "@/components/exams/exam-list"
import { ExamListSkeleton } from "@/components/exams/exam-list-skeleton"
import { PageHeader } from "@/components/page-header"

export default function ExamsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <PageHeader
          title="Exams"
          description="Manage and monitor all your exams"
          action={{
            label: "Create Exam",
            href: "/dashboard/exams/create"
          }}
        />

        <Suspense fallback={<ExamListSkeleton />}>
          <div className="px-4 lg:px-6">
            <ExamList />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
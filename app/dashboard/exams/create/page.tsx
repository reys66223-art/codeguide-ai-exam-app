import { Suspense } from "react"
import { CreateExamForm } from "@/components/exams/create-exam-form"
import { CreateExamFormSkeleton } from "@/components/exams/create-exam-form-skeleton"
import { PageHeader } from "@/components/page-header"

export default function CreateExamPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <PageHeader
          title="Create New Exam"
          description="Set up a new examination with questions and configuration"
        />

        <Suspense fallback={<CreateExamFormSkeleton />}>
          <div className="px-4 lg:px-6">
            <CreateExamForm />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
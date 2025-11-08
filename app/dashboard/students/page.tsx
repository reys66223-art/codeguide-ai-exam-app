import { Suspense } from "react"
import { StudentRegistration } from "@/components/students/student-registration"
import { StudentRegistrationSkeleton } from "@/components/students/student-registration-skeleton"
import { PageHeader } from "@/components/page-header"

export default function StudentsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <PageHeader
          title="Student Registration"
          description="Register students for the exam system"
        />

        <Suspense fallback={<StudentRegistrationSkeleton />}>
          <div className="px-4 lg:px-6">
            <StudentRegistration />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
import { Suspense } from "react"
import { ExamInterface } from "@/components/exam/exam-interface"
import { ExamInterfaceSkeleton } from "@/components/exam/exam-interface-skeleton"

interface ExamPageProps {
  params: {
    examId: string
  }
}

export default function ExamPage({ params }: ExamPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<ExamInterfaceSkeleton />}>
        <ExamInterface examId={params.examId} />
      </Suspense>
    </div>
  )
}
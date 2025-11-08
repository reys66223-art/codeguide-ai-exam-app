import { Suspense } from "react"
import { ExamLoginForm } from "@/components/exam/exam-login-form"
import { ExamLoginSkeleton } from "@/components/exam/exam-login-skeleton"

export default function ExamLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Portal</h1>
          <p className="text-gray-600">Enter your exam code to get started</p>
        </div>

        <Suspense fallback={<ExamLoginSkeleton />}>
          <ExamLoginForm />
        </Suspense>
      </div>
    </div>
  )
}
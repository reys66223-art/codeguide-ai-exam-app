import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ExamCompletedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Exam Completed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-700">
              Your exam has been successfully submitted.
            </p>
            <p className="text-sm text-gray-600">
              Your teacher will grade your exam and the results will be available soon.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              <p className="font-medium">What happens next?</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Your answers are being processed</li>
                <li>• Essay questions will be graded by AI</li>
                <li>• Results will be available once grading is complete</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/exam/login">
                  Take Another Exam
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
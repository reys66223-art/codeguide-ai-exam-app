import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ExamData,
  StudentData,
  Answer
} from "@/lib/stores/exam-store"
import {
  IconCheck,
  IconCircle,
  IconFlag,
  IconArrowLeft,
  IconDownload,
  IconClock,
  IconTrendingUp,
  IconFileDescription
} from "@tabler/icons-react"

interface ExamSummaryProps {
  examData: ExamData
  studentData: StudentData
  answers: Record<string, Answer>
  onBackToExam: () => void
  onFinishExam: () => void
  isSubmitted: boolean
}

export function ExamSummary({
  examData,
  studentData,
  answers,
  onBackToExam,
  onFinishExam,
  isSubmitted
}: ExamSummaryProps) {
  const answeredQuestions = Object.entries(answers).filter(
    ([_, answer]) => answer.answer !== null && answer.answer !== undefined && answer.answer !== ''
  )

  const markedQuestions = Object.entries(answers).filter(
    ([_, answer]) => answer.isMarkedForReview
  )

  const unansweredQuestions = examData.questions.filter(
    q => !answers[q.id] || answers[q.id].answer === null || answers[q.id].answer === undefined || answers[q.id].answer === ''
  )

  const totalTimeSpent = Object.values(answers).reduce(
    (total, answer) => total + (answer.timeSpent || 0), 0
  )

  const getQuestionStatus = (questionId: string) => {
    const answer = answers[questionId]
    if (!answer || answer.answer === null || answer.answer === undefined || answer.answer === '') {
      return 'unanswered'
    }
    return answer.isMarkedForReview ? 'marked' : 'answered'
  }

  const getStatusIcon = (status: 'answered' | 'unanswered' | 'marked') => {
    switch (status) {
      case 'answered':
        return <IconCheck className="h-4 w-4 text-green-600" />
      case 'marked':
        return <IconFlag className="h-4 w-4 text-orange-600" />
      default:
        return <IconCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSubmitted ? "Exam Submitted Successfully!" : "Exam Summary"}
          </h1>
          <p className="text-gray-600">
            {isSubmitted
              ? "Your exam has been submitted and is being processed."
              : "Review your answers before submitting."
            }
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{studentData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NISN:</span>
                <span className="font-medium">{studentData.nisn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date of Birth:</span>
                <span className="font-medium">{studentData.dateOfBirth}</span>
              </div>
            </CardContent>
          </Card>

          {/* Exam Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exam Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title:</span>
                <span className="font-medium">{examData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Questions:</span>
                <span className="font-medium">{examData.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Score:</span>
                <span className="font-medium">{examData.maxScore} points</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {answeredQuestions.length}
              </div>
              <div className="text-sm text-muted-foreground">Answered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {markedQuestions.length}
              </div>
              <div className="text-sm text-muted-foreground">Marked for Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {unansweredQuestions.length}
              </div>
              <div className="text-sm text-muted-foreground">Unanswered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatTime(totalTimeSpent)}
              </div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconTrendingUp className="h-5 w-5 mr-2" />
              Completion Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round((answeredQuestions.length / examData.questions.length) * 100)}%</span>
              </div>
              <Progress
                value={(answeredQuestions.length / examData.questions.length) * 100}
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Question Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconFileDescription className="h-5 w-5 mr-2" />
              Question Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Summary */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <IconCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Answered</div>
                    <div className="text-sm text-green-700">
                      {answeredQuestions.length} questions
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <IconFlag className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-orange-900">Marked for Review</div>
                    <div className="text-sm text-orange-700">
                      {markedQuestions.length} questions
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <IconCircle className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Unanswered</div>
                    <div className="text-sm text-gray-700">
                      {unansweredQuestions.length} questions
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Question List */}
              <div className="space-y-2">
                <h4 className="font-medium">All Questions</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {examData.questions.map((question) => {
                    const status = getQuestionStatus(question.id)
                    const answer = answers[question.id]

                    return (
                      <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(status)}
                          <div>
                            <div className="font-medium text-sm">
                              Question {question.order}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {question.type === 'multiple_choice' ? 'Multiple Choice' : 'Essay'} • {question.points} points
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              status === 'answered' ? 'default' :
                              status === 'marked' ? 'secondary' : 'outline'
                            }
                          >
                            {status}
                          </Badge>
                          {answer && answer.timeSpent > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <IconClock className="h-3 w-3 mr-1" />
                              {formatTime(answer.timeSpent)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {!isSubmitted && (
            <>
              <Button variant="outline" onClick={onBackToExam}>
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Back to Exam
              </Button>
              <Button size="lg" onClick={onFinishExam}>
                <IconCheck className="h-4 w-4 mr-2" />
                Submit Exam
              </Button>
            </>
          )}
          {isSubmitted && (
            <>
              <Button variant="outline">
                <IconDownload className="h-4 w-4 mr-2" />
                Download Summary
              </Button>
              <Button size="lg" onClick={onFinishExam}>
                <IconCheck className="h-4 w-4 mr-2" />
                Finish
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
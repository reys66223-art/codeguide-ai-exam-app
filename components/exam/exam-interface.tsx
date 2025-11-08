"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useExamStore } from "@/lib/stores/exam-store"
import { ExamTimer } from "./exam-timer"
import { QuestionNavigator } from "./question-navigator"
import { QuestionDisplay } from "./question-display"
import { ExamSummary } from "./exam-summary"
import {
  IconArrowLeft,
  IconArrowRight,
  IconAlertTriangle,
  IconFlag,
  IconClock,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconList
} from "@tabler/icons-react"
import { toast } from "sonner"

interface ExamInterfaceProps {
  examId: string
}

export function ExamInterface({ examId }: ExamInterfaceProps) {
  const router = useRouter()
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState("")

  const {
    examData,
    studentData,
    sessionData,
    currentQuestion,
    answers,
    timeRemaining,
    getQuestionStatus,
    getProgress,
    getMarkedQuestions,
    getUnansweredQuestions,
    getTimeString,
    initializeExam,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    setAnswer,
    markForReview,
    startTimer,
    pauseTimer,
    submitExam,
    resetExam,
  } = useExamStore()

  // Initialize exam data from session storage
  useEffect(() => {
    try {
      const examSessionData = sessionStorage.getItem("examSession")
      const examDataItem = sessionStorage.getItem("examData")
      const studentDataItem = sessionStorage.getItem("studentData")

      if (!examSessionData || !examDataItem || !studentDataItem) {
        setError("Exam session not found. Please login again.")
        return
      }

      const session = JSON.parse(examSessionData)
      const exam = JSON.parse(examDataItem)
      const student = JSON.parse(studentDataItem)

      // Load questions (mock data for now)
      const mockQuestions = [
        {
          id: "q1",
          type: "multiple_choice" as const,
          content: "What is the value of x in the equation 2x + 5 = 13?",
          options: ["x = 3", "x = 4", "x = 5", "x = 6"],
          points: 5,
          order: 1,
        },
        {
          id: "q2",
          type: "multiple_choice" as const,
          content: "What is the area of a circle with radius 5 cm?",
          options: ["25π cm²", "10π cm²", "5π cm²", "50π cm²"],
          points: 5,
          order: 2,
        },
        {
          id: "q3",
          type: "essay" as const,
          content: "Explain the Pythagorean theorem and provide a real-world example of where it might be used.",
          points: 10,
          order: 3,
        },
        {
          id: "q4",
          type: "multiple_choice" as const,
          content: "Simplify: (3x²)(2x³)",
          options: ["6x⁵", "5x⁵", "6x⁶", "5x⁶"],
          points: 5,
          order: 4,
        },
        {
          id: "q5",
          type: "essay" as const,
          content: "Describe how quadratic equations can be used to solve real-world problems. Provide at least two different examples.",
          points: 10,
          order: 5,
        },
      ]

      const examWithQuestions = {
        ...exam,
        questions: mockQuestions,
      }

      initializeExam(examWithQuestions, student, session)
      setIsInitialized(true)
      startTimer()

      // Set up auto-save every 30 seconds
      const autoSaveInterval = setInterval(() => {
        // Auto-save logic would go here
        console.log("Auto-saving exam progress...")
      }, 30000)

      return () => {
        clearInterval(autoSaveInterval)
        pauseTimer()
      }
    } catch (error) {
      console.error("Error initializing exam:", error)
      setError("Failed to initialize exam. Please try again.")
    }
  }, [examId, initializeExam, startTimer, pauseTimer])

  // Handle timer expiration
  useEffect(() => {
    if (timeRemaining <= 0 && isInitialized) {
      handleSubmitExam()
    }
  }, [timeRemaining, isInitialized])

  // Handle window close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isInitialized && sessionData?.status !== 'submitted') {
        e.preventDefault()
        e.returnValue = "Your exam progress will be lost if you leave this page. Are you sure?"
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isInitialized, sessionData?.status])

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswer(questionId, answer)
  }

  const handleMarkForReview = (questionId: string, marked: boolean) => {
    markForReview(questionId, marked)
    toast.success(marked ? "Question marked for review" : "Review mark removed")
  }

  const handleSubmitExam = () => {
    const unansweredQuestions = getUnansweredQuestions()
    const markedQuestions = getMarkedQuestions()

    if (unansweredQuestions.length > 0) {
      setIsSubmitDialogOpen(true)
    } else {
      submitExam()
      setShowSummary(true)
    }
  }

  const confirmSubmit = () => {
    submitExam()
    setIsSubmitDialogOpen(false)
    setShowSummary(true)
  }

  const handleViewSummary = () => {
    setShowSummary(true)
  }

  const handleBackToExam = () => {
    setShowSummary(false)
  }

  const handleFinishExam = () => {
    // Clean up session storage
    sessionStorage.removeItem("examSession")
    sessionStorage.removeItem("examData")
    sessionStorage.removeItem("studentData")
    resetExam()

    // Redirect to results page (when implemented)
    router.push("/exam/completed")
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <IconAlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Exam Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push("/exam/login")}>
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isInitialized || !examData || !studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    )
  }

  if (showSummary || sessionData?.status === 'submitted') {
    return (
      <ExamSummary
        examData={examData}
        studentData={studentData}
        answers={answers}
        onBackToExam={handleBackToExam}
        onFinishExam={handleFinishExam}
        isSubmitted={sessionData?.status === 'submitted'}
      />
    )
  }

  const currentQuestionData = examData.questions[currentQuestion - 1]
  const progress = getProgress()
  const questionStatus = currentQuestionData ? getQuestionStatus(currentQuestionData.id) : 'unanswered'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">{examData.title}</h1>
            <Badge variant="outline">
              Question {currentQuestion} of {examData.questions.length}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <IconUser className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{studentData.name}</span>
            </div>
            <ExamTimer
              timeRemaining={timeRemaining}
              timeString={getTimeString()}
              isWarning={timeRemaining < 300} // 5 minutes warning
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto mt-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>{progress.answered} of {progress.total} questions answered</span>
            <span>{progress.percentage}% complete</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <QuestionNavigator
              questions={examData.questions}
              currentQuestion={currentQuestion}
              answers={answers}
              onNavigate={navigateToQuestion}
              onShowSummary={handleViewSummary}
              getQuestionStatus={getQuestionStatus}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Question */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-semibold">
                        Question {currentQuestion}
                      </h2>
                      <Badge
                        variant={
                          questionStatus === 'answered' ? 'default' :
                          questionStatus === 'marked' ? 'secondary' : 'outline'
                        }
                      >
                        {questionStatus === 'answered' && <IconCheck className="h-3 w-3 mr-1" />}
                        {questionStatus === 'marked' && <IconFlag className="h-3 w-3 mr-1" />}
                        {questionStatus}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkForReview(currentQuestionData.id, !answers[currentQuestionData.id]?.isMarkedForReview)}
                      className={answers[currentQuestionData.id]?.isMarkedForReview ? "text-orange-600" : "text-gray-500"}
                    >
                      <IconFlag className="h-4 w-4 mr-1" />
                      {answers[currentQuestionData.id]?.isMarkedForReview ? "Marked" : "Mark for Review"}
                    </Button>
                  </div>

                  {currentQuestionData && (
                    <QuestionDisplay
                      question={currentQuestionData}
                      answer={answers[currentQuestionData.id]?.answer}
                      onAnswerChange={(answer) => handleAnswerChange(currentQuestionData.id, answer)}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 1}
                >
                  <IconArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {timeRemaining < 300 && (
                    <Alert className="py-2 px-3">
                      <IconAlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Less than 5 minutes remaining!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex space-x-2">
                  {currentQuestion < examData.questions.length ? (
                    <Button onClick={nextQuestion}>
                      Next
                      <IconArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitExam} variant="default">
                      Submit Exam
                      <IconCheck className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              You have {getUnansweredQuestions().length} unanswered questions and{" "}
              {getMarkedQuestions().length} questions marked for review.
              Are you sure you want to submit your exam?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} className="bg-destructive text-destructive-foreground">
              Submit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Import IconUser
const IconUser = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
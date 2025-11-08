"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  IconArrowRight,
  IconAlertCircle,
  IconKey,
  IconUser,
  IconCalendar
} from "@tabler/icons-react"
import { toast } from "sonner"

const examCodeSchema = z.object({
  examCode: z.string().min(1, "Exam code is required").max(10, "Invalid exam code format"),
})

const studentVerificationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  dateOfBirth: z.string().refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }, "Valid date of birth is required"),
})

type ExamCodeForm = z.infer<typeof examCodeSchema>
type StudentVerificationForm = z.infer<typeof studentVerificationSchema>

export function ExamLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<"code" | "verification">("code")
  const [examData, setExamData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const examCodeForm = useForm<ExamCodeForm>({
    resolver: zodResolver(examCodeSchema),
    defaultValues: {
      examCode: searchParams.get("code") || "",
    },
  })

  const verificationForm = useForm<StudentVerificationSchema>({
    resolver: zodResolver(studentVerificationSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
    },
  })

  const onExamCodeSubmit = async (data: ExamCodeForm) => {
    setIsLoading(true)
    setError("")

    try {
      // TODO: Validate exam code with API
      const mockExamResponse = {
        id: "exam-123",
        title: "Mathematics Final Exam",
        description: "Comprehensive math exam covering algebra, geometry, and statistics",
        duration: 90,
        displayMode: "one_by_one",
        startTime: "2024-01-16T09:00:00Z",
        endTime: "2024-01-23T17:00:00Z",
        status: "active",
        teacherName: "Dr. Smith",
        totalQuestions: 20,
        maxScore: 100,
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check if exam exists and is active
      if (!mockExamResponse || mockExamResponse.status !== "active") {
        setError("Invalid exam code or exam is not currently active")
        return
      }

      setExamData(mockExamResponse)
      setStep("verification")
      toast.success("Exam found! Please verify your identity.")
    } catch (error) {
      setError("Failed to validate exam code. Please try again.")
      console.error("Error validating exam code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onVerificationSubmit = async (data: StudentVerificationForm) => {
    setIsLoading(true)
    setError("")

    try {
      // TODO: Verify student identity and create exam session
      const mockStudent = {
        id: "student-123",
        name: data.name,
        nisn: "20230001",
        dateOfBirth: data.dateOfBirth,
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create exam session
      const sessionData = {
        sessionId: "session-123",
        examId: examData.id,
        studentId: mockStudent.id,
        startTime: new Date().toISOString(),
        timeRemaining: examData.duration * 60, // Convert to seconds
      }

      // Store session data (in a real app, this would be handled by the backend)
      sessionStorage.setItem("examSession", JSON.stringify(sessionData))
      sessionStorage.setItem("examData", JSON.stringify(examData))
      sessionStorage.setItem("studentData", JSON.stringify(mockStudent))

      toast.success("Identity verified! Starting exam...")

      // Redirect to exam page
      setTimeout(() => {
        router.push(`/exam/${examData.id}`)
      }, 1000)
    } catch (error) {
      setError("Verification failed. Please check your information and try again.")
      console.error("Error verifying student:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep("code")
    setExamData(null)
    setError("")
    examCodeForm.reset()
    verificationForm.reset()
  }

  if (step === "verification" && examData) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify Your Identity</CardTitle>
          <CardDescription>
            Please confirm your details to start the exam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exam Information */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm">{examData.title}</h3>
            <p className="text-xs text-muted-foreground">{examData.description}</p>
            <div className="flex justify-between text-xs">
              <span>Duration: {examData.duration} minutes</span>
              <span>Questions: {examData.totalQuestions}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Teacher: {examData.teacherName}</span>
              <span>Max Score: {examData.maxScore}</span>
            </div>
          </div>

          {/* Verification Form */}
          <Form {...verificationForm}>
            <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
              <FormField
                control={verificationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IconUser className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter your full name"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={verificationForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IconCalendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This must match the date of birth registered with your school
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">
                  By starting this exam, you agree to the exam rules and academic integrity policy.
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    "Verifying..."
                  ) : (
                    <>
                      Start Exam
                      <IconArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <IconKey className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Enter Exam Code</CardTitle>
        <CardDescription>
          Enter the exam code provided by your teacher
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...examCodeForm}>
          <form onSubmit={examCodeForm.handleSubmit(onExamCodeSubmit)} className="space-y-4">
            <FormField
              control={examCodeForm.control}
              name="examCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Code *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-character exam code"
                      className="text-center text-lg font-mono tracking-widest uppercase"
                      maxLength={10}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The code should be provided by your teacher
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Validating..."
              ) : (
                <>
                  Continue
                  <IconArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Don't have an exam code?
          </p>
          <p className="text-xs text-muted-foreground">
            Please contact your teacher for the correct exam code.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
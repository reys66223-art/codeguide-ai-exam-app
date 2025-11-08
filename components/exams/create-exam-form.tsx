"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  IconClock,
  IconEye,
  IconSave,
  IconArrowRight,
  IconRefresh
} from "@tabler/icons-react"
import { generateExamCode } from "@/lib/db/queries"
import { toast } from "sonner"

const createExamSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().optional(),
  duration: z.number().min(5, "Duration must be at least 5 minutes").max(480, "Duration cannot exceed 8 hours"),
  displayMode: z.enum(["one_by_one", "all_at_once"]),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

type CreateExamForm = z.infer<typeof createExamSchema>

export function CreateExamForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [examCode, setExamCode] = useState<string>("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const form = useForm<CreateExamForm>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 60,
      displayMode: "one_by_one",
    },
  })

  const generateNewExamCode = async () => {
    try {
      const code = await generateExamCode()
      setExamCode(code)
    } catch (error) {
      toast.error("Failed to generate exam code")
    }
  }

  const onSubmit = async (data: CreateExamForm) => {
    setIsSubmitting(true)
    try {
      // Generate exam code if not already generated
      let code = examCode
      if (!code) {
        code = await generateExamCode()
        setExamCode(code)
      }

      // TODO: Create exam in database
      console.log("Creating exam:", { ...data, examCode: code })

      toast.success("Exam created successfully!")

      // Redirect to question management page
      setTimeout(() => {
        router.push(`/dashboard/exams/new-id/questions`)
      }, 1000)
    } catch (error) {
      toast.error("Failed to create exam")
      console.error("Error creating exam:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveAsDraft = async () => {
    setIsSubmitting(true)
    try {
      let code = examCode
      if (!code) {
        code = await generateExamCode()
        setExamCode(code)
      }

      // TODO: Save exam as draft in database
      console.log("Saving exam as draft:", { ...form.getValues(), examCode: code })

      toast.success("Exam saved as draft!")
      router.push("/dashboard/exams")
    } catch (error) {
      toast.error("Failed to save exam as draft")
      console.error("Error saving exam as draft:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exam Code Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Exam Code
            <Button
              variant="outline"
              size="sm"
              onClick={generateNewExamCode}
              disabled={isSubmitting}
            >
              <IconRefresh className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardTitle>
          <CardDescription>
            Generate a unique code that students will use to access this exam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="font-mono text-2xl font-bold tracking-wider bg-muted px-4 py-2 rounded">
              {examCode || "XXXXXX"}
            </div>
            {examCode && (
              <div className="text-sm text-muted-foreground">
                Share this code with students for exam access
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details for your examination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Mathematics Final Exam"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear title that describes the examination
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="5"
                          max="480"
                          placeholder="60"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Time students have to complete the exam
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the exam content, topics covered, and any special instructions..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description to help students understand what to expect
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Display Mode *</FormLabel>
                    <FormDescription>
                      Choose how questions will be presented to students
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 gap-4 pt-2"
                      >
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="one_by_one" id="one_by_one" />
                          <div className="flex-1">
                            <Label htmlFor="one_by_one" className="font-medium cursor-pointer">
                              One by One
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Students see one question at a time and navigate between questions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="all_at_once" id="all_at_once" />
                          <div className="flex-1">
                            <Label htmlFor="all_at_once" className="font-medium cursor-pointer">
                              All at Once
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              All questions are displayed on a single page
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Advanced Settings */}
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full justify-start"
                >
                  <IconEye className="h-4 w-4 mr-2" />
                  {showAdvanced ? "Hide" : "Show"} Advanced Settings
                </Button>

                {showAdvanced && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Scheduling</CardTitle>
                      <CardDescription>
                        Set specific start and end times for the exam (optional)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="start-time">Start Time</Label>
                          <Input
                            id="start-time"
                            type="datetime-local"
                            {...form.register("startTime")}
                          />
                          <p className="text-xs text-muted-foreground">
                            When students can begin taking the exam
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-time">End Time</Label>
                          <Input
                            id="end-time"
                            type="datetime-local"
                            {...form.register("endTime")}
                          />
                          <p className="text-xs text-muted-foreground">
                            Deadline for exam submission
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <div className="flex space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={isSubmitting}>
                        <IconSave className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Save as Draft?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will save the exam configuration as a draft. You can come back later to add questions and finalize the settings.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={saveAsDraft}>
                          Save Draft
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Creating..."
                    ) : (
                      <>
                        Continue to Questions
                        <IconArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
import { z } from "zod";

// Base schemas
export const examDisplayModeSchema = z.enum(["one_by_one", "all_at_once"]);
export const questionTypeSchema = z.enum(["multiple_choice", "essay"]);
export const examSessionStatusSchema = z.enum(["not_started", "in_progress", "completed", "submitted", "expired"]);
export const examStatusSchema = z.enum(["draft", "active", "ended"]);

// Student schemas
export const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  nisn: z.string().min(1, "NISN is required").max(20, "NISN too long"),
  dateOfBirth: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed < new Date();
  }, "Valid date of birth is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const studentLoginSchema = z.object({
  nisn: z.string().min(1, "NISN is required"),
  password: z.string().min(1, "Password is required"),
});

// Teacher schemas
export const createTeacherSchema = z.object({
  userId: z.string().uuid("Valid user ID is required"),
  schoolName: z.string().optional(),
  teacherId: z.string().optional(),
});

// Exam schemas
export const createExamSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().optional(),
  duration: z.number().min(5, "Duration must be at least 5 minutes").max(480, "Duration cannot exceed 8 hours"),
  displayMode: examDisplayModeSchema.default("one_by_one"),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
});

export const updateExamSchema = createExamSchema.partial().extend({
  id: z.string().uuid(),
});

// Question schemas
export const createMultipleChoiceQuestionSchema = z.object({
  type: z.literal("multiple_choice"),
  content: z.string().min(1, "Question content is required"),
  options: z.array(z.string()).min(4, "At least 4 options required").max(5, "Maximum 5 options allowed"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  points: z.number().min(1, "Points must be at least 1").max(100, "Points cannot exceed 100"),
  order: z.number().min(1, "Order must be at least 1"),
});

export const createEssayQuestionSchema = z.object({
  type: z.literal("essay"),
  content: z.string().min(1, "Question content is required"),
  modelAnswer: z.string().min(1, "Model answer is required for essay questions"),
  points: z.number().min(1, "Points must be at least 1").max(100, "Points cannot exceed 100"),
  order: z.number().min(1, "Order must be at least 1"),
});

export const createQuestionSchema = z.discriminatedUnion("type", [
  createMultipleChoiceQuestionSchema,
  createEssayQuestionSchema,
]);

export const updateQuestionSchema = createQuestionSchema.partial().extend({
  id: z.string().uuid(),
});

// Exam session schemas
export const createExamSessionSchema = z.object({
  examId: z.string().uuid(),
  studentId: z.string().uuid(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export const updateExamSessionSchema = z.object({
  status: examSessionStatusSchema.optional(),
  currentQuestion: z.number().min(1).optional(),
  timeRemaining: z.number().min(0).optional(),
});

// Submission schemas
export const createSubmissionSchema = z.object({
  examId: z.string().uuid(),
  studentId: z.string().uuid(),
  sessionId: z.string().uuid(),
  answers: z.record(z.any()),
  maxScore: z.number().min(0),
});

export const gradeSubmissionSchema = z.object({
  essayScore: z.number().min(0).max(100),
  aiFeedback: z.array(z.object({
    questionId: z.string(),
    score: z.number(),
    feedback: z.string(),
    keyPointsCovered: z.array(z.string()),
    missingPoints: z.array(z.string()),
  })).optional(),
});

// Question activity schemas
export const createQuestionActivitySchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  timeSpent: z.number().min(0).optional(),
  attempts: z.number().min(1).default(1),
  isMarkedForReview: z.boolean().default(false),
});

// API Request/Response schemas
export const examCodeLoginSchema = z.object({
  examCode: z.string().min(1, "Exam code is required").max(10, "Invalid exam code format"),
});

export const studentVerificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, "Valid date of birth is required"),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.any(),
  isMarkedForReview: z.boolean().default(false),
});

export const completeExamSchema = z.object({
  sessionId: z.string().uuid(),
  answers: z.record(z.any()),
});

// Export types
export type CreateStudent = z.infer<typeof createStudentSchema>;
export type StudentLogin = z.infer<typeof studentLoginSchema>;
export type CreateTeacher = z.infer<typeof createTeacherSchema>;
export type CreateExam = z.infer<typeof createExamSchema>;
export type UpdateExam = z.infer<typeof updateExamSchema>;
export type CreateQuestion = z.infer<typeof createQuestionSchema>;
export type UpdateQuestion = z.infer<typeof updateQuestionSchema>;
export type CreateExamSession = z.infer<typeof createExamSessionSchema>;
export type UpdateExamSession = z.infer<typeof updateExamSessionSchema>;
export type CreateSubmission = z.infer<typeof createSubmissionSchema>;
export type GradeSubmission = z.infer<typeof gradeSubmissionSchema>;
export type CreateQuestionActivity = z.infer<typeof createQuestionActivitySchema>;
export type ExamCodeLogin = z.infer<typeof examCodeLoginSchema>;
export type StudentVerification = z.infer<typeof studentVerificationSchema>;
export type SubmitAnswer = z.infer<typeof submitAnswerSchema>;
export type CompleteExam = z.infer<typeof completeExamSchema>;

// Display types
export type ExamDisplayMode = z.infer<typeof examDisplayModeSchema>;
export type QuestionType = z.infer<typeof questionTypeSchema>;
export type ExamSessionStatus = z.infer<typeof examSessionStatusSchema>;
export type ExamStatus = z.infer<typeof examStatusSchema>;
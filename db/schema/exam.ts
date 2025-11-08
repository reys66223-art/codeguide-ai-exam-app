import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  json,
  varchar,
  uuid,
  pgEnum
} from "drizzle-orm/pg-core";

// Enums for exam configuration
export const examDisplayModeEnum = pgEnum('exam_display_mode', ['one_by_one', 'all_at_once']);
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'essay']);
export const examSessionStatusEnum = pgEnum('exam_session_status', ['not_started', 'in_progress', 'completed', 'submitted', 'expired']);
export const examStatusEnum = pgEnum('exam_status', ['draft', 'active', 'ended']);

// Students table - stores student registration data
export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  nisn: varchar("nisn", { length: 20 }).notNull().unique(),
  dateOfBirth: timestamp("date_of_birth", { mode: 'date' }).notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Teachers table - extends user table for teacher-specific data
export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  schoolName: text("school_name"),
  teacherId: varchar("teacher_id", { length: 50 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Exams table - main exam configuration
export const exams = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  teacherId: uuid("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  displayMode: examDisplayModeEnum("display_mode").notNull().default('one_by_one'),
  examCode: varchar("exam_code", { length: 10 }).notNull().unique(),
  status: examStatusEnum("status").notNull().default('draft'),
  isActive: boolean("is_active").default(false).notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Questions table - stores exam questions
export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  type: questionTypeEnum("type").notNull(),
  content: text("content").notNull(),
  options: json("options"), // For multiple choice questions - array of options
  correctAnswer: text("correct_answer"), // For multiple choice - correct option
  modelAnswer: text("model_answer"), // For essay questions - model answer
  points: integer("points").default(1).notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Exam Sessions table - tracks student exam sessions
export const examSessions = pgTable("exam_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  status: examSessionStatusEnum("status").notNull().default('not_started'),
  currentQuestion: integer("current_question").default(1),
  timeRemaining: integer("time_remaining"), // in seconds
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Submissions table - stores student answers and scores
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  sessionId: uuid("session_id").notNull().references(() => examSessions.id, { onDelete: "cascade" }),
  answers: json("answers").notNull(), // { questionId: answer }
  multipleChoiceScore: integer("multiple_choice_score").default(0),
  essayScore: integer("essay_score").default(0),
  totalScore: integer("total_score").default(0),
  maxScore: integer("max_score").notNull(),
  aiFeedback: json("ai_feedback"), // Detailed AI feedback for essays
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Question Activity table - tracks student activity per question
export const questionActivity = pgTable("question_activity", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => examSessions.id, { onDelete: "cascade" }),
  questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  timeSpent: integer("time_spent"), // in seconds
  attempts: integer("attempts").default(1),
  isMarkedForReview: boolean("is_marked_for_review").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Import user from auth schema for foreign key reference
import { user } from "./auth";

// Indexes for better performance
export const studentsIndex = students.nisn;
export const examsIndex = exams.examCode;
export const examSessionsIndex = examSessions.sessionId;
export const submissionsIndex = submissions.sessionId;
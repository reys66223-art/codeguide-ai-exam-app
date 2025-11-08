-- Create enums
CREATE TYPE "exam_display_mode" AS ENUM('one_by_one', 'all_at_once');
CREATE TYPE "question_type" AS ENUM('multiple_choice', 'essay');
CREATE TYPE "exam_session_status" AS ENUM('not_started', 'in_progress', 'completed', 'submitted', 'expired');
CREATE TYPE "exam_status" AS ENUM('draft', 'active', 'ended');

-- Create students table
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"nisn" varchar(20) NOT NULL,
	"date_of_birth" date NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create teachers table
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"school_name" text,
	"teacher_id" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create exams table
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"duration" integer NOT NULL,
	"display_mode" "exam_display_mode" DEFAULT 'one_by_one' NOT NULL,
	"exam_code" varchar(10) NOT NULL,
	"status" "exam_status" DEFAULT 'draft' NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create questions table
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"type" "question_type" NOT NULL,
	"content" text NOT NULL,
	"options" json,
	"correct_answer" text,
	"model_answer" text,
	"points" integer DEFAULT 1 NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create exam_sessions table
CREATE TABLE "exam_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"status" "exam_session_status" DEFAULT 'not_started' NOT NULL,
	"current_question" integer DEFAULT 1,
	"time_remaining" integer,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create submissions table
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"answers" json NOT NULL,
	"multiple_choice_score" integer DEFAULT 0,
	"essay_score" integer DEFAULT 0,
	"total_score" integer DEFAULT 0,
	"max_score" integer NOT NULL,
	"ai_feedback" json,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"graded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create question_activity table
CREATE TABLE "question_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"time_spent" integer,
	"attempts" integer DEFAULT 1,
	"is_marked_for_review" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create unique constraints
ALTER TABLE "students" ADD CONSTRAINT "students_nisn_unique" UNIQUE("nisn");
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_unique" UNIQUE("user_id");
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_teacher_id_unique" UNIQUE("teacher_id");
ALTER TABLE "exams" ADD CONSTRAINT "exams_exam_code_unique" UNIQUE("exam_code");

-- Create foreign key constraints
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "exams" ADD CONSTRAINT "exams_teacher_id_fkey" FOREIGN KEY("teacher_id") REFERENCES "teachers"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "questions" ADD CONSTRAINT "questions_exam_id_fkey" FOREIGN KEY("exam_id") REFERENCES "exams"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "exam_sessions" ADD CONSTRAINT "exam_sessions_exam_id_fkey" FOREIGN KEY("exam_id") REFERENCES "exams"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "exam_sessions" ADD CONSTRAINT "exam_sessions_student_id_fkey" FOREIGN KEY("student_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "submissions" ADD CONSTRAINT "submissions_exam_id_fkey" FOREIGN KEY("exam_id") REFERENCES "exams"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_fkey" FOREIGN KEY("student_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_session_id_fkey" FOREIGN KEY("session_id") REFERENCES "exam_sessions"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "question_activity" ADD CONSTRAINT "question_activity_session_id_fkey" FOREIGN KEY("session_id") REFERENCES "exam_sessions"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "question_activity" ADD CONSTRAINT "question_activity_question_id_fkey" FOREIGN KEY("question_id") REFERENCES "questions"("id") ON DELETE cascade ON UPDATE no action;

-- Create indexes for better performance
CREATE INDEX "students_nisn_idx" ON "students"("nisn");
CREATE INDEX "exams_exam_code_idx" ON "exams"("exam_code");
CREATE INDEX "exams_teacher_id_idx" ON "exams"("teacher_id");
CREATE INDEX "questions_exam_id_idx" ON "questions"("exam_id");
CREATE INDEX "exam_sessions_exam_id_idx" ON "exam_sessions"("exam_id");
CREATE INDEX "exam_sessions_student_id_idx" ON "exam_sessions"("student_id");
CREATE INDEX "submissions_exam_id_idx" ON "submissions"("exam_id");
CREATE INDEX "submissions_student_id_idx" ON "submissions"("student_id");
CREATE INDEX "submissions_session_id_idx" ON "submissions"("session_id");
CREATE INDEX "question_activity_session_id_idx" ON "question_activity"("session_id");
CREATE INDEX "question_activity_question_id_idx" ON "question_activity"("question_id");
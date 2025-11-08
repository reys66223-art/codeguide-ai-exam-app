import { db } from "@/db";
import {
  students,
  teachers,
  exams,
  questions,
  examSessions,
  submissions,
  questionActivity,
  type Student,
  type Teacher,
  type Exam,
  type Question,
  type ExamSession,
  type Submission,
  type QuestionActivity,
} from "@/db/schema/exam";
import { eq, and, desc, asc } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

// Student operations
export const createStudent = async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
  const [student] = await db
    .insert(students)
    .values({
      id: uuidv4(),
      ...data,
    })
    .returning();
  return student;
};

export const getStudentByNISN = async (nisn: string) => {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.nisn, nisn))
    .limit(1);
  return student;
};

export const getStudentById = async (id: string) => {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  return student;
};

// Teacher operations
export const createTeacher = async (data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => {
  const [teacher] = await db
    .insert(teachers)
    .values({
      id: uuidv4(),
      ...data,
    })
    .returning();
  return teacher;
};

export const getTeacherByUserId = async (userId: string) => {
  const [teacher] = await db
    .select()
    .from(teachers)
    .where(eq(teachers.userId, userId))
    .limit(1);
  return teacher;
};

// Exam operations
export const createExam = async (data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>) => {
  const [exam] = await db
    .insert(exams)
    .values({
      id: uuidv4(),
      ...data,
    })
    .returning();
  return exam;
};

export const getExamByCode = async (examCode: string) => {
  const [exam] = await db
    .select()
    .from(exams)
    .where(eq(exams.examCode, examCode))
    .limit(1);
  return exam;
};

export const getExamById = async (id: string) => {
  const [exam] = await db
    .select()
    .from(exams)
    .where(eq(exams.id, id))
    .limit(1);
  return exam;
};

export const getExamsByTeacherId = async (teacherId: string) => {
  const examList = await db
    .select()
    .from(exams)
    .where(eq(exams.teacherId, teacherId))
    .orderBy(desc(exams.createdAt));
  return examList;
};

export const getActiveExams = async () => {
  const activeExams = await db
    .select()
    .from(exams)
    .where(and(
      eq(exams.isActive, true),
      eq(exams.status, 'active')
    ))
    .orderBy(desc(exams.createdAt));
  return activeExams;
};

// Question operations
export const createQuestion = async (data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
  const [question] = await db
    .insert(questions)
    .values({
      id: uuidv4(),
      ...data,
    })
    .returning();
  return question;
};

export const getQuestionsByExamId = async (examId: string) => {
  const questionList = await db
    .select()
    .from(questions)
    .where(eq(questions.examId, examId))
    .orderBy(asc(questions.order));
  return questionList;
};

export const updateQuestion = async (id: string, data: Partial<Question>) => {
  const [question] = await db
    .update(questions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(questions.id, id))
    .returning();
  return question;
};

export const deleteQuestion = async (id: string) => {
  await db.delete(questions).where(eq(questions.id, id));
};

// Exam Session operations
export const createExamSession = async (data: Omit<ExamSession, 'id' | 'createdAt' | 'updatedAt'>) => {
  const [session] = await db
    .insert(examSessions)
    .values({
      id: uuidv4(),
      ...data,
    })
    .returning();
  return session;
};

export const getExamSession = async (id: string) => {
  const [session] = await db
    .select()
    .from(examSessions)
    .where(eq(examSessions.id, id))
    .limit(1);
  return session;
};

export const getExamSessionByExamAndStudent = async (examId: string, studentId: string) => {
  const [session] = await db
    .select()
    .from(examSessions)
    .where(and(
      eq(examSessions.examId, examId),
      eq(examSessions.studentId, studentId)
    ))
    .limit(1);
  return session;
};

export const updateExamSession = async (id: string, data: Partial<ExamSession>) => {
  const [session] = await db
    .update(examSessions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(examSessions.id, id))
    .returning();
  return session;
};

export const getExamSessionsByExamId = async (examId: string) => {
  const sessions = await db
    .select()
    .from(examSessions)
    .where(eq(examSessions.examId, examId))
    .orderBy(desc(examSessions.startTime));
  return sessions;
};

// Submission operations
export const createSubmission = async (data: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>) => {
  const [submission] = await db
    .insert(submissions)
    .values({
      id: uuidv4(),
      ...data,
    })
    .returning();
  return submission;
};

export const getSubmissionBySessionId = async (sessionId: string) => {
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.sessionId, sessionId))
    .limit(1);
  return submission;
};

export const updateSubmission = async (id: string, data: Partial<Submission>) => {
  const [submission] = await db
    .update(submissions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(submissions.id, id))
    .returning();
  return submission;
};

export const getSubmissionsByExamId = async (examId: string) => {
  const submissionsList = await db
    .select()
    .from(submissions)
    .where(eq(submissions.examId, examId))
    .orderBy(desc(submissions.submittedAt));
  return submissionsList;
};

// Question Activity operations
export const createQuestionActivity = async (data: Omit<QuestionActivity, 'id' | 'createdAt' | 'updatedAt'>) => {
  const [activity] = await db
    .insert(questionActivity)
    .values({
      id: uuidv4(),
      ...data,
    })
    .returning();
  return activity;
};

export const updateQuestionActivity = async (id: string, data: Partial<QuestionActivity>) => {
  const [activity] = await db
    .update(questionActivity)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(questionActivity.id, id))
    .returning();
  return activity;
};

export const getQuestionActivityBySessionId = async (sessionId: string) => {
  const activities = await db
    .select()
    .from(questionActivity)
    .where(eq(questionActivity.sessionId, sessionId))
    .orderBy(asc(questionActivity.createdAt));
  return activities;
};

// Utility function to generate unique exam codes
export const generateExamCode = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code: string;
  let isUnique = false;

  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingExam = await getExamByCode(code);
    isUnique = !existingExam;
  } while (!isUnique);

  return code;
};
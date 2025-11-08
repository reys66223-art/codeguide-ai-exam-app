import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Question {
  id: string
  type: 'multiple_choice' | 'essay'
  content: string
  options?: string[]
  correctAnswer?: string
  modelAnswer?: string
  points: number
  order: number
}

export interface Answer {
  questionId: string
  answer: any
  isMarkedForReview: boolean
  timeSpent: number
}

export interface ExamSession {
  sessionId: string
  examId: string
  studentId: string
  startTime: string
  timeRemaining: number
  currentQuestion: number
  status: 'not_started' | 'in_progress' | 'completed' | 'submitted'
}

export interface ExamData {
  id: string
  title: string
  description: string
  duration: number
  displayMode: 'one_by_one' | 'all_at_once'
  questions: Question[]
  maxScore: number
  teacherName: string
}

export interface StudentData {
  id: string
  name: string
  nisn: string
  dateOfBirth: string
}

interface ExamStore {
  // Exam and session data
  examData: ExamData | null
  studentData: StudentData | null
  sessionData: ExamSession | null

  // Answers and progress
  answers: Record<string, Answer>
  currentQuestion: number
  questionStartTime: number

  // Timer
  timeRemaining: number
  timerInterval: NodeJS.Timeout | null

  // Actions
  initializeExam: (examData: ExamData, studentData: StudentData, sessionData: ExamSession) => void
  setAnswer: (questionId: string, answer: any) => void
  markForReview: (questionId: string, marked: boolean) => void
  navigateToQuestion: (questionNumber: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  startTimer: () => void
  pauseTimer: () => void
  updateTimeRemaining: (time: number) => void
  submitExam: () => void
  resetExam: () => void

  // Computed values
  getQuestionStatus: (questionId: string) => 'answered' | 'unanswered' | 'marked'
  getProgress: () => { answered: number; total: number; percentage: number }
  getMarkedQuestions: () => string[]
  getUnansweredQuestions: () => string[]
  getTimeString: () => string
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      // Initial state
      examData: null,
      studentData: null,
      sessionData: null,
      answers: {},
      currentQuestion: 1,
      questionStartTime: Date.now(),
      timeRemaining: 0,
      timerInterval: null,

      initializeExam: (examData, studentData, sessionData) => {
        set({
          examData,
          studentData,
          sessionData,
          currentQuestion: 1,
          answers: {},
          timeRemaining: sessionData.timeRemaining,
          questionStartTime: Date.now(),
        })
      },

      setAnswer: (questionId, answer) => {
        const state = get()
        const currentTime = Date.now()
        const timeSpent = Math.floor((currentTime - state.questionStartTime) / 1000)

        set({
          answers: {
            ...state.answers,
            [questionId]: {
              ...state.answers[questionId],
              answer,
              timeSpent: (state.answers[questionId]?.timeSpent || 0) + timeSpent,
            }
          },
          questionStartTime: currentTime,
        })
      },

      markForReview: (questionId, marked) => {
        const state = get()
        set({
          answers: {
            ...state.answers,
            [questionId]: {
              ...state.answers[questionId],
              isMarkedForReview: marked,
            }
          }
        })
      },

      navigateToQuestion: (questionNumber) => {
        const state = get()
        const currentTime = Date.now()
        const currentQuestionId = state.examData?.questions[state.currentQuestion - 1]?.id

        if (currentQuestionId) {
          const timeSpent = Math.floor((currentTime - state.questionStartTime) / 1000)
          set({
            currentQuestion: questionNumber,
            answers: {
              ...state.answers,
              [currentQuestionId]: {
                ...state.answers[currentQuestionId],
                timeSpent: (state.answers[currentQuestionId]?.timeSpent || 0) + timeSpent,
              }
            },
            questionStartTime: currentTime,
          })
        }
      },

      nextQuestion: () => {
        const state = get()
        if (state.currentQuestion < (state.examData?.questions.length || 0)) {
          get().navigateToQuestion(state.currentQuestion + 1)
        }
      },

      previousQuestion: () => {
        const state = get()
        if (state.currentQuestion > 1) {
          get().navigateToQuestion(state.currentQuestion - 1)
        }
      },

      startTimer: () => {
        const state = get()
        if (state.timerInterval) return

        const interval = setInterval(() => {
          const currentTime = get().timeRemaining
          if (currentTime <= 0) {
            get().pauseTimer()
            get().submitExam()
            return
          }
          set({ timeRemaining: currentTime - 1 })
        }, 1000)

        set({ timerInterval: interval })
      },

      pauseTimer: () => {
        const state = get()
        if (state.timerInterval) {
          clearInterval(state.timerInterval)
          set({ timerInterval: null })
        }
      },

      updateTimeRemaining: (time) => {
        set({ timeRemaining: time })
      },

      submitExam: () => {
        const state = get()
        get().pauseTimer()

        // Calculate final time spent on current question
        const currentTime = Date.now()
        const currentQuestionId = state.examData?.questions[state.currentQuestion - 1]?.id

        if (currentQuestionId) {
          const timeSpent = Math.floor((currentTime - state.questionStartTime) / 1000)
          set({
            answers: {
              ...state.answers,
              [currentQuestionId]: {
                ...state.answers[currentQuestionId],
                timeSpent: (state.answers[currentQuestionId]?.timeSpent || 0) + timeSpent,
              }
            }
          })
        }

        set({
          sessionData: state.sessionData ? {
            ...state.sessionData,
            status: 'submitted'
          } : null
        })
      },

      resetExam: () => {
        const state = get()
        if (state.timerInterval) {
          clearInterval(state.timerInterval)
        }
        set({
          examData: null,
          studentData: null,
          sessionData: null,
          answers: {},
          currentQuestion: 1,
          questionStartTime: Date.now(),
          timeRemaining: 0,
          timerInterval: null,
        })
      },

      // Computed values
      getQuestionStatus: (questionId) => {
        const state = get()
        const answer = state.answers[questionId]

        if (!answer || answer.answer === null || answer.answer === undefined || answer.answer === '') {
          return answer?.isMarkedForReview ? 'marked' : 'unanswered'
        }

        return answer?.isMarkedForReview ? 'marked' : 'answered'
      },

      getProgress: () => {
        const state = get()
        const total = state.examData?.questions.length || 0
        const answered = Object.values(state.answers).filter(
          answer => answer.answer !== null && answer.answer !== undefined && answer.answer !== ''
        ).length

        return {
          answered,
          total,
          percentage: total > 0 ? Math.round((answered / total) * 100) : 0
        }
      },

      getMarkedQuestions: () => {
        const state = get()
        return Object.entries(state.answers)
          .filter(([_, answer]) => answer.isMarkedForReview)
          .map(([questionId]) => questionId)
      },

      getUnansweredQuestions: () => {
        const state = get()
        return state.examData?.questions
          .filter(q => {
            const answer = state.answers[q.id]
            return !answer || answer.answer === null || answer.answer === undefined || answer.answer === ''
          })
          .map(q => q.id) || []
      },

      getTimeString: () => {
        const state = get()
        const time = state.timeRemaining
        const hours = Math.floor(time / 3600)
        const minutes = Math.floor((time % 3600) / 60)
        const seconds = time % 60

        if (hours > 0) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      },
    }),
    {
      name: 'exam-storage',
      partialize: (state) => ({
        examData: state.examData,
        studentData: state.studentData,
        sessionData: state.sessionData,
        answers: state.answers,
        currentQuestion: state.currentQuestion,
        timeRemaining: state.timeRemaining,
      }),
    }
  )
)
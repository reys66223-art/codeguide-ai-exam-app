/**
 * WebSocket Server for Real-time Exam Monitoring
 *
 * This module provides Socket.IO server functionality for real-time communication
 * between teachers and students during exams.
 */

import { Server as NetServer } from "http"
import { NextApiRequest, NextApiResponse } from "next"
import { Server as ServerIO } from "socket.io"

export const config = {
  api: {
    bodyParser: false,
  },
}

// Socket.IO server instance
let io: ServerIO | null = null

// Active exam sessions storage
const activeSessions = new Map<string, {
  examId: string
  teacherId: string
  students: Map<string, {
    socketId: string
    studentId: string
    name: string
    status: 'online' | 'offline' | 'working' | 'completed'
    currentQuestion: number
    timeRemaining: number
    lastActivity: Date
    startTime: Date
    answers: Record<string, any>
  }>
  createdAt: Date
}>()

// Student to session mapping
const studentToSession = new Map<string, string>()

// Teacher to sessions mapping
const teacherToSessions = new Map<string, Set<string>>()

/**
 * Gets or creates the Socket.IO server instance
 */
function getSocketIO(server?: NetServer) {
  if (!io && server) {
    io = new ServerIO(server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_APP_URL
          : ["http://localhost:3000"],
        methods: ["GET", "POST"]
      }
    })

    setupSocketHandlers()
  }

  return io
}

/**
 * Sets up Socket.IO event handlers
 */
function setupSocketHandlers() {
  if (!io) return

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    // Teacher joins an exam monitoring session
    socket.on("teacher-join-exam", (data) => {
      const { examId, teacherId } = data

      // Validate exam exists and teacher has access (in real app, check database)
      const sessionKey = `exam_${examId}`

      if (!activeSessions.has(sessionKey)) {
        activeSessions.set(sessionKey, {
          examId,
          teacherId,
          students: new Map(),
          createdAt: new Date()
        })
      }

      const session = activeSessions.get(sessionKey)!

      // Track teacher's sessions
      if (!teacherToSessions.has(teacherId)) {
        teacherToSessions.set(teacherId, new Set())
      }
      teacherToSessions.get(teacherId)!.add(sessionKey)

      // Join the exam room
      socket.join(sessionKey)
      socket.emit("teacher-joined", { examId, studentCount: session.students.size })

      // Send current student data to teacher
      const studentsData = Array.from(session.students.values())
      socket.emit("student-list-update", studentsData)
    })

    // Student joins an exam session
    socket.on("student-join-exam", (data) => {
      const { examId, studentId, name, sessionId } = data
      const sessionKey = `exam_${examId}`

      // Validate session exists (in real app, check database)
      if (!activeSessions.has(sessionKey)) {
        socket.emit("error", { message: "Exam session not found" })
        return
      }

      const session = activeSessions.get(sessionKey)!

      // Add student to session
      const studentData = {
        socketId: socket.id,
        studentId,
        name,
        status: 'online' as const,
        currentQuestion: 1,
        timeRemaining: 0, // Will be updated when exam starts
        lastActivity: new Date(),
        startTime: new Date(),
        answers: {}
      }

      session.students.set(studentId, studentData)
      studentToSession.set(studentId, sessionKey)

      // Join the exam room
      socket.join(sessionKey)

      // Notify teacher
      socket.to(sessionKey).emit("student-joined", studentData)

      // Confirm to student
      socket.emit("student-joined-exam", { examId, sessionId })

      // Broadcast updated student list
      const studentsData = Array.from(session.students.values())
      io.to(sessionKey).emit("student-list-update", studentsData)

      console.log(`Student ${name} (${studentId}) joined exam ${examId}`)
    })

    // Student starts exam
    socket.on("student-start-exam", (data) => {
      const { studentId, timeRemaining } = data
      const sessionKey = studentToSession.get(studentId)

      if (!sessionKey) return

      const session = activeSessions.get(sessionKey)!
      const student = session.students.get(studentId)

      if (student) {
        student.status = 'working'
        student.timeRemaining = timeRemaining
        student.lastActivity = new Date()

        // Notify teacher
        socket.to(sessionKey).emit("student-started-exam", {
          studentId,
          name: student.name,
          timeRemaining
        })

        // Broadcast updated student list
        const studentsData = Array.from(session.students.values())
        io.to(sessionKey).emit("student-list-update", studentsData)
      }
    })

    // Student answers a question
    socket.on("student-answer", (data) => {
      const { studentId, questionId, answer, isMarkedForReview, timeSpent } = data
      const sessionKey = studentToSession.get(studentId)

      if (!sessionKey) return

      const session = activeSessions.get(sessionKey)!
      const student = session.students.get(studentId)

      if (student) {
        student.answers[questionId] = { answer, isMarkedForReview, timeSpent }
        student.lastActivity = new Date()

        // Notify teacher of answer
        socket.to(sessionKey).emit("student-answered", {
          studentId,
          name: student.name,
          questionId,
          isMarkedForReview,
          timeSpent
        })
      }
    })

    // Student navigates to a question
    socket.on("student-navigate", (data) => {
      const { studentId, questionNumber } = data
      const sessionKey = studentToSession.get(studentId)

      if (!sessionKey) return

      const session = activeSessions.get(sessionKey)!
      const student = session.students.get(studentId)

      if (student) {
        student.currentQuestion = questionNumber
        student.lastActivity = new Date()

        // Notify teacher
        socket.to(sessionKey).emit("student-navigated", {
          studentId,
          name: student.name,
          questionNumber
        })
      }
    })

    // Student submits exam
    socket.on("student-submit-exam", (data) => {
      const { studentId, answers, finalScore } = data
      const sessionKey = studentToSession.get(studentId)

      if (!sessionKey) return

      const session = activeSessions.get(sessionKey)!
      const student = session.students.get(studentId)

      if (student) {
        student.status = 'completed'
        student.answers = answers
        student.lastActivity = new Date()

        // Notify teacher
        socket.to(sessionKey).emit("student-submitted", {
          studentId,
          name: student.name,
          answers,
          finalScore
        })

        // Broadcast updated student list
        const studentsData = Array.from(session.students.values())
        io.to(sessionKey).emit("student-list-update", studentsData)
      }
    })

    // Handle periodic timer updates
    socket.on("timer-update", (data) => {
      const { studentId, timeRemaining } = data
      const sessionKey = studentToSession.get(studentId)

      if (!sessionKey) return

      const session = activeSessions.get(sessionKey)!
      const student = session.students.get(studentId)

      if (student) {
        student.timeRemaining = timeRemaining
        student.lastActivity = new Date()

        // Notify teacher if time is running low
        if (timeRemaining <= 300) { // 5 minutes
          socket.to(sessionKey).emit("student-time-warning", {
            studentId,
            name: student.name,
            timeRemaining
          })
        }
      }
    })

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`)

      // Find which student this socket belonged to
      for (const [sessionKey, session] of activeSessions.entries()) {
        for (const [studentId, student] of session.students.entries()) {
          if (student.socketId === socket.id) {
            student.status = 'offline'
            student.lastActivity = new Date()

            // Notify teacher
            socket.to(sessionKey).emit("student-disconnected", {
              studentId,
              name: student.name
            })

            // Broadcast updated student list
            const studentsData = Array.from(session.students.values())
            io.to(sessionKey).emit("student-list-update", studentsData)

            return
          }
        }
      }
    })

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for ${socket.id}:`, error)
    })
  })
}

/**
 * API route handler for Socket.IO
 */
export default async function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse & { socket: any }
) {
  if (res.socket.server.io) {
    console.log("Socket.io server already running")
  } else {
    console.log("Setting up Socket.io server...")
    const httpServer: NetServer = res.socket.server as any
    getSocketIO(httpServer)
  }

  res.end()
}

/**
 * Utility functions for external access
 */
export function getActiveSession(examId: string) {
  return activeSessions.get(`exam_${examId}`)
}

export function getStudentSessions(teacherId: string) {
  const sessions = teacherToSessions.get(teacherId)
  if (!sessions) return []

  return Array.from(sessions).map(sessionKey =>
    activeSessions.get(sessionKey)
  ).filter(Boolean)
}

export function getSessionStats(examId: string) {
  const session = activeSessions.get(`exam_${examId}`)
  if (!session) return null

  const students = Array.from(session.students.values())

  return {
    totalStudents: students.length,
    onlineStudents: students.filter(s => s.status === 'online').length,
    workingStudents: students.filter(s => s.status === 'working').length,
    completedStudents: students.filter(s => s.status === 'completed').length,
    offlineStudents: students.filter(s => s.status === 'offline').length,
    averageTimeRemaining: students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.timeRemaining, 0) / students.length)
      : 0
  }
}
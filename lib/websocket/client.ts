/**
 * Client-side Socket.IO utilities for real-time communication
 */

import { io, Socket } from "socket.io-client"

export interface StudentData {
  socketId: string
  studentId: string
  name: string
  status: 'online' | 'offline' | 'working' | 'completed'
  currentQuestion: number
  timeRemaining: number
  lastActivity: Date
  startTime: Date
  answers: Record<string, any>
}

export interface MonitoringData {
  examId: string
  teacherId: string
  students: StudentData[]
  stats: {
    totalStudents: number
    onlineStudents: number
    workingStudents: number
    completedStudents: number
    offlineStudents: number
    averageTimeRemaining: number
  }
}

export interface SocketEvents {
  // Teacher events
  "teacher-joined": (data: { examId: string; studentCount: number }) => void
  "student-joined": (student: StudentData) => void
  "student-started-exam": (data: { studentId: string; name: string; timeRemaining: number }) => void
  "student-answered": (data: { studentId: string; name: string; questionId: string; isMarkedForReview: boolean; timeSpent: number }) => void
  "student-navigated": (data: { studentId: string; name: string; questionNumber: number }) => void
  "student-submitted": (data: { studentId: string; name: string; answers: Record<string, any>; finalScore?: number }) => void
  "student-disconnected": (data: { studentId: string; name: string }) => void
  "student-time-warning": (data: { studentId: string; name: string; timeRemaining: number }) => void
  "student-list-update": (students: StudentData[]) => void
  "error": (data: { message: string }) => void

  // Student events
  "student-joined-exam": (data: { examId: string; sessionId: string }) => void
  "timer-update": (data: { timeRemaining: number }) => void
}

class SocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  /**
   * Connect to the Socket.IO server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io({
          path: "/api/socket/io",
          addTrailingSlash: false,
          transports: ["websocket", "polling"],
        })

        this.socket.on("connect", () => {
          console.log("Connected to Socket.IO server")
          this.reconnectAttempts = 0
          resolve()
        })

        this.socket.on("disconnect", () => {
          console.log("Disconnected from Socket.IO server")
        })

        this.socket.on("connect_error", (error) => {
          console.error("Socket.IO connection error:", error)
          this.handleReconnect()
          reject(error)
        })

      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Handle automatic reconnection
   */
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)

      setTimeout(() => {
        this.connect().catch(console.error)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  /**
   * Disconnect from the server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  /**
   * Join an exam as a teacher for monitoring
   */
  joinTeacherExam(examId: string, teacherId: string) {
    if (!this.socket || !this.socket.connected) {
      throw new Error("Socket not connected")
    }

    this.socket.emit("teacher-join-exam", { examId, teacherId })
  }

  /**
   * Join an exam as a student
   */
  joinStudentExam(examId: string, studentId: string, name: string, sessionId: string) {
    if (!this.socket || !this.socket.connected) {
      throw new Error("Socket not connected")
    }

    this.socket.emit("student-join-exam", { examId, studentId, name, sessionId })
  }

  /**
   * Start exam as student
   */
  startStudentExam(timeRemaining: number) {
    if (!this.socket || !this.socket.connected) {
      throw new Error("Socket not connected")
    }

    this.socket.emit("student-start-exam", { timeRemaining })
  }

  /**
   * Submit an answer as student
   */
  submitAnswer(questionId: string, answer: any, isMarkedForReview: boolean, timeSpent: number) {
    if (!this.socket || !this.socket.connected) {
      throw new Error("Socket not connected")
    }

    this.socket.emit("student-answer", {
      questionId,
      answer,
      isMarkedForReview,
      timeSpent
    })
  }

  /**
   * Navigate to a question as student
   */
  navigateToQuestion(questionNumber: number) {
    if (!this.socket || !this.socket.connected) {
      throw new Error("Socket not connected")
    }

    this.socket.emit("student-navigate", { questionNumber })
  }

  /**
   * Submit exam as student
   */
  submitExam(answers: Record<string, any>, finalScore?: number) {
    if (!this.socket || !this.socket.connected) {
      throw new Error("Socket not connected")
    }

    this.socket.emit("student-submit-exam", { answers, finalScore })
  }

  /**
   * Update timer
   */
  updateTimer(timeRemaining: number) {
    if (!this.socket || !this.socket.connected) {
      return
    }

    this.socket.emit("timer-update", { timeRemaining })
  }

  /**
   * Listen for events
   */
  on<K extends keyof SocketEvents>(event: K, listener: SocketEvents[K]) {
    if (!this.socket) {
      throw new Error("Socket not initialized")
    }

    this.socket.on(event, listener)
  }

  /**
   * Stop listening for events
   */
  off<K extends keyof SocketEvents>(event: K, listener: SocketEvents[K]) {
    if (!this.socket) {
      return
    }

    this.socket.off(event, listener)
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners<K extends keyof SocketEvents>(event: K) {
    if (!this.socket) {
      return
    }

    this.socket.removeAllListeners(event)
  }
}

// Singleton instance
export const socketService = new SocketService()

/**
 * React hook for using Socket.IO
 */
export function useSocket() {
  const connect = () => socketService.connect()
  const disconnect = () => socketService.disconnect()
  const isConnected = () => socketService.isConnected()

  return {
    connect,
    disconnect,
    isConnected,
    joinTeacherExam: socketService.joinTeacherExam.bind(socketService),
    joinStudentExam: socketService.joinStudentExam.bind(socketService),
    startStudentExam: socketService.startStudentExam.bind(socketService),
    submitAnswer: socketService.submitAnswer.bind(socketService),
    navigateToQuestion: socketService.navigateToQuestion.bind(socketService),
    submitExam: socketService.submitExam.bind(socketService),
    updateTimer: socketService.updateTimer.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
    removeAllListeners: socketService.removeAllListeners.bind(socketService),
  }
}
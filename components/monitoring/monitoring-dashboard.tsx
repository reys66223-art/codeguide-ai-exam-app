"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSocket } from "@/lib/websocket/client"
import {
  StudentData,
  MonitoringData
} from "@/lib/websocket/client"
import {
  IconUsers,
  IconClock,
  IconActivity,
  IconCheck,
  IconAlertTriangle,
  IconWifi,
  IconWifiOff,
  IconEye,
  IconRefresh,
  IconDownload,
  IconBell,
  IconBellOff
} from "@tabler/icons-react"
import { toast } from "sonner"

interface MonitoringDashboardProps {
  examId: string
}

export function MonitoringDashboard({ examId }: MonitoringDashboardProps) {
  const [students, setStudents] = useState<StudentData[]>([])
  const [examData, setExamData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")

  const socket = useSocket()

  // Initialize socket connection and join exam monitoring
  useEffect(() => {
    const initializeMonitoring = async () => {
      try {
        await socket.connect()
        setIsConnected(true)

        // Mock teacher data (in real app, get from auth)
        const teacherId = "teacher-001"

        // Join the exam monitoring room
        socket.joinTeacherExam(examId, teacherId)

        // Mock exam data (in real app, fetch from database)
        setExamData({
          id: examId,
          title: "Mathematics Final Exam",
          duration: 90,
          totalQuestions: 20,
          startTime: new Date().toISOString(),
          status: "active"
        })

        toast.success("Connected to exam monitoring")
      } catch (error) {
        console.error("Failed to connect to monitoring:", error)
        toast.error("Failed to connect to exam monitoring")
      }
    }

    initializeMonitoring()

    return () => {
      socket.disconnect()
    }
  }, [examId, socket])

  // Set up socket event listeners
  useEffect(() => {
    if (!isConnected) return

    const handleStudentJoined = (student: StudentData) => {
      setStudents(prev => [...prev.filter(s => s.studentId !== student.studentId), student])
      if (notifications) {
        toast(`${student.name} joined the exam`, {
          description: "Student is now online",
          icon: <IconUsers className="h-4 w-4" />
        })
      }
    }

    const handleStudentStarted = (data: { studentId: string; name: string; timeRemaining: number }) => {
      setStudents(prev => prev.map(s =>
        s.studentId === data.studentId
          ? { ...s, status: 'working', timeRemaining: data.timeRemaining }
          : s
      ))
      if (notifications) {
        toast(`${data.name} started the exam`, {
          description: "Exam is in progress",
          icon: <IconActivity className="h-4 w-4" />
        })
      }
    }

    const handleStudentSubmitted = (data: { studentId: string; name: string; answers: Record<string, any>; finalScore?: number }) => {
      setStudents(prev => prev.map(s =>
        s.studentId === data.studentId
          ? { ...s, status: 'completed', lastActivity: new Date() }
          : s
      ))
      if (notifications) {
        toast(`${data.name} submitted the exam`, {
          description: data.finalScore ? `Score: ${data.finalScore}` : "Grading in progress",
          icon: <IconCheck className="h-4 w-4" />
        })
      }
    }

    const handleStudentDisconnected = (data: { studentId: string; name: string }) => {
      setStudents(prev => prev.map(s =>
        s.studentId === data.studentId
          ? { ...s, status: 'offline', lastActivity: new Date() }
          : s
      ))
      if (notifications) {
        toast(`${data.name} disconnected`, {
          description: "Student went offline",
          icon: <IconWifiOff className="h-4 w-4" />
        })
      }
    }

    const handleStudentListUpdate = (studentList: StudentData[]) => {
      setStudents(studentList)
    }

    const handleTimeWarning = (data: { studentId: string; name: string; timeRemaining: number }) => {
      if (notifications) {
        toast.warning(`${data.name} has ${Math.floor(data.timeRemaining / 60)} minutes remaining`, {
          description: "Time is running low",
          icon: <IconAlertTriangle className="h-4 w-4" />
        })
      }
    }

    // Register event listeners
    socket.on("student-joined", handleStudentJoined)
    socket.on("student-started-exam", handleStudentStarted)
    socket.on("student-submitted", handleStudentSubmitted)
    socket.on("student-disconnected", handleStudentDisconnected)
    socket.on("student-list-update", handleStudentListUpdate)
    socket.on("student-time-warning", handleTimeWarning)

    // Cleanup
    return () => {
      socket.off("student-joined", handleStudentJoined)
      socket.off("student-started-exam", handleStudentStarted)
      socket.off("student-submitted", handleStudentSubmitted)
      socket.off("student-disconnected", handleStudentDisconnected)
      socket.off("student-list-update", handleStudentListUpdate)
      socket.off("student-time-warning", handleTimeWarning)
    }
  }, [socket, isConnected, notifications])

  // Calculate statistics
  const stats = {
    total: students.length,
    online: students.filter(s => s.status === 'online').length,
    working: students.filter(s => s.status === 'working').length,
    completed: students.filter(s => s.status === 'completed').length,
    offline: students.filter(s => s.status === 'offline').length,
    averageTimeRemaining: students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.timeRemaining, 0) / students.length)
      : 0
  }

  // Filter students based on selected filter
  const filteredStudents = students.filter(student => {
    switch (selectedFilter) {
      case "online":
        return student.status === 'online' || student.status === 'working'
      case "working":
        return student.status === 'working'
      case "completed":
        return student.status === 'completed'
      case "offline":
        return student.status === 'offline'
      default:
        return true
    }
  })

  const getStatusColor = (status: StudentData['status']) => {
    switch (status) {
      case 'online':
        return "bg-green-100 text-green-800 border-green-300"
      case 'working':
        return "bg-blue-100 text-blue-800 border-blue-300"
      case 'completed':
        return "bg-purple-100 text-purple-800 border-purple-300"
      case 'offline':
        return "bg-gray-100 text-gray-800 border-gray-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: StudentData['status']) => {
    switch (status) {
      case 'online':
        return <IconWifi className="h-4 w-4" />
      case 'working':
        return <IconActivity className="h-4 w-4" />
      case 'completed':
        return <IconCheck className="h-4 w-4" />
      case 'offline':
        return <IconWifiOff className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNotifications(!notifications)}
          >
            {notifications ? <IconBell className="h-4 w-4" /> : <IconBellOff className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <IconRefresh className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Exam Info */}
      {examData && (
        <Card>
          <CardHeader>
            <CardTitle>{examData.title}</CardTitle>
            <CardDescription>
              Live monitoring of student progress and activity
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Registered students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <IconWifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.online}</div>
            <p className="text-xs text-muted-foreground">
              Currently connected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working</CardTitle>
            <IconActivity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.working}</div>
            <p className="text-xs text-muted-foreground">
              Taking exam now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <IconCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Submitted exams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.averageTimeRemaining)}</div>
            <p className="text-xs text-muted-foreground">
              Remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Activity</CardTitle>
              <CardDescription>
                Real-time monitoring of all student participants
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="working">Working</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <IconDownload className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Question</TableHead>
                <TableHead>Time Remaining</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {student.studentId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(student.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(student.status)}
                        <span className="capitalize">{student.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.currentQuestion} / {examData?.totalQuestions || 20}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono">
                      {formatTime(student.timeRemaining)}
                    </div>
                    {student.timeRemaining < 300 && (
                      <Badge variant="outline" className="text-orange-600 mt-1">
                        <IconAlertTriangle className="h-3 w-3 mr-1" />
                        Low
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(student.lastActivity).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <IconEye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <IconUsers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No students found</h3>
              <p className="text-muted-foreground">
                {selectedFilter === "all"
                  ? "No students have joined this exam yet."
                  : `No ${selectedFilter} students found.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
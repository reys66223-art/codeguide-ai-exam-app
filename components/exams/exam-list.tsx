"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconDots,
  IconEdit,
  IconEye,
  IconTrash,
  IconCopy,
  IconChartBar,
  IconSearch,
  IconFilter,
  IconFileDescription,
  IconUsers,
  IconClock,
  IconCalendar
} from "@tabler/icons-react"
import Link from "next/link"

interface Exam {
  id: string
  title: string
  description?: string
  status: "draft" | "active" | "ended"
  examCode: string
  participants: number
  completed: number
  duration: number
  displayMode: "one_by_one" | "all_at_once"
  createdAt: string
  startTime?: string
  endTime?: string
  questions: number
  maxScore: number
}

const mockExams: Exam[] = [
  {
    id: "1",
    title: "Mathematics Final Exam",
    description: "Comprehensive math exam covering algebra, geometry, and statistics",
    status: "active",
    examCode: "MATH2024",
    participants: 45,
    completed: 38,
    duration: 90,
    displayMode: "one_by_one",
    createdAt: "2024-01-15",
    startTime: "2024-01-16T09:00:00Z",
    endTime: "2024-01-23T17:00:00Z",
    questions: 20,
    maxScore: 100
  },
  {
    id: "2",
    title: "Science Midterm Exam",
    description: "Biology and chemistry concepts covered this semester",
    status: "active",
    examCode: "SCI2024",
    participants: 52,
    completed: 41,
    duration: 60,
    displayMode: "all_at_once",
    createdAt: "2024-01-14",
    startTime: "2024-01-15T10:00:00Z",
    endTime: "2024-01-22T16:00:00Z",
    questions: 15,
    maxScore: 75
  },
  {
    id: "3",
    title: "History Quiz - Chapter 5",
    description: "World War II and its global impact",
    status: "draft",
    examCode: "HIST5QZ",
    participants: 0,
    completed: 0,
    duration: 30,
    displayMode: "all_at_once",
    createdAt: "2024-01-16",
    questions: 10,
    maxScore: 50
  },
  {
    id: "4",
    title: "English Literature Test",
    description: "Analysis of Shakespeare and modern poetry",
    status: "ended",
    examCode: "ENG2024",
    participants: 38,
    completed: 38,
    duration: 75,
    displayMode: "one_by_one",
    createdAt: "2024-01-10",
    startTime: "2024-01-11T13:00:00Z",
    endTime: "2024-01-15T15:00:00Z",
    questions: 18,
    maxScore: 90
  },
  {
    id: "5",
    title: "Chemistry Lab Assessment",
    description: "Practical chemistry laboratory safety and procedures",
    status: "active",
    examCode: "CHEMLAB",
    participants: 28,
    completed: 15,
    duration: 45,
    displayMode: "one_by_one",
    createdAt: "2024-01-13",
    startTime: "2024-01-14T14:00:00Z",
    endTime: "2024-01-20T16:00:00Z",
    questions: 12,
    maxScore: 60
  }
]

export function ExamList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("grid")

  const filteredExams = mockExams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.examCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || exam.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Exam["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "ended":
        return "outline"
      default:
        return "outline"
    }
  }

  const getCompletionRate = (completed: number, participants: number) => {
    if (participants === 0) return 0
    return Math.round((completed / participants) * 100)
  }

  const copyExamCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Exams Overview</CardTitle>
          <CardDescription>
            Manage and monitor all your examinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => {
              const completionRate = getCompletionRate(exam.completed, exam.participants)

              return (
                <Card key={exam.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{exam.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusColor(exam.status)}>
                            {exam.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exam.examCode}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {exam.status === "draft" && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/exams/${exam.id}/edit`}>
                                  <IconEdit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/exams/${exam.id}/questions`}>
                                  <IconFileDescription className="h-4 w-4 mr-2" />
                                  Manage Questions
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}
                          {exam.status === "active" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/monitoring/${exam.id}`}>
                                <IconEye className="h-4 w-4 mr-2" />
                                Monitor
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {exam.status === "ended" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/results/${exam.id}`}>
                                <IconChartBar className="h-4 w-4 mr-2" />
                                View Results
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => copyExamCode(exam.examCode)}>
                            <IconCopy className="h-4 w-4 mr-2" />
                            Copy Code
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <IconTrash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {exam.description && (
                      <CardDescription className="text-sm line-clamp-2">
                        {exam.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <IconUsers className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.participants} students</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <IconClock className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <IconFileDescription className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.questions} questions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.maxScore} points</span>
                      </div>
                    </div>

                    {/* Progress for active exams */}
                    {exam.status === "active" && exam.participants > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{completionRate}%</span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {exam.completed} of {exam.participants} completed
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {exam.status === "draft" && (
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/dashboard/exams/${exam.id}/edit`}>
                            Continue Setup
                          </Link>
                        </Button>
                      )}
                      {exam.status === "active" && (
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/dashboard/monitoring/${exam.id}`}>
                            Monitor
                          </Link>
                        </Button>
                      )}
                      {exam.status === "ended" && (
                        <Button size="sm" className="flex-1" variant="outline" asChild>
                          <Link href={`/dashboard/results/${exam.id}`}>
                            View Results
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Title</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{exam.title}</div>
                        {exam.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {exam.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{exam.examCode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(exam.status)}>
                        {exam.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {exam.completed}/{exam.participants}
                        {exam.status === "active" && (
                          <div className="text-xs text-muted-foreground">
                            {getCompletionRate(exam.completed, exam.participants)}%
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>{exam.questions}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(exam.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {exam.status === "draft" && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/exams/${exam.id}/edit`}>
                                  <IconEdit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/exams/${exam.id}/questions`}>
                                  <IconFileDescription className="h-4 w-4 mr-2" />
                                  Questions
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}
                          {exam.status === "active" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/monitoring/${exam.id}`}>
                                <IconEye className="h-4 w-4 mr-2" />
                                Monitor
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {exam.status === "ended" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/results/${exam.id}`}>
                                <IconChartBar className="h-4 w-4 mr-2" />
                                Results
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <IconTrash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  IconFileDescription,
  IconUsers,
  IconClock,
  IconEdit,
  IconEye,
  IconChartBar
} from "@tabler/icons-react"

interface Exam {
  id: string
  title: string
  status: "draft" | "active" | "ended"
  participants: number
  completed: number
  duration: number
  createdAt: string
  lastActivity?: string
}

const recentExams: Exam[] = [
  {
    id: "1",
    title: "Mathematics Final Exam",
    status: "active",
    participants: 45,
    completed: 38,
    duration: 90,
    createdAt: "2024-01-15",
    lastActivity: "2 hours ago"
  },
  {
    id: "2",
    title: "Science Midterm Exam",
    status: "active",
    participants: 52,
    completed: 41,
    duration: 60,
    createdAt: "2024-01-14",
    lastActivity: "30 minutes ago"
  },
  {
    id: "3",
    title: "History Quiz - Chapter 5",
    status: "draft",
    participants: 0,
    completed: 0,
    duration: 30,
    createdAt: "2024-01-16",
    lastActivity: "Just now"
  },
  {
    id: "4",
    title: "English Literature Test",
    status: "ended",
    participants: 38,
    completed: 38,
    duration: 75,
    createdAt: "2024-01-10",
    lastActivity: "3 days ago"
  },
  {
    id: "5",
    title: "Chemistry Lab Assessment",
    status: "active",
    participants: 28,
    completed: 15,
    duration: 45,
    createdAt: "2024-01-13",
    lastActivity: "1 hour ago"
  }
]

export function RecentExams() {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Exams</CardTitle>
          <CardDescription>
            Your most recent exam activities and their status
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/exams">
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExams.map((exam) => {
            const completionRate = getCompletionRate(exam.completed, exam.participants)

            return (
              <div key={exam.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium">{exam.title}</h4>
                      <Badge variant={getStatusColor(exam.status)}>
                        {exam.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <IconUsers className="h-3 w-3" />
                        <span>{exam.participants} participants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IconClock className="h-3 w-3" />
                        <span>{exam.duration} minutes</span>
                      </div>
                      {exam.lastActivity && (
                        <span>Last activity: {exam.lastActivity}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {exam.status === "draft" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/exams/${exam.id}/edit`}>
                          <IconEdit className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {exam.status === "active" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/monitoring/${exam.id}`}>
                          <IconEye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {exam.status === "ended" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/results/${exam.id}`}>
                          <IconChartBar className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {exam.participants > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{exam.completed}/{exam.participants} ({completionRate}%)</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                )}

                {exam.status === "draft" && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/exams/${exam.id}/edit`}>
                        <IconEdit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/exams/${exam.id}/questions`}>
                        <IconFileDescription className="h-4 w-4 mr-1" />
                        Add Questions
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  IconFileDescription,
  IconUsers,
  IconChartBar,
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown
} from "@tabler/icons-react"

export function ExamStats() {
  const stats = [
    {
      title: "Total Exams",
      value: "12",
      change: "+2",
      changeType: "increase",
      description: "Active and completed",
      icon: IconFileDescription,
      color: "text-blue-600"
    },
    {
      title: "Registered Students",
      value: "248",
      change: "+12",
      changeType: "increase",
      description: "Total participants",
      icon: IconUsers,
      color: "text-green-600"
    },
    {
      title: "Completion Rate",
      value: "85%",
      change: "+5%",
      changeType: "increase",
      description: "This month",
      icon: IconChartBar,
      color: "text-purple-600"
    },
    {
      title: "Pending Reviews",
      value: "8",
      change: "-3",
      changeType: "decrease",
      description: "Essay submissions",
      icon: IconClock,
      color: "text-orange-600"
    }
  ]

  const recentExams = [
    {
      name: "Mathematics Final Exam",
      status: "active",
      participants: 45,
      completed: 38,
      completionRate: 84
    },
    {
      name: "Science Midterm Exam",
      status: "active",
      participants: 52,
      completed: 41,
      completionRate: 79
    },
    {
      name: "History Quiz - Chapter 5",
      status: "draft",
      participants: 0,
      completed: 0,
      completionRate: 0
    },
    {
      name: "English Literature Test",
      status: "ended",
      participants: 38,
      completed: 38,
      completionRate: 100
    }
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{stat.description}</span>
              <div className="flex items-center">
                {stat.changeType === "increase" ? (
                  <IconTrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <IconTrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={stat.changeType === "increase" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Exam Completion Overview */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Exams Overview
            <Badge variant="outline">
              {recentExams.filter(exam => exam.status === "active").length} Active
            </Badge>
          </CardTitle>
          <CardDescription>
            Progress and completion status of your recent exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExams.map((exam, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium">{exam.name}</h4>
                      <Badge
                        variant={
                          exam.status === "active" ? "default" :
                          exam.status === "draft" ? "secondary" : "outline"
                        }
                      >
                        {exam.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {exam.participants > 0 ? (
                        <>
                          {exam.completed} of {exam.participants} students completed
                        </>
                      ) : (
                        "No participants yet"
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {exam.completionRate}%
                    </div>
                    <div className="flex items-center justify-end space-x-1">
                      {exam.status === "active" && exam.completionRate < 80 && (
                        <IconAlertTriangle className="h-3 w-3 text-orange-600" />
                      )}
                      {exam.status === "active" && exam.completionRate >= 80 && (
                        <IconCheck className="h-3 w-3 text-green-600" />
                      )}
                      {exam.status === "ended" && exam.completionRate === 100 && (
                        <IconCheck className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
                {exam.participants > 0 && (
                  <Progress
                    value={exam.completionRate}
                    className="h-2"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
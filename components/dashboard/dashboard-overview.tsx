"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import {
  ChartAreaInteractive
} from "@/components/chart-area-interactive"
import Link from "next/link"
import {
  IconPlus,
  IconUsers,
  IconChartBar,
  IconFileDescription
} from "@tabler/icons-react"

export function DashboardOverview() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Welcome back, {session?.user?.name || "Teacher"}!
            <Badge variant="outline" className="text-sm">
              Teacher Account
            </Badge>
          </CardTitle>
          <CardDescription>
            Here's an overview of your exam management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconFileDescription className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Exams</span>
              </div>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconUsers className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Active Students</span>
              </div>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">
                +12 from last week
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconChartBar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Completed Exams</span>
              </div>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                85% completion rate
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconPlus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Pending Reviews</span>
              </div>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Essays to grade
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Activity Overview</CardTitle>
          <CardDescription>
            Student participation and exam completion trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartAreaInteractive />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest exam submissions and student activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                type: "submission",
                student: "Alice Johnson",
                exam: "Mathematics Final Exam",
                time: "2 minutes ago",
                score: "85/100"
              },
              {
                id: 2,
                type: "started",
                student: "Bob Smith",
                exam: "Science Midterm Exam",
                time: "5 minutes ago",
                score: "In Progress"
              },
              {
                id: 3,
                type: "submission",
                student: "Carol Williams",
                exam: "Mathematics Final Exam",
                time: "12 minutes ago",
                score: "92/100"
              },
              {
                id: 4,
                type: "created",
                student: null,
                exam: "History Quiz - Chapter 5",
                time: "1 hour ago",
                score: "Draft"
              }
            ].map((activity) => (
              <div key={activity.id} className="flex items-center justify-between space-y-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.type === "submission" && (
                      <>
                        <span className="font-semibold">{activity.student}</span> submitted{" "}
                        <span className="text-muted-foreground">{activity.exam}</span>
                      </>
                    )}
                    {activity.type === "started" && (
                      <>
                        <span className="font-semibold">{activity.student}</span> started{" "}
                        <span className="text-muted-foreground">{activity.exam}</span>
                      </>
                    )}
                    {activity.type === "created" && (
                      <>
                        Created{" "}
                        <span className="font-semibold">{activity.exam}</span>
                      </>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={activity.type === "submission" ? "default" :
                            activity.type === "started" ? "secondary" : "outline"}
                  >
                    {activity.score}
                  </Badge>
                  {activity.type === "submission" && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/results?exam=${activity.exam}`}>
                        Review
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
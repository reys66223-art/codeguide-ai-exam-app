"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  IconPlus,
  IconUsers,
  IconChartBar,
  IconFileText,
  IconSettings
} from "@tabler/icons-react"

export function QuickActions() {
  const actions = [
    {
      title: "Create New Exam",
      description: "Start creating a new exam with questions and settings",
      icon: IconPlus,
      href: "/dashboard/exams/create",
      variant: "default" as const,
      primary: true
    },
    {
      title: "Register Students",
      description: "Add new students to your exam system",
      icon: IconUsers,
      href: "/dashboard/students",
      variant: "outline" as const,
      primary: false
    },
    {
      title: "View Results",
      description: "Analyze exam results and student performance",
      icon: IconChartBar,
      href: "/dashboard/results",
      variant: "outline" as const,
      primary: false
    },
    {
      title: "Manage Exams",
      description: "Edit or manage existing exams and questions",
      icon: IconFileText,
      href: "/dashboard/exams",
      variant: "outline" as const,
      primary: false
    },
    {
      title: "Settings",
      description: "Configure system settings and preferences",
      icon: IconSettings,
      href: "/dashboard/settings",
      variant: "outline" as const,
      primary: false
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks you can perform right now
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className={`h-auto p-4 flex flex-col items-start space-y-2 ${
                action.primary ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              asChild
            >
              <Link href={action.href}>
                <div className="flex items-center space-x-3 w-full">
                  <action.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-70">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  EssayGradingResultComponent
} from "@/components/grading/essay-grading-result"
import {
  IconChartBar,
  IconDownload,
  IconEye,
  IconBrain,
  IconTrendingUp,
  IconAward,
  IconUsers,
  IconClock,
  Target,
  CheckCircle
} from "@tabler/icons-react"

// Mock data for demonstration
const mockExams = [
  { id: "1", title: "Mathematics Final Exam", status: "completed", submissionCount: 45 },
  { id: "2", title: "Science Midterm Exam", status: "completed", submissionCount: 52 },
  { id: "3", title: "History Quiz - Chapter 5", status: "active", submissionCount: 12 },
]

const mockResults = [
  {
    id: "1",
    examId: "1",
    examTitle: "Mathematics Final Exam",
    studentName: "Alice Johnson",
    studentId: "20230001",
    multipleChoiceScore: 45,
    essayScore: 38,
    totalScore: 83,
    maxScore: 100,
    submittedAt: "2024-01-16T10:30:00Z",
    gradedAt: "2024-01-16T10:45:00Z",
    aiFeedback: {
      score: 38,
      maxScore: 50,
      percentage: 76,
      grade: { category: "Appropriate", description: "Most key points covered with good explanations" },
      feedback: "Good understanding of mathematical concepts with clear explanations. Could improve on showing more detailed steps in problem-solving.",
      keyPointsCovered: ["Pythagorean theorem", "Algebraic manipulation", "Geometric formulas"],
      missingPoints: ["Detailed step-by-step solutions"],
      strengths: ["Clear explanations", "Correct formulas"],
      improvements: ["Show more work", "Include verification steps"],
      confidence: 0.85
    }
  },
  {
    id: "2",
    examId: "1",
    examTitle: "Mathematics Final Exam",
    studentName: "Bob Smith",
    studentId: "20230002",
    multipleChoiceScore: 40,
    essayScore: 42,
    totalScore: 82,
    maxScore: 100,
    submittedAt: "2024-01-16T10:25:00Z",
    gradedAt: "2024-01-16T10:40:00Z",
    aiFeedback: {
      score: 42,
      maxScore: 50,
      percentage: 84,
      grade: { category: "Appropriate", description: "Most key points covered with good explanations" },
      feedback: "Excellent problem-solving skills demonstrated. Shows good understanding of all major concepts.",
      keyPointsCovered: ["All key mathematical concepts", "Proper methodology"],
      missingPoints: [],
      strengths: ["Comprehensive answers", "Clear methodology"],
      improvements: ["Minor formatting improvements"],
      confidence: 0.92
    }
  },
  // Add more mock results...
]

export function ResultsDashboard() {
  const [selectedExam, setSelectedExam] = useState("all")
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const filteredResults = selectedExam === "all"
    ? mockResults
    : mockResults.filter(result => result.examId === selectedExam)

  // Calculate statistics
  const stats = {
    totalSubmissions: filteredResults.length,
    averageScore: filteredResults.length > 0
      ? Math.round(filteredResults.reduce((sum, r) => sum + r.totalScore, 0) / filteredResults.length)
      : 0,
    highestScore: filteredResults.length > 0
      ? Math.max(...filteredResults.map(r => r.totalScore))
      : 0,
    lowestScore: filteredResults.length > 0
      ? Math.min(...filteredResults.map(r => r.totalScore))
      : 0,
    averageEssayScore: filteredResults.length > 0
      ? Math.round(filteredResults.reduce((sum, r) => sum + (r.aiFeedback?.score || 0), 0) / filteredResults.length)
      : 0,
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getGradeBadge = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (percentage >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (percentage >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    if (percentage >= 60) return <Badge className="bg-orange-100 text-orange-800">Below Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Exam Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconChartBar className="h-5 w-5 mr-2" />
            Results Overview
          </CardTitle>
          <CardDescription>
            Select an exam to view detailed results and AI feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select an exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {mockExams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title} ({exam.submissionCount} submissions)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <IconDownload className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
          <TabsTrigger value="ai-feedback">AI Feedback Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <IconUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  Graded submissions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore, 100)}`}>
                  {stats.averageScore}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                <IconAward className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.highestScore}%</div>
                <p className="text-xs text-muted-foreground">
                  Top performer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Essay Average</CardTitle>
                <IconBrain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageEssayScore}%</div>
                <p className="text-xs text-muted-foreground">
                  AI-graded essays
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
                <IconTrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.lowestScore}%</div>
                <p className="text-xs text-muted-foreground">
                  Needs improvement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Score Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>
                Distribution of student scores across all submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { range: "90-100%", count: 12, color: "bg-green-500" },
                  { range: "80-89%", count: 18, color: "bg-blue-500" },
                  { range: "70-79%", count: 15, color: "bg-yellow-500" },
                  { range: "60-69%", count: 8, color: "bg-orange-500" },
                  { range: "0-59%", count: 2, color: "bg-red-500" },
                ].map((bin) => (
                  <div key={bin.range} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{bin.range}</span>
                      <span>{bin.count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${bin.color} h-2 rounded-full`}
                        style={{ width: `${(bin.count / stats.totalSubmissions) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Results</CardTitle>
              <CardDescription>
                Detailed breakdown of individual student performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Multiple Choice</TableHead>
                    <TableHead>Essay</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{result.studentName}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.studentId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{result.examTitle}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {result.multipleChoiceScore}/50
                        </div>
                        <Progress value={(result.multipleChoiceScore / 50) * 100} className="h-1 mt-1" />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {result.aiFeedback?.score || 0}/50
                        </div>
                        <Progress value={(result.aiFeedback?.score || 0)} className="h-1 mt-1" />
                      </TableCell>
                      <TableCell>
                        <div className={`text-lg font-bold ${getScoreColor(result.totalScore, 100)}`}>
                          {result.totalScore}%
                        </div>
                      </TableCell>
                      <TableCell>
                        {getGradeBadge(result.totalScore, 100)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(result.submittedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedResult(result)}
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {result.studentName} - {result.examTitle}
                              </DialogTitle>
                              <DialogDescription>
                                Detailed results and AI feedback analysis
                              </DialogDescription>
                            </DialogHeader>
                            {selectedResult?.aiFeedback && (
                              <EssayGradingResultComponent
                                result={selectedResult.aiFeedback}
                                showDetailed={true}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconBrain className="h-5 w-5 mr-2" />
                AI Feedback Analysis
              </CardTitle>
              <CardDescription>
                Insights from AI-powered essay grading and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Grade Distribution</h3>
                  <div className="space-y-2">
                    {[
                      { category: "Very Appropriate", count: 8, color: "bg-green-500" },
                      { category: "Appropriate", count: 15, color: "bg-blue-500" },
                      { category: "Moderately Appropriate", count: 12, color: "bg-yellow-500" },
                      { category: "Somewhat Appropriate", count: 6, color: "bg-orange-500" },
                      { category: "Inappropriate", count: 2, color: "bg-red-500" },
                    ].map((grade) => (
                      <div key={grade.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{grade.category}</span>
                          <span>{grade.count} essays</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${grade.color} h-2 rounded-full`}
                            style={{ width: `${(grade.count / filteredResults.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Common Feedback</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Top Strengths</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Clear explanations and structure</li>
                        <li>• Good use of examples</li>
                        <li>• Comprehensive coverage of topics</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">Common Improvements</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Need more detailed examples</li>
                        <li>• Include more specific evidence</li>
                        <li>• Improve conclusion quality</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4">AI Performance Metrics</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-muted-foreground">Average Confidence</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">2.3s</div>
                      <div className="text-sm text-muted-foreground">Average Grading Time</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-muted-foreground">Student Satisfaction</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
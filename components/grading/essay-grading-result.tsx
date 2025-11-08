"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  EssayGradingResult
} from "@/lib/ai-grading"
import {
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconBrain,
  IconAward,
  IconTarget,
  IconTrendingUp
} from "@tabler/icons-react"

interface EssayGradingResultProps {
  result: EssayGradingResult
  showDetailed?: boolean
  compact?: boolean
}

export function EssayGradingResultComponent({
  result,
  showDetailed = true,
  compact = false
}: EssayGradingResultProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getGradeColor = (category: string) => {
    switch (category) {
      case "Very Appropriate":
        return "bg-green-100 text-green-800 border-green-300"
      case "Appropriate":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Moderately Appropriate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Somewhat Appropriate":
        return "bg-orange-100 text-orange-800 border-orange-300"
      default:
        return "bg-red-100 text-red-800 border-red-300"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
              {result.score}
            </div>
            <div className="text-xs text-muted-foreground">/ {result.maxScore}</div>
          </div>
          <div>
            <Badge className={getGradeColor(result.grade.category)}>
              {result.grade.category}
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">
              {result.percentage}% match
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <IconBrain className="h-3 w-3" />
            <span className={getConfidenceColor(result.confidence)}>
              {Math.round(result.confidence * 100)}% confidence
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Score Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <IconBrain className="h-5 w-5" />
                <span>AI Essay Evaluation</span>
              </CardTitle>
              <CardDescription>
                Automated grading and feedback powered by Gemini AI
              </CardDescription>
            </div>
            <Badge className={getGradeColor(result.grade.category)}>
              {result.grade.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Score Display */}
            <div className="text-center space-y-4">
              <div>
                <div className={`text-4xl font-bold ${getScoreColor(result.percentage)}`}>
                  {result.score}
                </div>
                <div className="text-muted-foreground">/ {result.maxScore} points</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span>{result.percentage}%</span>
                </div>
                <Progress value={result.percentage} className="h-2" />
              </div>
              <div className="text-sm text-muted-foreground">
                {result.grade.description}
              </div>
            </div>

            {/* Rubric Scores */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <IconTarget className="h-4 w-4 mr-2" />
                Rubric Scores
              </h4>
              <div className="space-y-3">
                {Object.entries(result.rubricScores).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      <span>{value}/{result.maxScore}</span>
                    </div>
                    <Progress value={(value / result.maxScore) * 100} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Confidence */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <IconBrain className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">AI Confidence</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                {Math.round(result.confidence * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {result.confidence >= 0.8 ? "High" :
                 result.confidence >= 0.6 ? "Medium" : "Low"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Card */}
      {result.feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <IconAward className="h-5 w-5" />
              <span>Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{result.feedback}</p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis */}
      {showDetailed && (
        <Card>
          <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <IconTrendingUp className="h-5 w-5" />
                    <span>Detailed Analysis</span>
                  </CardTitle>
                  {isDetailsOpen ? (
                    <IconChevronUp className="h-4 w-4" />
                  ) : (
                    <IconChevronDown className="h-4 w-4" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Key Points Covered */}
                {result.keyPointsCovered.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center text-green-700">
                      <IconCheck className="h-4 w-4 mr-2" />
                      Key Points Covered
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.keyPointsCovered.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Points */}
                {result.missingPoints.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center text-orange-700">
                      <IconAlertTriangle className="h-4 w-4 mr-2" />
                      Points to Improve
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.missingPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-orange-600 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Strengths */}
                {result.strengths.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center text-blue-700">
                      <IconAward className="h-4 w-4 mr-2" />
                      Strengths
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {result.improvements.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center text-purple-700">
                      <IconTarget className="h-4 w-4 mr-2" />
                      Suggested Improvements
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Processing Info */}
                <Alert>
                  <IconBrain className="h-4 w-4" />
                  <AlertDescription>
                    This evaluation was generated by AI and processed on{" "}
                    {new Date(result.processedAt).toLocaleString()}.
                    Please review the feedback and contact your instructor if you have questions.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}
    </div>
  )
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Question } from "@/lib/stores/exam-store"
import {
  IconList,
  IconCheck,
  IconFlag,
  IconCircle,
  IconEye,
  IconEyeOff
} from "@tabler/icons-react"

interface QuestionNavigatorProps {
  questions: Question[]
  currentQuestion: number
  answers: Record<string, any>
  onNavigate: (questionNumber: number) => void
  onShowSummary: () => void
  getQuestionStatus: (questionId: string) => 'answered' | 'unanswered' | 'marked'
}

export function QuestionNavigator({
  questions,
  currentQuestion,
  answers,
  onNavigate,
  onShowSummary,
  getQuestionStatus
}: QuestionNavigatorProps) {
  const getStatusIcon = (status: 'answered' | 'unanswered' | 'marked') => {
    switch (status) {
      case 'answered':
        return <IconCheck className="h-4 w-4" />
      case 'marked':
        return <IconFlag className="h-4 w-4" />
      default:
        return <IconCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: 'answered' | 'unanswered' | 'marked') => {
    switch (status) {
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'marked':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const answeredCount = Object.values(answers).filter(
    answer => answer.answer !== null && answer.answer !== undefined && answer.answer !== ''
  ).length

  const markedCount = Object.values(answers).filter(
    answer => answer.isMarkedForReview
  ).length

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <IconList className="h-4 w-4 mr-2" />
            Question Navigator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statistics */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Answered</span>
              <Badge variant="outline" className="text-green-700 border-green-300">
                {answeredCount}/{questions.length}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Marked</span>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                {markedCount}
              </Badge>
            </div>
          </div>

          {/* Question Grid */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Questions</div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question) => {
                const status = getQuestionStatus(question.id)
                const isCurrent = question.order === currentQuestion

                return (
                  <Tooltip key={question.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs font-mono ${
                          isCurrent ? '' : getStatusColor(status)
                        }`}
                        onClick={() => onNavigate(question.order)}
                      >
                        {getStatusIcon(status)}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Question {question.order}
                        {question.type === 'essay' && ' (Essay)'}
                      </p>
                      <p className="text-xs capitalize">{status}</p>
                      {answers[question.id]?.isMarkedForReview && (
                        <p className="text-xs">Marked for review</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded flex items-center justify-center">
                  <IconCheck className="h-3 w-3 text-green-700" />
                </div>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded flex items-center justify-center">
                  <IconFlag className="h-3 w-3 text-orange-700" />
                </div>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                  <IconCircle className="h-3 w-3 text-gray-600" />
                </div>
                <span>Not Answered</span>
              </div>
            </div>
          </div>

          {/* Summary Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onShowSummary}
            className="w-full"
          >
            <IconEye className="h-4 w-4 mr-2" />
            Review Summary
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
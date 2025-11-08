import { useState } from "react"
import { Question } from "@/lib/stores/exam-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  IconFileDescription,
  IconHelpCircle,
  IconEdit
} from "@tabler/icons-react"

interface QuestionDisplayProps {
  question: Question
  answer: any
  onAnswerChange: (answer: any) => void
}

export function QuestionDisplay({ question, answer, onAnswerChange }: QuestionDisplayProps) {
  const [showHint, setShowHint] = useState(false)

  const handleMultipleChoiceChange = (value: string) => {
    onAnswerChange(value)
  }

  const handleEssayChange = (value: string) => {
    onAnswerChange(value)
  }

  return (
    <div className="space-y-6">
      {/* Question Content */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="outline">
                {question.type === 'multiple_choice' ? 'Multiple Choice' : 'Essay'}
              </Badge>
              <Badge variant="outline">
                {question.points} point{question.points > 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="prose max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {question.content}
              </p>
            </div>
          </div>

          {question.type === 'essay' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="ml-4"
            >
              <IconHelpCircle className="h-4 w-4 mr-2" />
              Hint
            </Button>
          )}
        </div>

        {/* Essay Hint */}
        {question.type === 'essay' && showHint && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <IconHelpCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Writing Tip</h4>
                  <p className="text-sm text-blue-800">
                    Make sure to provide a comprehensive answer with clear examples.
                    Consider different perspectives and support your arguments with relevant details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Answer Input */}
      <div className="space-y-4">
        {question.type === 'multiple_choice' ? (
          <RadioGroup
            value={answer || ""}
            onValueChange={handleMultipleChoiceChange}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <IconEdit className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Your Answer</Label>
            </div>
            <Textarea
              value={answer || ""}
              onChange={(e) => handleEssayChange(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[200px] text-base resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Provide a detailed and comprehensive answer</span>
              <span>{answer?.length || 0} characters</span>
            </div>
          </div>
        )}
      </div>

      {/* Word Count for Essay Questions */}
      {question.type === 'essay' && (
        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <IconFileDescription className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Word count: {answer ? answer.split(/\s+/).filter(word => word.length > 0).length : 0}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Recommended: {question.points * 10}+ words
          </div>
        </div>
      )}
    </div>
  )
}
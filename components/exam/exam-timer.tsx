import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconClock } from "@tabler/icons-react"

interface ExamTimerProps {
  timeRemaining: number
  timeString: string
  isWarning: boolean
}

export function ExamTimer({ timeRemaining, timeString, isWarning }: ExamTimerProps) {
  return (
    <Card className={`border-2 ${isWarning ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-2">
          <IconClock className={`h-4 w-4 ${isWarning ? 'text-orange-600' : 'text-gray-500'}`} />
          <div className="flex flex-col">
            <span className={`text-xs ${isWarning ? 'text-orange-600' : 'text-gray-500'}`}>
              Time Remaining
            </span>
            <span className={`font-mono font-semibold ${isWarning ? 'text-orange-700' : 'text-gray-900'}`}>
              {timeString}
            </span>
          </div>
          {isWarning && (
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              Warning
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
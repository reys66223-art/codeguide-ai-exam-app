/**
 * Client-side AI Grading Utilities
 *
 * This module provides client-side functions for interacting with the AI grading system.
 */

interface EssayGradingRequest {
  studentAnswer: string
  modelAnswer: string
  question: string
  maxPoints: number
  submissionId?: string
}

interface EssayGradingResult {
  submissionId: string | null
  score: number
  maxScore: number
  percentage: number
  grade: {
    grade: number
    category: string
    description: string
  }
  feedback: string
  rubricScores: {
    content: number
    organization: number
    clarity: number
    depth: number
  }
  keyPointsCovered: string[]
  missingPoints: string[]
  strengths: string[]
  improvements: string[]
  confidence: number
  processedAt: string
}

interface BatchGradingRequest {
  submissions: Array<{
    id: string
    studentAnswer: string
    modelAnswer: string
    question: string
    maxPoints: number
  }>
}

interface BatchGradingResult {
  results: Array<EssayGradingResult | { id: string; error: string; processedAt: string }>
  batchStats: {
    totalSubmissions: number
    successfulGrades: number
    failedGrades: number
    averageScore: number
    averagePercentage: number
    gradeDistribution: Record<string, number>
  }
  processedAt: string
}

/**
 * Grades a single essay using the AI grading service
 */
export async function gradeEssay(request: EssayGradingRequest): Promise<EssayGradingResult> {
  try {
    const response = await fetch('/api/grade-essay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error grading essay:', error)
    throw error instanceof Error ? error : new Error('Failed to grade essay')
  }
}

/**
 * Grades multiple essays in batch
 */
export async function gradeBatchEssays(request: BatchGradingRequest): Promise<BatchGradingResult> {
  try {
    const response = await fetch('/api/grade-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error grading batch essays:', error)
    throw error instanceof Error ? error : new Error('Failed to grade batch essays')
  }
}

/**
 * Simulates essay grading for development/testing when API is not available
 */
export function simulateEssayGrading(request: EssayGradingRequest): EssayGradingResult {
  // Simple simulation based on answer length and content
  const answerLength = request.studentAnswer.trim().length
  const modelAnswerLength = request.modelAnswer.trim().length

  // Base score calculation (simulated)
  let score = Math.min(request.maxPoints, Math.floor((answerLength / modelAnswerLength) * request.maxPoints * 0.8))

  // Add some variation based on content keywords
  const modelKeywords = request.modelAnswer.toLowerCase().split(/\s+/)
  const studentKeywords = request.studentAnswer.toLowerCase().split(/\s+/)
  const commonKeywords = modelKeywords.filter(keyword => studentKeywords.includes(keyword))
  const keywordMatch = commonKeywords.length / modelKeywords.length

  score = Math.round(score + (keywordMatch * request.maxPoints * 0.2))
  score = Math.min(request.maxPoints, Math.max(0, score))

  const percentage = Math.round((score / request.maxPoints) * 100)

  // Determine grade category
  let category: string
  let description: string

  if (percentage >= 90) {
    category = "Very Appropriate"
    description = "All key points are present and well-explained"
  } else if (percentage >= 80) {
    category = "Appropriate"
    description = "Most key points covered with good explanations"
  } else if (percentage >= 70) {
    category = "Moderately Appropriate"
    description = "Some key points missing but shows understanding"
  } else if (percentage >= 60) {
    category = "Somewhat Appropriate"
    description = "Limited understanding with many points missing"
  } else {
    category = "Inappropriate"
    description = "Minimal understanding of the topic"
  }

  // Generate simulated feedback
  const feedback = `This is a simulated evaluation. Your answer demonstrates ${category.toLowerCase()} understanding of the topic. ${description.toLowerCase()}.`

  return {
    submissionId: request.submissionId || null,
    score,
    maxScore: request.maxPoints,
    percentage,
    grade: {
      grade: percentage,
      category,
      description
    },
    feedback,
    rubricScores: {
      content: Math.round(score * 0.9),
      organization: Math.round(score * 0.8),
      clarity: Math.round(score * 0.85),
      depth: Math.round(score * 0.75)
    },
    keyPointsCovered: commonKeywords.slice(0, 5),
    missingPoints: modelKeywords.slice(0, 3).filter(k => !studentKeywords.includes(k)),
    strengths: [category.toLowerCase(), "clear structure"],
    improvements: percentage < 80 ? ["add more details", "include specific examples"] : [],
    confidence: 0.75,
    processedAt: new Date().toISOString()
  }
}

/**
 * Enhanced grading function with fallback to simulation
 */
export async function gradeEssayWithFallback(request: EssayGradingRequest): Promise<EssayGradingResult> {
  try {
    return await gradeEssay(request)
  } catch (error) {
    console.warn('AI grading service unavailable, using simulation:', error)
    return simulateEssayGrading(request)
  }
}

/**
 * Formats the grading result for display
 */
export function formatGradingResult(result: EssayGradingResult): {
  scoreDisplay: string
  gradeDisplay: string
  feedbackDisplay: string
  rubricDisplay: Array<{ name: string; score: number; maxScore: number }>
} {
  const scoreDisplay = `${result.score}/${result.maxScore} (${result.percentage}%)`
  const gradeDisplay = `${result.grade.category} - ${result.percentage}%`
  const feedbackDisplay = result.feedback || "No feedback provided."

  const rubricDisplay = [
    { name: "Content", score: result.rubricScores.content, maxScore: result.maxScore },
    { name: "Organization", score: result.rubricScores.organization, maxScore: result.maxScore },
    { name: "Clarity", score: result.rubricScores.clarity, maxScore: result.maxScore },
    { name: "Depth", score: result.rubricScores.depth, maxScore: result.maxScore }
  ]

  return {
    scoreDisplay,
    gradeDisplay,
    feedbackDisplay,
    rubricDisplay
  }
}

/**
 * Validates essay content before grading
 */
export function validateEssayForGrading(studentAnswer: string, modelAnswer: string): {
  isValid: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  if (!studentAnswer || studentAnswer.trim().length === 0) {
    warnings.push("Student answer is empty")
    return { isValid: false, warnings }
  }

  if (studentAnswer.trim().length < 50) {
    warnings.push("Student answer is very short (less than 50 characters)")
  }

  if (studentAnswer.trim().length > 10000) {
    warnings.push("Student answer is very long (over 10,000 characters)")
  }

  if (!modelAnswer || modelAnswer.trim().length === 0) {
    warnings.push("Model answer is empty")
    return { isValid: false, warnings }
  }

  // Check for suspicious patterns
  const studentWords = studentAnswer.toLowerCase().split(/\s+/)
  const uniqueStudentWords = new Set(studentWords)

  if (studentWords.length > 100 && uniqueStudentWords.size / studentWords.length < 0.3) {
    warnings.push("Student answer appears to have repetitive content")
  }

  return {
    isValid: warnings.length === 0,
    warnings
  }
}
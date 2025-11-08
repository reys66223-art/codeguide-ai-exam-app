import { NextRequest, NextResponse } from "next/server"
import { scoreEssay, validateEssayContent, preprocessEssayContent, mapScoreToGrade } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentAnswer, modelAnswer, question, maxPoints, submissionId } = body

    // Validate required fields
    if (!studentAnswer || !modelAnswer || !question || !maxPoints) {
      return NextResponse.json(
        { error: "Missing required fields: studentAnswer, modelAnswer, question, maxPoints" },
        { status: 400 }
      )
    }

    // Validate input types
    if (typeof studentAnswer !== "string" || typeof modelAnswer !== "string" ||
        typeof question !== "string" || typeof maxPoints !== "number") {
      return NextResponse.json(
        { error: "Invalid field types" },
        { status: 400 }
      )
    }

    // Validate maxPoints
    if (maxPoints <= 0 || maxPoints > 100) {
      return NextResponse.json(
        { error: "maxPoints must be between 1 and 100" },
        { status: 400 }
      )
    }

    // Preprocess and validate essay content
    const processedStudentAnswer = preprocessEssayContent(studentAnswer)
    const validation = validateEssayContent(processedStudentAnswer)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid essay content",
          issues: validation.issues
        },
        { status: 400 }
      )
    }

    // Score the essay using Gemini AI
    const scoringResult = await scoreEssay({
      studentAnswer: processedStudentAnswer,
      modelAnswer,
      question,
      maxPoints
    })

    // Map score to grade category
    const gradeInfo = mapScoreToGrade(scoringResult.score, maxPoints)

    // Return the comprehensive scoring result
    const response = {
      submissionId: submissionId || null,
      score: scoringResult.score,
      maxScore: maxPoints,
      percentage: Math.round((scoringResult.score / maxPoints) * 100),
      grade: gradeInfo,
      feedback: scoringResult.feedback,
      rubricScores: scoringResult.rubricScores,
      keyPointsCovered: scoringResult.keyPointsCovered,
      missingPoints: scoringResult.missingPoints,
      strengths: scoringResult.strengths,
      improvements: scoringResult.improvements,
      confidence: scoringResult.confidence,
      processedAt: new Date().toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Error in grade-essay API:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY")) {
        return NextResponse.json(
          { error: "AI service configuration error" },
          { status: 500 }
        )
      }

      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "AI service is temporarily unavailable. Please try again later." },
          { status: 429 }
        )
      }

      if (error.message.includes("No response generated")) {
        return NextResponse.json(
          { error: "AI service failed to process the essay. Please try again." },
          { status: 502 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to grade essay. Please try again later." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to grade essays." },
    { status: 405 }
  )
}
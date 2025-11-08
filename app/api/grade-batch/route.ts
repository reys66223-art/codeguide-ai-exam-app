import { NextRequest, NextResponse } from "next/server"
import { scoreBatchEssays, validateEssayContent, preprocessEssayContent, mapScoreToGrade } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissions } = body

    // Validate required fields
    if (!submissions || !Array.isArray(submissions)) {
      return NextResponse.json(
        { error: "Missing or invalid 'submissions' array" },
        { status: 400 }
      )
    }

    if (submissions.length === 0) {
      return NextResponse.json(
        { error: "No submissions provided" },
        { status: 400 }
      )
    }

    if (submissions.length > 50) {
      return NextResponse.json(
        { error: "Too many submissions. Maximum 50 submissions per batch." },
        { status: 400 }
      )
    }

    // Validate each submission
    const validatedSubmissions = []
    const validationErrors = []

    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i]
      const { id, studentAnswer, modelAnswer, question, maxPoints } = submission

      if (!id || !studentAnswer || !modelAnswer || !question || !maxPoints) {
        validationErrors.push({
          index: i,
          id: id || `submission-${i}`,
          error: "Missing required fields: id, studentAnswer, modelAnswer, question, maxPoints"
        })
        continue
      }

      if (typeof maxPoints !== "number" || maxPoints <= 0 || maxPoints > 100) {
        validationErrors.push({
          index: i,
          id,
          error: "maxPoints must be a number between 1 and 100"
        })
        continue
      }

      // Preprocess and validate essay content
      const processedStudentAnswer = preprocessEssayContent(studentAnswer)
      const validation = validateEssayContent(processedStudentAnswer)

      if (!validation.isValid) {
        validationErrors.push({
          index: i,
          id,
          error: "Invalid essay content",
          issues: validation.issues
        })
        continue
      }

      validatedSubmissions.push({
        id,
        studentAnswer: processedStudentAnswer,
        modelAnswer,
        question,
        maxPoints
      })
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed for some submissions",
          validationErrors
        },
        { status: 400 }
      )
    }

    // Grade essays in batch
    const batchResults = await scoreBatchEssays({
      submissions: validatedSubmissions
    })

    // Process results and add grade information
    const processedResults = batchResults.map(result => {
      if (result.error) {
        return {
          id: result.id,
          error: result.error,
          processedAt: new Date().toISOString()
        }
      }

      const gradeInfo = mapScoreToGrade(result.result.score, result.result.maxPoints || 100)

      return {
        id: result.id,
        score: result.result.score,
        maxScore: result.result.maxPoints || 100,
        percentage: Math.round((result.result.score / (result.result.maxPoints || 100)) * 100),
        grade: gradeInfo,
        feedback: result.result.feedback,
        rubricScores: result.result.rubricScores,
        keyPointsCovered: result.result.keyPointsCovered,
        missingPoints: result.result.missingPoints,
        strengths: result.result.strengths,
        improvements: result.result.improvements,
        confidence: result.result.confidence,
        processedAt: new Date().toISOString()
      }
    })

    // Calculate batch statistics
    const successfulGrades = processedResults.filter(r => !r.error)
    const batchStats = {
      totalSubmissions: submissions.length,
      successfulGrades: successfulGrades.length,
      failedGrades: processedResults.length - successfulGrades.length,
      averageScore: successfulGrades.length > 0
        ? Math.round(
            successfulGrades.reduce((sum, r) => sum + (r as any).score, 0) / successfulGrades.length
          )
        : 0,
      averagePercentage: successfulGrades.length > 0
        ? Math.round(
            successfulGrades.reduce((sum, r) => sum + (r as any).percentage, 0) / successfulGrades.length
          )
        : 0,
      gradeDistribution: successfulGrades.reduce((dist, r) => {
        const grade = (r as any).grade?.category || "Unknown"
        dist[grade] = (dist[grade] || 0) + 1
        return dist
      }, {} as Record<string, number>)
    }

    return NextResponse.json({
      results: processedResults,
      batchStats,
      processedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error in grade-batch API:", error)

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
          { error: "AI service rate limit exceeded. Please try again later." },
          { status: 429 }
        )
      }

      if (error.message.includes("No response generated")) {
        return NextResponse.json(
          { error: "AI service failed to process essays. Please try again." },
          { status: 502 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to grade essays in batch. Please try again later." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to grade essays in batch." },
    { status: 405 }
  )
}
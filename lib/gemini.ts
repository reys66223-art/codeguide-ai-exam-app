/**
 * Gemini AI Integration for Essay Scoring
 *
 * This module provides functions to integrate with Google's Gemini AI
 * for automated essay scoring based on model answers.
 */

interface EssayScoringRequest {
  studentAnswer: string
  modelAnswer: string
  question: string
  maxPoints: number
}

interface EssayScoringResult {
  score: number
  feedback: string
  keyPointsCovered: string[]
  missingPoints: string[]
  strengths: string[]
  improvements: string[]
  rubricScores: {
    content: number
    organization: number
    clarity: number
    depth: number
  }
  confidence: number
}

interface BatchEssayRequest {
  submissions: Array<{
    id: string
    studentAnswer: string
    modelAnswer: string
    question: string
    maxPoints: number
  }>
}

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

/**
 * Delays execution for the specified number of milliseconds
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Implements exponential backoff for retrying failed API calls
 */
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error
      }

      // Check if it's a rate limit error
      if (error.status === 429 || error.message?.includes('rate limit')) {
        const delayTime = baseDelay * Math.pow(2, attempt)
        console.log(`Rate limit hit, retrying in ${delayTime}ms...`)
        await delay(delayTime)
      } else {
        // For other errors, retry with a shorter delay
        await delay(baseDelay)
      }
    }
  }

  throw new Error("Max retries exceeded")
}

/**
 * Generates a comprehensive prompt for Gemini to score essays
 */
function generateScoringPrompt(request: EssayScoringRequest): string {
  return `You are an expert educational evaluator grading student essays. Please evaluate the following essay response against a model answer.

QUESTION: ${request.question}

MODEL ANSWER (Key points that should be covered):
${request.modelAnswer}

STUDENT'S ANSWER:
${request.studentAnswer}

GRADING INSTRUCTIONS:
1. Evaluate the student's answer for content accuracy, completeness, and understanding
2. Assess organization, clarity, and depth of response
3. Provide a score from 0 to ${request.maxPoints} points
4. Give constructive feedback highlighting strengths and areas for improvement
5. Identify key concepts covered and any important points missed

Please respond in the following JSON format:
{
  "score": <number between 0 and ${request.maxPoints}>,
  "feedback": "<detailed feedback for the student>",
  "keyPointsCovered": ["<point 1>", "<point 2>", ...],
  "missingPoints": ["<missed point 1>", "<missed point 2>", ...],
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "improvements": ["<improvement 1>", "<improvement 2>", ...],
  "rubricScores": {
    "content": <score 0-${request.maxPoints}>,
    "organization": <score 0-${request.maxPoints}>,
    "clarity": <score 0-${request.maxPoints}>,
    "depth": <score 0-${request.maxPoints}>
  },
  "confidence": <confidence level 0-1>
}

Evaluation criteria:
- Content: Accuracy and relevance of information
- Organization: Structure and logical flow
- Clarity: Language clarity and readability
- Depth: Level of detail and critical thinking

Be fair but thorough in your evaluation. Focus on educational growth and provide actionable feedback.`
}

/**
 * Calls the Gemini API to score a single essay
 */
export async function scoreEssay(request: EssayScoringRequest): Promise<EssayScoringResult> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set")
  }

  const prompt = generateScoringPrompt(request)

  const operation = async () => {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error("No response generated from Gemini API")
    }

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from Gemini response")
    }

    const result = JSON.parse(jsonMatch[0]) as EssayScoringResult

    // Validate the result structure
    if (typeof result.score !== "number" || result.score < 0 || result.score > request.maxPoints) {
      throw new Error(`Invalid score returned: ${result.score}`)
    }

    return result
  }

  return retryWithBackoff(operation)
}

/**
 * Scores multiple essays in batch with rate limiting
 */
export async function scoreBatchEssays(request: BatchEssayRequest): Promise<Array<{
  id: string
  result: EssayScoringResult
  error?: string
}>> {
  const results: Array<{
    id: string
    result?: EssayScoringResult
    error?: string
  }> = []

  // Process essays with rate limiting (max 10 requests per minute for free tier)
  const RATE_LIMIT_DELAY = 6000 // 6 seconds between requests

  for (const submission of request.submissions) {
    try {
      const result = await scoreEssay(submission)
      results.push({
        id: submission.id,
        result
      })
    } catch (error) {
      console.error(`Error scoring essay ${submission.id}:`, error)
      results.push({
        id: submission.id,
        error: error instanceof Error ? error.message : "Unknown error"
      })
    }

    // Add delay between requests (except for the last one)
    if (submission !== request.submissions[request.submissions.length - 1]) {
      await delay(RATE_LIMIT_DELAY)
    }
  }

  return results
}

/**
 * Maps AI score to the 90-100 grading scale
 */
export function mapScoreToGrade(score: number, maxScore: number): {
  grade: number
  category: string
  description: string
} {
  const percentage = (score / maxScore) * 100

  let grade: number
  let category: string
  let description: string

  if (percentage >= 90) {
    grade = percentage
    category = "Very Appropriate"
    description = "All key points are present and well-explained"
  } else if (percentage >= 80) {
    grade = percentage
    category = "Appropriate"
    description = "Most key points covered with good explanations"
  } else if (percentage >= 70) {
    grade = percentage
    category = "Moderately Appropriate"
    description = "Some key points missing but shows understanding"
  } else if (percentage >= 60) {
    grade = percentage
    category = "Somewhat Appropriate"
    description = "Limited understanding with many points missing"
  } else if (percentage >= 50) {
    grade = percentage
    category = "Inappropriate"
    description = "Minimal understanding of the topic"
  } else {
    grade = percentage
    category = "Very Inappropriate"
    description = "Little to no understanding demonstrated"
  }

  return { grade, category, description }
}

/**
 * Validates essay content before scoring
 */
export function validateEssayContent(content: string): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []

  if (!content || content.trim().length === 0) {
    issues.push("Essay is empty")
  } else if (content.trim().length < 50) {
    issues.push("Essay is too short (minimum 50 characters)")
  }

  if (content.length > 10000) {
    issues.push("Essay is too long (maximum 10,000 characters)")
  }

  // Check for potential cheating (very repetitive content)
  const words = content.toLowerCase().split(/\s+/)
  const uniqueWords = new Set(words)
  if (words.length > 50 && uniqueWords.size / words.length < 0.3) {
    issues.push("Essay appears to have repetitive content")
  }

  return {
    isValid: issues.length === 0,
    issues
  }
}

/**
 * Preprocesses essay content for better AI evaluation
 */
export function preprocessEssayContent(content: string): string {
  return content
    .trim()
    // Replace multiple newlines with single newline
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    // Replace multiple spaces with single space
    .replace(/\s+/g, " ")
    // Ensure proper spacing after punctuation
    .replace(/([.!?])\s*/g, "$1 ")
    .trim()
}
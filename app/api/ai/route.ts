import { AI_PERSONAS } from "@/lib/constants"
import type { AIPersona } from "@/lib/store"

export const runtime = "edge"

// Groq API endpoint
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, persona, board, cls, sub } = body

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Invalid prompt" }, { status: 400 })
    }

    // Get API key from environment
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return Response.json(
        { error: "API key not configured. Please add GROQ_API_KEY to environment variables." },
        { status: 500 }
      )
    }

    // Get the system prompt for the persona
    const personaKey = (persona || "doubts") as AIPersona
    const personaData = AI_PERSONAS[personaKey] || AI_PERSONAS.doubts

    const systemPrompt = `${personaData.systemPrompt}

[Context: Board: ${board || "CBSE"}, Class: ${cls || "10"}, Subject: ${sub || "Mathematics"}]
[Important: Be accurate, helpful, and encouraging. Format responses for easy reading with proper markdown.]`

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
        max_tokens: 4096,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        errorData.error?.message || `Groq API error: ${response.status}`

      console.error("Groq API Error:", errorMessage)

      // Handle specific error cases
      if (response.status === 429) {
        return Response.json(
          { error: "Rate limit exceeded. Please wait a moment and try again." },
          { status: 429 }
        )
      }

      if (response.status === 401) {
        return Response.json(
          { error: "Invalid API key. Please check your GROQ_API_KEY." },
          { status: 401 }
        )
      }

      return Response.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content

    if (!reply) {
      return Response.json(
        { error: "No response generated. Please try again." },
        { status: 500 }
      )
    }

    return Response.json({ reply })
  } catch (error) {
    console.error("AI API Error:", error)

    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid request format" }, { status: 400 })
    }

    return Response.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}

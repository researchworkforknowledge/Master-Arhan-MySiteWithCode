import { AI_PERSONAS } from "./constants"
import type { AIPersona } from "./store"

interface AIRequestOptions {
  prompt: string
  persona: AIPersona
  board?: string
  classLevel?: string
  subject?: string
  signal?: AbortSignal
}

interface AIResponse {
  success: boolean
  content: string
  error?: string
}

/**
 * Call the AI API with proper error handling and retry logic
 */
export async function callAI({
  prompt,
  persona,
  board = "CBSE",
  classLevel = "10",
  subject = "Mathematics",
  signal,
}: AIRequestOptions): Promise<AIResponse> {
  const maxRetries = 2
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          persona,
          board,
          cls: classLevel,
          sub: subject,
        }),
        signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.reply) {
        throw new Error("Empty response from AI")
      }

      return {
        success: true,
        content: data.reply,
      }
    } catch (error) {
      if (error instanceof Error) {
        // Don't retry on abort
        if (error.name === "AbortError") {
          return {
            success: false,
            content: "",
            error: "Request cancelled",
          }
        }
        lastError = error
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
      }
    }
  }

  return {
    success: false,
    content: "",
    error: lastError?.message || "Failed to get AI response",
  }
}

/**
 * Format AI response with proper markdown/HTML rendering
 */
export function formatAIResponse(text: string): string {
  if (!text) return ""

  return (
    text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-[hsl(var(--accent-cyan))]">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 text-[hsl(var(--accent-cyan))]">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2 text-[hsl(var(--accent-cyan))]">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[hsl(var(--primary-light))]">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="text-[hsl(var(--accent-pink))]">$1</em>')
      // Code
      .replace(
        /`(.*?)`/g,
        '<code class="bg-black/30 px-1.5 py-0.5 rounded font-mono text-[hsl(var(--accent-gold))] text-sm">$1</code>'
      )
      // Line breaks
      .replace(/\n/g, "<br/>")
      // Horizontal rule
      .replace(/<br\/>\s*---\s*<br\/>/g, '<hr class="border-t border-border my-4"/>')
  )
}

/**
 * Parse JSON from AI response (handles markdown code blocks)
 */
export function parseAIJSON<T>(text: string): T | null {
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json|```/g, "").trim()

    // Try to find JSON array or object
    const jsonMatch = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/)

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return JSON.parse(cleaned)
  } catch {
    console.error("Failed to parse AI JSON:", text)
    return null
  }
}

/**
 * Get the system prompt for a persona with context
 */
export function getSystemPrompt(
  persona: AIPersona,
  board: string,
  classLevel: string,
  subject: string
): string {
  const personaData = AI_PERSONAS[persona]
  const basePrompt = personaData?.systemPrompt || AI_PERSONAS.doubts.systemPrompt

  return `${basePrompt}

[Context: Board: ${board}, Class: ${classLevel}, Subject: ${subject}]
[Important: Always be accurate, helpful, and encouraging. Format your response for easy reading.]`
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

/**
 * Speech synthesis helper
 */
export function speakText(text: string, onEnd?: () => void): void {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported")
    return
  }

  window.speechSynthesis.cancel()

  // Clean text for speech
  const cleanText = text
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  // Split into sentences for better handling
  const chunks = cleanText.match(/[^.!?]+[.!?]?/g) || [cleanText]

  let index = 0

  const playNext = () => {
    if (index >= chunks.length) {
      onEnd?.()
      return
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index++].trim())
    utterance.rate = 0.96
    utterance.pitch = 1.0
    utterance.lang = "en-IN"
    utterance.onend = playNext
    utterance.onerror = playNext

    window.speechSynthesis.speak(utterance)
  }

  playNext()
}

/**
 * Stop speech synthesis
 */
export function stopSpeaking(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Check if speech recognition is available
 */
export function isSpeechRecognitionAvailable(): boolean {
  return !!(
    typeof window !== "undefined" &&
    (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)
  )
}

/**
 * Create speech recognition instance
 */
export function createSpeechRecognition(): SpeechRecognition | null {
  if (typeof window === "undefined") return null

  const SpeechRecognition =
    window.SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition

  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.lang = "en-IN"
  recognition.interimResults = false
  recognition.continuous = false
  recognition.maxAlternatives = 1

  return recognition
}

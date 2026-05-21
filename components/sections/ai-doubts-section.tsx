"use client"

import { useState, useRef, useCallback } from "react"
import { useStudyStore } from "@/lib/store"
import { callAI, formatAIResponse, speakText, stopSpeaking, isSpeechRecognitionAvailable, createSpeechRecognition } from "@/lib/ai"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Trash2, Mic, MicOff, Volume2, VolumeX, Sparkles } from "lucide-react"
import { toast } from "sonner"

export function AIDoubtsSection() {
  const { board, classLevel, subject, chatHistory, addChatMessage, clearChat } = useStudyStore()
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const messages = chatHistory.doubts || []

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }, [])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage = text.trim()
    setInput("")
    setLoading(true)

    // Add user message
    addChatMessage("doubts", { role: "user", content: userMessage })
    scrollToBottom()

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController()

    try {
      const response = await callAI({
        prompt: userMessage,
        persona: "doubts",
        board,
        classLevel,
        subject,
        signal: abortControllerRef.current.signal,
      })

      if (response.success) {
        addChatMessage("doubts", { role: "assistant", content: response.content })

        // Speak response if voice mode is on
        if (voiceMode) {
          setSpeaking(true)
          speakText(response.content, () => {
            setSpeaking(false)
            // Auto-restart listening in voice mode
            if (voiceMode) {
              startListening()
            }
          })
        }
      } else {
        toast.error(response.error || "Failed to get response")
        addChatMessage("doubts", {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Something went wrong")
      }
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Voice Recognition
  const startListening = useCallback(() => {
    if (!isSpeechRecognitionAvailable()) {
      toast.error("Voice not supported in this browser")
      return
    }

    if (!recognitionRef.current) {
      recognitionRef.current = createSpeechRecognition()
      if (!recognitionRef.current) return

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim()
        if (transcript) {
          setListening(false)
          sendMessage(transcript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        setListening(false)
        if (event.error === "not-allowed") {
          toast.error("Please allow microphone access")
        }
      }

      recognitionRef.current.onend = () => {
        setListening(false)
      }
    }

    try {
      recognitionRef.current.start()
      setListening(true)
    } catch (e) {
      // Already started
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setListening(false)
  }, [])

  const toggleVoiceMode = () => {
    if (voiceMode) {
      setVoiceMode(false)
      stopListening()
      stopSpeaking()
      setSpeaking(false)
      toast.info("🎙️ Voice Mode off")
    } else {
      setVoiceMode(true)
      toast.success("🎙️ Voice Mode on - speak your doubt!")
      startListening()
    }
  }

  const handleStopSpeaking = () => {
    stopSpeaking()
    setSpeaking(false)
  }

  const handleClearChat = () => {
    clearChat("doubts")
    toast.info("Chat cleared")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-2">💬 AI Doubts</h2>
        <p className="text-muted-foreground">
          Ask me anything from your curriculum — I'll explain it simply first, then go deeper.
        </p>
      </div>

      {/* Chat Card */}
      <Card className="glass border-border">
        <CardContent className="p-4">
          {/* AI Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary">
              <Sparkles className="h-3 w-3" />
              Feynman Tutor · Explains Simply Then Deeply
            </span>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="h-[350px] pr-4" ref={scrollRef}>
            <div className="space-y-3">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div className="chat-message-ai p-4">
                  <p>
                    👋 Hi! I'm your AI tutor. Ask me anything from your{" "}
                    <strong className="text-primary">{subject}</strong> curriculum — I'll
                    explain it simply first, then go deeper. What's your doubt?
                  </p>
                </div>
              )}

              {/* Messages */}
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={
                      msg.role === "user"
                        ? "chat-message-user p-3 ml-auto max-w-[85%]"
                        : "chat-message-ai p-4 max-w-[90%]"
                    }
                  >
                    {msg.role === "user" ? (
                      <span>🧑‍🎓 {msg.content}</span>
                    ) : (
                      <div
                        className="ai-response text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatAIResponse(msg.content),
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="chat-message-ai p-4 max-w-[90%]"
                >
                  <div className="flex items-center gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your doubt..."
              className="flex-1 bg-secondary/50"
              disabled={loading || listening}
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-accent-cyan to-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Voice Controls */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Button
              variant={voiceMode ? "default" : "outline"}
              onClick={toggleVoiceMode}
              className={
                listening
                  ? "bg-destructive hover:bg-destructive/90 voice-pulse"
                  : speaking
                    ? "bg-accent-cyan hover:bg-accent-cyan/90 text-black"
                    : ""
              }
            >
              {listening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Listening...
                </>
              ) : speaking ? (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Speaking...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Mode
                </>
              )}
            </Button>

            {speaking && (
              <Button variant="outline" size="sm" onClick={handleStopSpeaking}>
                <VolumeX className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Voice Status */}
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {listening
              ? "🔴 Listening... speak now"
              : speaking
                ? "🗣️ Speaking the answer..."
                : voiceMode
                  ? "Voice Mode ON — tap mic to ask another"
                  : "Tap Voice Mode to speak your doubt"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

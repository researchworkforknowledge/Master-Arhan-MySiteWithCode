"use client"

import { useState, useCallback } from "react"
import { useStudyStore } from "@/lib/store"
import { callAI, parseAIJSON } from "@/lib/ai"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, RefreshCw, ChevronRight } from "lucide-react"
import { toast } from "sonner"

interface QuizQuestion {
  q: string
  opts: string[]
  ans: number
  exp?: string
}

export function QuizSection() {
  const { board, classLevel, subject, incrementQuizzes } = useStudyStore()
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const currentQuestion = quiz?.[currentIndex]
  const isComplete = quiz && currentIndex >= quiz.length

  const generateQuiz = useCallback(async () => {
    const quizTopic = topic.trim() || subject
    setLoading(true)
    setQuiz(null)
    setCurrentIndex(0)
    setScore(0)
    setAnswered(null)
    setShowExplanation(false)

    toast.info("🎯 Generating quiz...")

    try {
      const response = await callAI({
        prompt: `Generate 5 MCQ quiz questions for topic: ${quizTopic}, Board: ${board}, Class: ${classLevel}.`,
        persona: "quiz",
        board,
        classLevel,
        subject,
      })

      if (response.success) {
        const questions = parseAIJSON<QuizQuestion[]>(response.content)
        if (questions && Array.isArray(questions) && questions.length > 0) {
          setQuiz(questions)
          toast.success(`Quiz ready! ${questions.length} questions`)
        } else {
          toast.error("Could not parse quiz questions. Try again.")
        }
      } else {
        toast.error(response.error || "Failed to generate quiz")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [topic, subject, board, classLevel])

  const handleAnswer = (index: number) => {
    if (answered !== null || !currentQuestion) return

    setAnswered(index)
    setShowExplanation(true)

    if (index === currentQuestion.ans) {
      setScore((s) => s + 1)
      toast.success("✓ Correct!")
    } else {
      toast.error("✗ Wrong!")
    }
  }

  const handleNext = () => {
    if (currentIndex < (quiz?.length || 0) - 1) {
      setCurrentIndex((i) => i + 1)
      setAnswered(null)
      setShowExplanation(false)
    } else {
      // Quiz complete
      incrementQuizzes()
    }
  }

  const handleRestart = () => {
    setQuiz(null)
    setCurrentIndex(0)
    setScore(0)
    setAnswered(null)
    setShowExplanation(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-2">❓ AI Quizzes</h2>
        <p className="text-muted-foreground">
          Test your knowledge with AI-generated MCQ quizzes for {subject}.
        </p>
      </div>

      {/* Generate Quiz */}
      <Card className="glass border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Generate Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`Topic (e.g., "Quadratic Equations")... Leave blank for ${subject}`}
              className="flex-1 bg-secondary/50"
              onKeyDown={(e) => e.key === "Enter" && generateQuiz()}
            />
            <Button
              onClick={generateQuiz}
              disabled={loading}
              className="bg-gradient-to-r from-accent-cyan to-primary"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Generate</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Area */}
      {loading && (
        <Card className="glass border-border">
          <CardContent className="p-8">
            <div className="shimmer h-24 rounded-lg mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="shimmer h-12 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {quiz && !isComplete && currentQuestion && (
        <Card className="glass border-border">
          <CardContent className="p-6">
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {quiz.length}
              </span>
              <span className="text-sm font-bold text-primary">
                Score: {score}/{currentIndex + (answered !== null ? 1 : 0)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold mb-4">
                Q{currentIndex + 1}: {currentQuestion.q}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {currentQuestion.opts.map((opt, i) => {
                  const isCorrect = i === currentQuestion.ans
                  const isSelected = i === answered
                  const showResult = answered !== null

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={answered !== null}
                      className={`w-full p-4 rounded-xl text-left transition-all border ${
                        showResult
                          ? isCorrect
                            ? "bg-success/20 border-success text-success-foreground"
                            : isSelected
                              ? "bg-destructive/20 border-destructive text-destructive-foreground"
                              : "bg-secondary/30 border-border"
                          : "bg-secondary/30 border-border hover:border-primary/50 hover:bg-primary/10"
                      }`}
                    >
                      <span className="font-bold mr-2">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && currentQuestion.exp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm"
                  >
                    💡 {currentQuestion.exp}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              {answered !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end"
                >
                  <Button onClick={handleNext}>
                    {currentIndex < quiz.length - 1 ? (
                      <>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      "See Results"
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Complete */}
      {quiz && isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="glass border-border">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-6xl mb-4"
              >
                {score >= 4 ? "🎉" : score >= 3 ? "👍" : "📚"}
              </motion.div>

              <h3 className="text-2xl font-black mb-2">Quiz Complete!</h3>

              <p className="text-4xl font-black gradient-text mb-4">
                {score} / {quiz.length}
              </p>

              <p className="text-muted-foreground mb-6">
                {score >= 4
                  ? "Excellent! You're well prepared! 🌟"
                  : score >= 3
                    ? "Good job! Keep practicing! 💪"
                    : "Keep studying! You'll get there! 📖"}
              </p>

              <div className="flex justify-center gap-3">
                <Button onClick={handleRestart} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Quiz
                </Button>
                <Button onClick={generateQuiz}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Same Topic
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import { useStudyStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react"
import { toast } from "sonner"

export function FlashcardsSection() {
  const {
    subject,
    flashcards,
    flashcardIndex,
    addFlashcard,
    deleteFlashcard,
    setFlashcardIndex,
    updateFlashcardConfidence,
  } = useStudyStore()

  const [front, setFront] = useState("")
  const [back, setBack] = useState("")
  const [flipped, setFlipped] = useState(false)

  const currentCard = flashcards[flashcardIndex]
  const totalCards = flashcards.length

  const handleAdd = () => {
    if (!front.trim() || !back.trim()) {
      toast.error("Fill in both sides of the card")
      return
    }

    addFlashcard({
      front: front.trim(),
      back: back.trim(),
      subject,
    })

    setFront("")
    setBack("")
    toast.success("🃏 Flashcard added!")
  }

  const handleNext = () => {
    if (flashcardIndex < totalCards - 1) {
      setFlashcardIndex(flashcardIndex + 1)
      setFlipped(false)
    }
  }

  const handlePrev = () => {
    if (flashcardIndex > 0) {
      setFlashcardIndex(flashcardIndex - 1)
      setFlipped(false)
    }
  }

  const handleShuffle = () => {
    if (totalCards > 1) {
      const randomIndex = Math.floor(Math.random() * totalCards)
      setFlashcardIndex(randomIndex)
      setFlipped(false)
      toast.info("🔀 Shuffled!")
    }
  }

  const handleConfidence = (level: number) => {
    if (currentCard) {
      updateFlashcardConfidence(currentCard.id, level)
      toast.success(level >= 4 ? "Great! Moving on..." : "Keep practicing!")
      handleNext()
    }
  }

  const handleDelete = (id: string) => {
    deleteFlashcard(id)
    if (flashcardIndex >= totalCards - 1 && flashcardIndex > 0) {
      setFlashcardIndex(flashcardIndex - 1)
    }
    toast.success("Card deleted")
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
        <h2 className="text-2xl md:text-3xl font-black mb-2">🃏 Flash Cards</h2>
        <p className="text-muted-foreground">
          Create and study flashcards with spaced repetition for {subject}.
        </p>
      </div>

      {/* Add Card Form */}
      <Card className="glass border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">➕ Add New Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Front (Question/Term)..."
            className="bg-secondary/50"
          />
          <Input
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Back (Answer/Definition)..."
            className="bg-secondary/50"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={!front.trim() || !back.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </CardContent>
      </Card>

      {/* Flashcard Study Area */}
      {totalCards > 0 ? (
        <Card className="glass border-border">
          <CardContent className="p-6">
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Card {flashcardIndex + 1} of {totalCards}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShuffle}>
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => currentCard && handleDelete(currentCard.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Flashcard */}
            <div
              className="flashcard h-[220px] cursor-pointer mb-4"
              onClick={() => setFlipped(!flipped)}
            >
              <div className={`flashcard-inner relative w-full h-full ${flipped ? "flipped" : ""}`}>
                {/* Front */}
                <div className="flashcard-face absolute w-full h-full rounded-2xl bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center p-6 text-center text-white font-semibold text-lg border border-white/10 shadow-lg">
                  {currentCard?.front || "No cards"}
                </div>

                {/* Back */}
                <div className="flashcard-face flashcard-back absolute w-full h-full rounded-2xl bg-gradient-to-br from-secondary to-card flex items-center justify-center p-6 text-center font-semibold text-lg border-2 border-primary shadow-lg">
                  {currentCard?.back || "Add a card"}
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mb-4">
              Tap card to flip • {flipped ? "Showing answer" : "Showing question"}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                disabled={flashcardIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                onClick={() => setFlipped(!flipped)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Flip
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={flashcardIndex >= totalCards - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Confidence Buttons */}
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-2"
              >
                <p className="w-full text-center text-xs text-muted-foreground mb-2">
                  How well did you know this?
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleConfidence(1)}
                >
                  😕 Again
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-warning text-warning hover:bg-warning/10"
                  onClick={() => handleConfidence(3)}
                >
                  🤔 Hard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-success text-success hover:bg-success/10"
                  onClick={() => handleConfidence(4)}
                >
                  😊 Good
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => handleConfidence(5)}
                >
                  🤩 Easy
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="glass border-border">
          <CardContent className="p-8 text-center">
            <p className="text-4xl mb-4">🃏</p>
            <p className="text-muted-foreground">No flashcards yet. Add your first one above!</p>
          </CardContent>
        </Card>
      )}

      {/* Card List */}
      {totalCards > 0 && (
        <Card className="glass border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">📚 All Cards ({totalCards})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 max-h-[300px] overflow-y-auto">
              <AnimatePresence>
                {flashcards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border ${
                      index === flashcardIndex
                        ? "border-primary/50 bg-primary/10"
                        : "border-transparent hover:border-border"
                    } cursor-pointer transition-all`}
                    onClick={() => {
                      setFlashcardIndex(index)
                      setFlipped(false)
                    }}
                  >
                    <span className="text-xs text-muted-foreground w-6">{index + 1}</span>
                    <span className="flex-1 text-sm truncate">{card.front}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(card.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

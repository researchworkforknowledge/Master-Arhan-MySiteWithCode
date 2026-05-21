"use client"

import { useState } from "react"
import { useStudyStore } from "@/lib/store"
import { callAI, formatAIResponse } from "@/lib/ai"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Edit3, Sparkles, Download, Volume2 } from "lucide-react"
import { toast } from "sonner"

export function NotesSection() {
  const { board, classLevel, subject, notes, addNote, deleteNote } = useStudyStore()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [enhancing, setEnhancing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content")
      return
    }

    addNote({
      title: title.trim(),
      content: content.trim(),
      subject,
    })

    setTitle("")
    setContent("")
    setEditingId(null)
    toast.success("📒 Note saved!")
  }

  const handleEnhance = async () => {
    const input = title.trim() || content.trim()
    if (!input) {
      toast.error("Write something first")
      return
    }

    setEnhancing(true)
    toast.info("✨ Enhancing with AI...")

    try {
      const response = await callAI({
        prompt: `Create structured study notes for: ${title || "the following content"}\n\n${content}`,
        persona: "notes",
        board,
        classLevel,
        subject,
      })

      if (response.success) {
        setContent(response.content)
        toast.success("Notes enhanced!")
      } else {
        toast.error(response.error || "Failed to enhance")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setEnhancing(false)
    }
  }

  const handleReadAloud = () => {
    if (!content.trim()) return

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.rate = 0.92
      speechSynthesis.cancel()
      speechSynthesis.speak(utterance)
      toast.info("🔊 Reading aloud...")
    }
  }

  const handleLoadNote = (note: typeof notes[0]) => {
    setTitle(note.title)
    setContent(note.content)
    setEditingId(note.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleExportPDF = () => {
    if (notes.length === 0) {
      toast.error("No notes to export")
      return
    }

    // Create text content for download
    const textContent = notes
      .map((n) => `${n.title}\n${n.date}\n\n${n.content}\n\n${"=".repeat(50)}\n`)
      .join("\n")

    const blob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `notes_${subject.toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)

    toast.success("📑 Notes exported!")
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
        <h2 className="text-2xl md:text-3xl font-black mb-2">📒 Notes Maker</h2>
        <p className="text-muted-foreground">
          Create structured study notes with AI enhancement for {subject}.
        </p>
      </div>

      {/* Note Editor */}
      <Card className="glass border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Enhanced Notes
            </CardTitle>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
              {editingId ? "Editing" : "New Note"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="bg-secondary/50"
          />

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes here... The AI can enhance them into structured study material."
            className="min-h-[200px] bg-secondary/50"
          />

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave} disabled={!title.trim() || !content.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              {editingId ? "Update" : "Save"} Note
            </Button>

            <Button variant="outline" onClick={handleEnhance} disabled={enhancing}>
              <Sparkles className="h-4 w-4 mr-2" />
              {enhancing ? "Enhancing..." : "AI Enhance"}
            </Button>

            <Button variant="outline" onClick={handleReadAloud} disabled={!content.trim()}>
              <Volume2 className="h-4 w-4 mr-2" />
              Read Aloud
            </Button>

            {editingId && (
              <Button
                variant="ghost"
                onClick={() => {
                  setTitle("")
                  setContent("")
                  setEditingId(null)
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Saved Notes */}
      <Card className="glass border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">📚 Saved Notes ({notes.length})</CardTitle>
            {notes.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No notes yet. Write your first note above!
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <AnimatePresence>
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-all"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{note.date}</p>
                    <h4 className="font-bold mb-2 line-clamp-1">{note.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {note.content}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadNote(note)}
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          deleteNote(note.id)
                          toast.success("Note deleted")
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

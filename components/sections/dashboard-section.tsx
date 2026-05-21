"use client"

import { useStudyStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useState } from "react"
import { Plus, Trash2, Check } from "lucide-react"
import { differenceInDays, format } from "date-fns"

const STAT_CARDS = [
  { key: "studyHours", label: "Study Hrs", emoji: "📖", format: (v: number) => v.toFixed(1) },
  { key: "quizzesDone", label: "Quizzes Done", emoji: "❓" },
  { key: "hwDone", label: "HW Done", emoji: "✅" },
  { key: "dayStreak", label: "Day Streak", emoji: "🔥" },
]

export function DashboardSection() {
  const {
    board,
    classLevel,
    subject,
    stats,
    notes,
    flashcards,
    quickTasks,
    examDate,
    addQuickTask,
    toggleQuickTask,
    deleteQuickTask,
    clearCompletedTasks,
  } = useStudyStore()

  const [newTask, setNewTask] = useState("")

  const handleAddTask = () => {
    if (newTask.trim()) {
      addQuickTask(newTask.trim())
      setNewTask("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }

  // Calculate days until exam
  const daysUntilExam = examDate
    ? differenceInDays(new Date(examDate), new Date())
    : null

  const completedTasks = quickTasks.filter((t) => t.done).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-2">📊 Command Center</h2>
        <p className="text-muted-foreground">
          Board: <strong className="text-foreground">{board}</strong> · Class{" "}
          <strong className="text-foreground">{classLevel}</strong> ·{" "}
          <strong className="text-foreground">{subject}</strong>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CARDS.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass border-border hover:border-primary/30 transition-all hover:-translate-y-1">
              <CardContent className="p-4 text-center">
                <div className="stats-number">
                  {stat.format
                    ? stat.format(stats[stat.key as keyof typeof stats] as number)
                    : stats[stat.key as keyof typeof stats]}
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {stat.emoji} {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-border hover:border-primary/30 transition-all hover:-translate-y-1">
            <CardContent className="p-4 text-center">
              <div className="stats-number">{notes.length}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">📒 Notes</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass border-border hover:border-primary/30 transition-all hover:-translate-y-1">
            <CardContent className="p-4 text-center">
              <div className="stats-number">{flashcards.length}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">🃏 Flashcards</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Exam Countdown */}
      {daysUntilExam !== null && daysUntilExam > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-border">
            <CardContent className="p-4">
              <h3 className="font-bold mb-2">
                📅 <span className="text-primary">{daysUntilExam}</span> days until exam
              </h3>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(5, 100 - daysUntilExam)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Exam date: {format(new Date(examDate!), "MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Tasks */}
      <Card className="glass border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">✅ Quick Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Add Task Input */}
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add quick task..."
              className="flex-1 bg-secondary/50"
            />
            <Button onClick={handleAddTask} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {quickTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tasks yet. Add one above!
              </p>
            ) : (
              quickTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-transparent hover:border-border transition-all ${
                    task.done ? "opacity-50" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleQuickTask(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.done
                        ? "bg-primary border-primary text-white"
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {task.done && <Check className="w-3 h-3" />}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      task.done ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.task}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteQuickTask(task.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))
            )}
          </div>

          {/* Clear Completed */}
          {completedTasks > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={clearCompletedTasks}
            >
              Clear {completedTasks} completed
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

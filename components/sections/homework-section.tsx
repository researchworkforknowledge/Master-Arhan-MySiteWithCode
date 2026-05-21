"use client"

import { useState } from "react"
import { useStudyStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Check, Calendar } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

const PRIORITIES = [
  { value: "high", label: "🔴 High", color: "text-destructive" },
  { value: "medium", label: "🟡 Medium", color: "text-warning" },
  { value: "low", label: "🟢 Low", color: "text-success" },
]

export function HomeworkSection() {
  const { subject, homework, addHomework, toggleHomework, deleteHomework, stats } =
    useStudyStore()

  const [task, setTask] = useState("")
  const [dueDate, setDueDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")

  const handleAdd = () => {
    if (!task.trim()) {
      toast.error("Enter a task description")
      return
    }

    addHomework({
      task: task.trim(),
      dueDate,
      priority,
      subject,
    })

    setTask("")
    toast.success("✅ Homework added!")
  }

  const completedCount = homework.filter((h) => h.done).length
  const pendingCount = homework.filter((h) => !h.done).length

  // Sort: pending first, then by due date
  const sortedHomework = [...homework].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-2">✅ Homework Tracker</h2>
        <p className="text-muted-foreground">
          Keep track of your assignments and never miss a deadline.
        </p>
      </div>

      {/* Add Homework */}
      <Card className="glass border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">➕ Add Homework</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Task description..."
              className="flex-1 bg-secondary/50"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />

            <div className="flex gap-2">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-36 bg-secondary/50"
              />

              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as typeof priority)}
              >
                <SelectTrigger className="w-32 bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">
          ✅ Done: <strong className="text-success">{completedCount}</strong>
        </span>
        <span className="text-muted-foreground">
          📋 Pending: <strong className="text-primary">{pendingCount}</strong>
        </span>
      </div>

      {/* Homework List */}
      <Card className="glass border-border">
        <CardContent className="p-4">
          {homework.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No homework yet. Add a task above!
            </p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {sortedHomework.map((hw) => {
                  const priorityConfig = PRIORITIES.find((p) => p.value === hw.priority)
                  const isOverdue =
                    !hw.done && new Date(hw.dueDate) < new Date(format(new Date(), "yyyy-MM-dd"))

                  return (
                    <motion.div
                      key={hw.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                        hw.done
                          ? "bg-secondary/20 opacity-60"
                          : isOverdue
                            ? "bg-destructive/10 border border-destructive/30"
                            : "bg-secondary/30 border border-transparent hover:border-border"
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleHomework(hw.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                          hw.done
                            ? "bg-success border-success text-white"
                            : "border-muted-foreground hover:border-primary"
                        }`}
                      >
                        {hw.done && <Check className="w-4 h-4" />}
                      </button>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${hw.done ? "line-through text-muted-foreground" : ""}`}
                        >
                          <span className={priorityConfig?.color}>
                            {hw.priority === "high" ? "🔴" : hw.priority === "medium" ? "🟡" : "🟢"}
                          </span>{" "}
                          {hw.task}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(hw.dueDate), "MMM d, yyyy")}
                          {isOverdue && (
                            <span className="text-destructive font-bold ml-2">OVERDUE</span>
                          )}
                        </p>
                      </div>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                        onClick={() => {
                          deleteHomework(hw.id)
                          toast.success("Task deleted")
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

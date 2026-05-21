"use client"

import { useState, useCallback } from "react"
import { useStudyStore } from "@/lib/store"
import { callAI, parseAIJSON } from "@/lib/ai"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Sparkles, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface MindMapData {
  center: string
  branches: Array<{
    label: string
    color: string
    children: string[]
  }>
}

const DEFAULT_COLORS = ["#7c6bef", "#00d4cc", "#ff6eb4", "#ffd166", "#55efc4", "#74b9ff"]

export function MindMapSection() {
  const { board, classLevel, subject } = useStudyStore()
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [mapData, setMapData] = useState<MindMapData | null>(null)

  const generateMindMap = useCallback(async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic first")
      return
    }

    setLoading(true)
    toast.info("🧩 Generating mind map...")

    try {
      const response = await callAI({
        prompt: `Create a mind map for: ${topic}. Keep branch labels short (2-4 words). Sub-items should be specific concepts.`,
        persona: "mm",
        board,
        classLevel,
        subject,
      })

      if (response.success) {
        const data = parseAIJSON<MindMapData>(response.content)
        if (data && data.center && data.branches) {
          setMapData(data)
          toast.success("Mind map generated!")
        } else {
          toast.error("Could not parse mind map. Try again.")
        }
      } else {
        toast.error(response.error || "Failed to generate mind map")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [topic, board, classLevel, subject])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-2">🧩 Mind Maps</h2>
        <p className="text-muted-foreground">
          Visualize concepts and their relationships with AI-generated mind maps.
        </p>
      </div>

      {/* Generate Mind Map */}
      <Card className="glass border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Generate Mind Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (e.g., Photosynthesis, French Revolution)..."
              className="flex-1 bg-secondary/50"
              onKeyDown={(e) => e.key === "Enter" && generateMindMap()}
            />
            <Button
              onClick={generateMindMap}
              disabled={loading || !topic.trim()}
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

      {/* Mind Map Display */}
      {loading && (
        <Card className="glass border-border">
          <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-4">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
              <p className="text-muted-foreground">Creating your mind map...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {mapData && !loading && (
        <Card className="glass border-border overflow-hidden">
          <CardContent className="p-6">
            <div className="relative min-h-[450px] bg-secondary/20 rounded-2xl p-6 overflow-hidden">
              {/* SVG Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {mapData.branches.map((branch, bi) => {
                  const angle = (bi / mapData.branches.length) * 2 * Math.PI - Math.PI / 2
                  const radius = 140
                  const bx = 50 + radius * Math.cos(angle) * 0.35
                  const by = 50 + radius * Math.sin(angle) * 0.5
                  const color = branch.color || DEFAULT_COLORS[bi % DEFAULT_COLORS.length]

                  return (
                    <g key={bi}>
                      {/* Line to branch */}
                      <line
                        x1="50%"
                        y1="50%"
                        x2={`${bx}%`}
                        y2={`${by}%`}
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                      {/* Lines to children */}
                      {branch.children.map((_, ci) => {
                        const childAngle = angle + ((ci - (branch.children.length - 1) / 2) * 0.3)
                        const childRadius = radius * 0.7
                        const cx = bx + childRadius * Math.cos(childAngle) * 0.2
                        const cy = by + childRadius * Math.sin(childAngle) * 0.3

                        return (
                          <line
                            key={ci}
                            x1={`${bx}%`}
                            y1={`${by}%`}
                            x2={`${cx}%`}
                            y2={`${cy}%`}
                            stroke={color}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            opacity="0.4"
                          />
                        )
                      })}
                    </g>
                  )
                })}
              </svg>

              {/* Center Node */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="px-6 py-3 rounded-full bg-gradient-to-br from-primary to-primary-deep text-white font-bold text-center shadow-lg border border-white/20 max-w-[180px]">
                  {mapData.center}
                </div>
              </motion.div>

              {/* Branch Nodes */}
              {mapData.branches.map((branch, bi) => {
                const angle = (bi / mapData.branches.length) * 2 * Math.PI - Math.PI / 2
                const radius = 140
                const bx = 50 + radius * Math.cos(angle) * 0.35
                const by = 50 + radius * Math.sin(angle) * 0.5
                const color = branch.color || DEFAULT_COLORS[bi % DEFAULT_COLORS.length]

                return (
                  <motion.div
                    key={bi}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + bi * 0.1 }}
                    className="absolute"
                    style={{
                      left: `${bx}%`,
                      top: `${by}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className="px-4 py-2 rounded-full font-bold text-sm text-white shadow-md whitespace-nowrap"
                      style={{ backgroundColor: color + "cc" }}
                    >
                      {branch.label}
                    </div>

                    {/* Children */}
                    {branch.children.map((child, ci) => {
                      const childAngle = angle + ((ci - (branch.children.length - 1) / 2) * 0.3)
                      const childRadius = 70
                      const offsetX = childRadius * Math.cos(childAngle)
                      const offsetY = childRadius * Math.sin(childAngle)

                      return (
                        <motion.div
                          key={ci}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4 + bi * 0.1 + ci * 0.05 }}
                          className="absolute"
                          style={{
                            left: `${offsetX}px`,
                            top: `${offsetY}px`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <div
                            className="px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm whitespace-nowrap"
                            style={{ backgroundColor: color + "99" }}
                          >
                            {child}
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!mapData && !loading && (
        <Card className="glass border-border">
          <CardContent className="p-8 text-center">
            <p className="text-4xl mb-4">🧩</p>
            <p className="text-muted-foreground">
              Enter a topic above to generate a visual mind map!
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

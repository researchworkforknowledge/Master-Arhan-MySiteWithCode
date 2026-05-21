"use client"

import { useEffect, useRef, useCallback } from "react"
import { useStudyStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Music, Volume2 } from "lucide-react"
import { toast } from "sonner"

const TIMER_MODES = [
  { value: 25, label: "25 min", description: "Focus" },
  { value: 50, label: "50 min", description: "Deep Work" },
  { value: 10, label: "10 min", description: "Short Break" },
  { value: 5, label: "5 min", description: "Quick Break" },
] as const

export function TimerSection() {
  const {
    timer,
    lofiPlaying,
    setTimerMode,
    setTimerSeconds,
    setTimerRunning,
    resetTimer,
    completeSession,
    setLofiPlaying,
  } = useStudyStore()

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Timer tick
  const tick = useCallback(() => {
    const currentSeconds = useStudyStore.getState().timer.seconds

    if (currentSeconds <= 0) {
      // Timer complete
      setTimerRunning(false)
      completeSession()

      // Play completion sound
      try {
        const audio = new Audio(
          "https://cdn.pixabay.com/download/audio/2022/09/07/audio_edd4bb9ac4.mp3"
        )
        audio.play().catch(() => {})
      } catch {}

      // Show notification
      if (timer.mode >= 25) {
        toast.success("🎉 Session complete! Great work!", {
          description: `+${(timer.mode / 60).toFixed(1)} study hours`,
        })
      } else {
        toast.info("☕ Break's over! Ready for another session?")
      }

      return
    }

    setTimerSeconds(currentSeconds - 1)
  }, [setTimerRunning, setTimerSeconds, completeSession, timer.mode])

  // Handle timer running state
  useEffect(() => {
    if (timer.running) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timer.running, tick])

  const handleStart = () => {
    if (!timer.running) {
      setTimerRunning(true)
      toast.info(`⏱️ ${timer.mode} minute session started!`)
    }
  }

  const handlePause = () => {
    setTimerRunning(false)
    toast.info("⏸️ Timer paused")
  }

  const handleReset = () => {
    resetTimer()
    toast.info("↺ Timer reset")
  }

  const handleModeChange = (mode: 25 | 50 | 10 | 5) => {
    setTimerMode(mode)
  }

  // Calculate progress percentage
  const totalSeconds = timer.mode * 60
  const progressPercent = ((totalSeconds - timer.seconds) / totalSeconds) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-2">⏱️ Pomodoro Timer</h2>
        <p className="text-muted-foreground">
          Focus deeply, take breaks, and track your study sessions.
        </p>
      </div>

      {/* Main Timer Card */}
      <Card className="glass border-border overflow-hidden">
        <CardContent className="p-6 md:p-10 text-center relative">
          {/* Progress Ring Background */}
          <div className="absolute inset-0 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                style={{
                  strokeDasharray: `${progressPercent * 2.83} 283`,
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                }}
              />
            </svg>
          </div>

          {/* Timer Display */}
          <motion.div
            className="timer-display mb-6"
            key={timer.seconds}
            initial={{ scale: 1 }}
            animate={{ scale: timer.running ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: timer.running ? Infinity : 0 }}
          >
            {formatTime(timer.seconds)}
          </motion.div>

          {/* Status Label */}
          <p className="text-muted-foreground mb-6 text-sm">
            {timer.running
              ? "🎯 Focus mode active..."
              : timer.seconds === timer.mode * 60
                ? "Ready to start"
                : "⏸️ Paused"}
          </p>

          {/* Mode Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {TIMER_MODES.map((mode) => (
              <Button
                key={mode.value}
                variant={timer.mode === mode.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeChange(mode.value as 25 | 50 | 10 | 5)}
                disabled={timer.running}
                className="min-w-[80px]"
              >
                {mode.label}
              </Button>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {!timer.running ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-accent-cyan to-primary hover:opacity-90 text-white"
              >
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} size="lg" variant="secondary">
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              disabled={timer.running}
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass border-border">
          <CardContent className="p-4 text-center">
            <div className="stats-number">{timer.sessionsToday}</div>
            <p className="text-xs text-muted-foreground mt-1">Sessions Today</p>
          </CardContent>
        </Card>
        <Card className="glass border-border">
          <CardContent className="p-4 text-center">
            <div className="stats-number">
              {((timer.sessionsToday * timer.mode) / 60).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Hours Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Music Control */}
      <Card className="glass border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Lo-Fi Music</p>
                <p className="text-xs text-muted-foreground">
                  {lofiPlaying ? "Now playing..." : "Tap to play background music"}
                </p>
              </div>
            </div>
            <Button
              variant={lofiPlaying ? "default" : "outline"}
              onClick={() => setLofiPlaying(!lofiPlaying)}
            >
              {lofiPlaying ? (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Playing
                </>
              ) : (
                <>
                  <Music className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="glass border-border border-primary/20">
        <CardContent className="p-4">
          <h3 className="font-bold mb-2 text-sm">💡 Pomodoro Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Work in 25-minute focused bursts</li>
            <li>• Take 5-minute breaks between sessions</li>
            <li>• After 4 sessions, take a longer 15-30 minute break</li>
            <li>• Keep phone away during focus time</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

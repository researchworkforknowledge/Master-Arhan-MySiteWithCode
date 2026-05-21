"use client"

import { useStudyStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BOARDS, CLASSES, SUBJECTS } from "@/lib/constants"
import {
  Menu,
  Moon,
  Sun,
  Music,
  Focus,
  Mic,
  Calendar,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AppHeader() {
  const {
    board,
    classLevel,
    subject,
    theme,
    sidebarOpen,
    lofiPlaying,
    setBoard,
    setClassLevel,
    setSubject,
    setTheme,
    setSidebarOpen,
    setFocusMode,
    setLofiPlaying,
    setActiveSection,
  } = useStudyStore()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-30 h-[var(--header-height)] glass border-b border-border px-4">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveSection("dashboard")}
          >
            <span className="text-2xl">🧠</span>
            <h1 className="text-lg md:text-xl font-black gradient-text hidden sm:block">
              StudyAI Pro
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-semibold">
              ✨ V2
            </span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Context Selectors - Hidden on mobile, shown in context bar */}
          <div className="hidden md:flex items-center gap-2">
            <Select value={board} onValueChange={setBoard}>
              <SelectTrigger className="w-24 h-9 text-xs bg-secondary/50">
                <SelectValue placeholder="Board" />
              </SelectTrigger>
              <SelectContent>
                {BOARDS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={classLevel} onValueChange={setClassLevel}>
              <SelectTrigger className="w-20 h-9 text-xs bg-secondary/50">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-28 h-9 text-xs bg-secondary/50">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="shrink-0"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant={lofiPlaying ? "default" : "secondary"}
            size="icon"
            onClick={() => setLofiPlaying(!lofiPlaying)}
            className={cn(
              "shrink-0",
              lofiPlaying && "bg-accent-cyan text-black hover:bg-accent-cyan/90"
            )}
            aria-label="Toggle music"
          >
            <Music className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setFocusMode(true)}
            className="shrink-0 hidden sm:flex"
            aria-label="Focus mode"
          >
            <Focus className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setActiveSection("doubts")}
            className="shrink-0 hidden sm:flex"
            aria-label="Voice tutor"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Context Bar */}
      <div className="md:hidden flex items-center gap-2 pb-2 -mx-4 px-4 overflow-x-auto no-scrollbar">
        <Select value={board} onValueChange={setBoard}>
          <SelectTrigger className="flex-1 h-8 text-xs bg-secondary/50 min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BOARDS.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={classLevel} onValueChange={setClassLevel}>
          <SelectTrigger className="w-20 h-8 text-xs bg-secondary/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CLASSES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="flex-1 h-8 text-xs bg-secondary/50 min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}

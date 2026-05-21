"use client"

import { useEffect } from "react"
import { useStudyStore } from "@/lib/store"
import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { DashboardSection } from "@/components/sections/dashboard-section"
import { TimerSection } from "@/components/sections/timer-section"
import { AIDoubtsSection } from "@/components/sections/ai-doubts-section"
import { NotesSection } from "@/components/sections/notes-section"
import { FlashcardsSection } from "@/components/sections/flashcards-section"
import { QuizSection } from "@/components/sections/quiz-section"
import { HomeworkSection } from "@/components/sections/homework-section"
import { MindMapSection } from "@/components/sections/mindmap-section"
import { PYQSection } from "@/components/sections/pyq-section"
import { PredictorSection } from "@/components/sections/predictor-section"
import { WeakAreasSection } from "@/components/sections/weak-areas-section"
import { ResourcesSection } from "@/components/sections/resources-section"
import { StrategiesSection } from "@/components/sections/strategies-section"
import { MotivationSection } from "@/components/sections/motivation-section"
import { FormulasSection } from "@/components/sections/formulas-section"
import { FocusOverlay } from "@/components/overlays/focus-overlay"
import { MusicPlayer } from "@/components/features/music-player"
import { cn } from "@/lib/utils"

const SECTIONS: Record<string, React.ComponentType> = {
  dashboard: DashboardSection,
  timer: TimerSection,
  doubts: AIDoubtsSection,
  notes: NotesSection,
  flashcards: FlashcardsSection,
  quiz: QuizSection,
  homework: HomeworkSection,
  mindmap: MindMapSection,
  pyq: PYQSection,
  predictor: PredictorSection,
  "weak-areas": WeakAreasSection,
  resources: ResourcesSection,
  strategies: StrategiesSection,
  motivation: MotivationSection,
  formulas: FormulasSection,
}

export default function StudyAIPro() {
  const { activeSection, sidebarOpen, focusMode, updateStreak, theme } = useStudyStore()

  // Update streak on mount
  useEffect(() => {
    updateStreak()
  }, [updateStreak])

  // Handle theme
  useEffect(() => {
    const root = document.documentElement
    if (theme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", systemDark)
      root.classList.toggle("light", !systemDark)
    } else {
      root.classList.toggle("dark", theme === "dark")
      root.classList.toggle("light", theme === "light")
    }
  }, [theme])

  const ActiveSection = SECTIONS[activeSection] || DashboardSection

  return (
    <div className="min-h-screen bg-background">
      {/* Focus Mode Overlay */}
      {focusMode && <FocusOverlay />}

      {/* Sidebar */}
      <AppSidebar />

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => useStudyStore.getState().setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300 ease-out",
          sidebarOpen ? "md:ml-[var(--sidebar-width)]" : "md:ml-0"
        )}
      >
        {/* Header */}
        <AppHeader />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <ActiveSection />
          </div>
        </main>
      </div>

      {/* Music Player */}
      <MusicPlayer />
    </div>
  )
}

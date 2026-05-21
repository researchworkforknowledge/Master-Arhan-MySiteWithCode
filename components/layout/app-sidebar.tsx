"use client"

import { useStudyStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Timer,
  MessageCircle,
  FileText,
  CreditCard,
  HelpCircle,
  CheckSquare,
  Network,
  ScrollText,
  Compass,
  TrendingDown,
  LinkIcon,
  Target,
  Flame,
  Calculator,
} from "lucide-react"

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, emoji: "📊" },
  { id: "timer", label: "Timer", icon: Timer, emoji: "⏱️", badge: "Pomodoro" },
  { id: "pyq", label: "PYQ & Papers", icon: ScrollText, emoji: "📝" },
  { id: "predictor", label: "CBQ Predictor", icon: Compass, emoji: "🔮" },
  { id: "notes", label: "Notes Maker", icon: FileText, emoji: "📒" },
  { id: "mindmap", label: "Mind Maps", icon: Network, emoji: "🧩" },
  { id: "quiz", label: "Quizzes", icon: HelpCircle, emoji: "❓", badge: "AI" },
  { id: "flashcards", label: "Flash Cards", icon: CreditCard, emoji: "🃏" },
  { id: "formulas", label: "Formulas", icon: Calculator, emoji: "📐" },
  { id: "homework", label: "Homework", icon: CheckSquare, emoji: "✅" },
  { id: "doubts", label: "AI Doubts", icon: MessageCircle, emoji: "💬", badge: "Live" },
  { id: "weak-areas", label: "Weak Areas", icon: TrendingDown, emoji: "📉" },
  { id: "resources", label: "Resources", icon: LinkIcon, emoji: "🔗" },
  { id: "strategies", label: "Strategies", icon: Target, emoji: "🎯" },
  { id: "motivation", label: "Motivation", icon: Flame, emoji: "🔥" },
]

export function AppSidebar() {
  const { sidebarOpen, activeSection, setActiveSection, setSidebarOpen } = useStudyStore()

  const handleNavClick = (id: string) => {
    setActiveSection(id)
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <motion.nav
          initial={{ x: -260 }}
          animate={{ x: 0 }}
          exit={{ x: -260 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed top-0 left-0 h-screen w-[var(--sidebar-width)] z-50",
            "glass-strong border-r border-border",
            "flex flex-col pt-[calc(var(--header-height)+1rem)] pb-4 px-2",
            "overflow-y-auto scrollbar-thin"
          )}
        >
          {/* Navigation Items */}
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl",
                    "text-sm font-medium transition-all duration-200",
                    "hover:bg-primary/10",
                    isActive
                      ? "bg-primary/20 text-foreground font-bold border border-primary/40 glow-primary nav-active"
                      : "text-muted-foreground border border-transparent"
                  )}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-accent-pink text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 px-2">
            <div className="text-center text-xs text-muted-foreground">
              <p className="font-medium">Built by Master Arhan</p>
              <p className="opacity-70 mt-1">v2.0 • Made with 💜</p>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

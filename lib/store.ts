import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

// Types
export interface Note {
  id: string
  title: string
  content: string
  date: string
  subject: string
}

export interface Homework {
  id: string
  task: string
  dueDate: string
  priority: "high" | "medium" | "low"
  done: boolean
  subject: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
  lastReviewed?: string
  confidence: number // 0-5 spaced repetition
}

export interface WeakTopic {
  id: string
  topic: string
  subject: string
  addedDate: string
}

export interface QuickTask {
  id: string
  task: string
  done: boolean
  date: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  persona?: string
}

export interface TimerState {
  seconds: number
  mode: 25 | 50 | 10 | 5 // Pomodoro durations
  running: boolean
  sessionsToday: number
}

export interface Stats {
  studyHours: number
  quizzesDone: number
  hwDone: number
  dayStreak: number
  totalSessions: number
  lastActiveDate: string | null
}

export interface StudySession {
  date: string
  hours: number
  sessions: number
}

export type AIPersona =
  | "doubts"
  | "notes"
  | "pyq"
  | "pred"
  | "weak"
  | "mm"
  | "quiz"
  | "strat"
  | "motiv"
  | "summarize"
  | "eli5"

export interface StudyState {
  // User Context
  board: string
  classLevel: string
  subject: string
  examDate: string | null
  theme: "light" | "dark" | "system"

  // Data Collections
  notes: Note[]
  homework: Homework[]
  flashcards: Flashcard[]
  weakTopics: WeakTopic[]
  quickTasks: QuickTask[]
  chatHistory: Record<AIPersona, ChatMessage[]>

  // Timer
  timer: TimerState

  // Stats
  stats: Stats
  sessions: Record<string, StudySession>

  // UI State
  sidebarOpen: boolean
  activeSection: string
  flashcardIndex: number
  focusMode: boolean
  lofiPlaying: boolean
  currentVibe: number
  currentTrack: number
  focusTask: string

  // Actions - Context
  setBoard: (board: string) => void
  setClassLevel: (classLevel: string) => void
  setSubject: (subject: string) => void
  setExamDate: (date: string | null) => void
  setTheme: (theme: "light" | "dark" | "system") => void

  // Actions - Notes
  addNote: (note: Omit<Note, "id" | "date">) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void

  // Actions - Homework
  addHomework: (hw: Omit<Homework, "id" | "done">) => void
  toggleHomework: (id: string) => void
  deleteHomework: (id: string) => void

  // Actions - Flashcards
  addFlashcard: (fc: Omit<Flashcard, "id" | "confidence">) => void
  updateFlashcardConfidence: (id: string, confidence: number) => void
  deleteFlashcard: (id: string) => void
  setFlashcardIndex: (index: number) => void
  importFlashcards: (flashcards: Flashcard[]) => void

  // Actions - Weak Topics
  addWeakTopic: (topic: string, subject: string) => void
  deleteWeakTopic: (id: string) => void

  // Actions - Quick Tasks
  addQuickTask: (task: string) => void
  toggleQuickTask: (id: string) => void
  deleteQuickTask: (id: string) => void
  clearCompletedTasks: () => void

  // Actions - Chat
  addChatMessage: (persona: AIPersona, message: Omit<ChatMessage, "id" | "timestamp">) => void
  clearChat: (persona: AIPersona) => void

  // Actions - Timer
  setTimerMode: (mode: 25 | 50 | 10 | 5) => void
  setTimerSeconds: (seconds: number) => void
  setTimerRunning: (running: boolean) => void
  resetTimer: () => void
  completeSession: () => void

  // Actions - Stats
  addStudyHours: (hours: number) => void
  incrementQuizzes: () => void
  updateStreak: () => void

  // Actions - UI
  setSidebarOpen: (open: boolean) => void
  setActiveSection: (section: string) => void
  setFocusMode: (enabled: boolean) => void
  setLofiPlaying: (playing: boolean) => void
  setCurrentVibe: (vibe: number) => void
  setCurrentTrack: (track: number) => void
  setFocusTask: (task: string) => void

  // Utility
  reset: () => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)
const getToday = () => new Date().toISOString().split("T")[0]

const initialState = {
  // User Context
  board: "CBSE",
  classLevel: "10",
  subject: "Mathematics",
  examDate: null,
  theme: "dark" as const,

  // Data Collections
  notes: [],
  homework: [],
  flashcards: [],
  weakTopics: [],
  quickTasks: [],
  chatHistory: {
    doubts: [],
    notes: [],
    pyq: [],
    pred: [],
    weak: [],
    mm: [],
    quiz: [],
    strat: [],
    motiv: [],
    summarize: [],
    eli5: [],
  },

  // Timer
  timer: {
    seconds: 25 * 60,
    mode: 25 as const,
    running: false,
    sessionsToday: 0,
  },

  // Stats
  stats: {
    studyHours: 0,
    quizzesDone: 0,
    hwDone: 0,
    dayStreak: 0,
    totalSessions: 0,
    lastActiveDate: null,
  },
  sessions: {},

  // UI State
  sidebarOpen: true,
  activeSection: "dashboard",
  flashcardIndex: 0,
  focusMode: false,
  lofiPlaying: false,
  currentVibe: 0,
  currentTrack: 0,
  focusTask: "",
}

export const useStudyStore = create<StudyState>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // Context Actions
      setBoard: (board) => set((state) => { state.board = board }),
      setClassLevel: (classLevel) => set((state) => { state.classLevel = classLevel }),
      setSubject: (subject) => set((state) => { state.subject = subject }),
      setExamDate: (date) => set((state) => { state.examDate = date }),
      setTheme: (theme) => set((state) => { state.theme = theme }),

      // Notes Actions
      addNote: (note) =>
        set((state) => {
          state.notes.unshift({
            id: generateId(),
            date: new Date().toLocaleDateString(),
            ...note,
          })
        }),

      updateNote: (id, updates) =>
        set((state) => {
          const index = state.notes.findIndex((n) => n.id === id)
          if (index !== -1) {
            Object.assign(state.notes[index], updates)
          }
        }),

      deleteNote: (id) =>
        set((state) => {
          state.notes = state.notes.filter((n) => n.id !== id)
        }),

      // Homework Actions
      addHomework: (hw) =>
        set((state) => {
          state.homework.unshift({
            id: generateId(),
            done: false,
            ...hw,
          })
        }),

      toggleHomework: (id) =>
        set((state) => {
          const hw = state.homework.find((h) => h.id === id)
          if (hw) {
            hw.done = !hw.done
            if (hw.done) {
              state.stats.hwDone += 1
            } else {
              state.stats.hwDone = Math.max(0, state.stats.hwDone - 1)
            }
          }
        }),

      deleteHomework: (id) =>
        set((state) => {
          const hw = state.homework.find((h) => h.id === id)
          if (hw?.done) {
            state.stats.hwDone = Math.max(0, state.stats.hwDone - 1)
          }
          state.homework = state.homework.filter((h) => h.id !== id)
        }),

      // Flashcard Actions
      addFlashcard: (fc) =>
        set((state) => {
          state.flashcards.push({
            id: generateId(),
            confidence: 0,
            ...fc,
          })
        }),

      updateFlashcardConfidence: (id, confidence) =>
        set((state) => {
          const fc = state.flashcards.find((f) => f.id === id)
          if (fc) {
            fc.confidence = confidence
            fc.lastReviewed = new Date().toISOString()
          }
        }),

      deleteFlashcard: (id) =>
        set((state) => {
          state.flashcards = state.flashcards.filter((f) => f.id !== id)
        }),

      setFlashcardIndex: (index) => set((state) => { state.flashcardIndex = index }),

      importFlashcards: (flashcards) =>
        set((state) => {
          state.flashcards = flashcards
        }),

      // Weak Topics Actions
      addWeakTopic: (topic, subject) =>
        set((state) => {
          state.weakTopics.push({
            id: generateId(),
            topic,
            subject,
            addedDate: getToday(),
          })
        }),

      deleteWeakTopic: (id) =>
        set((state) => {
          state.weakTopics = state.weakTopics.filter((w) => w.id !== id)
        }),

      // Quick Tasks Actions
      addQuickTask: (task) =>
        set((state) => {
          state.quickTasks.unshift({
            id: generateId(),
            task,
            done: false,
            date: getToday(),
          })
        }),

      toggleQuickTask: (id) =>
        set((state) => {
          const task = state.quickTasks.find((t) => t.id === id)
          if (task) task.done = !task.done
        }),

      deleteQuickTask: (id) =>
        set((state) => {
          state.quickTasks = state.quickTasks.filter((t) => t.id !== id)
        }),

      clearCompletedTasks: () =>
        set((state) => {
          state.quickTasks = state.quickTasks.filter((t) => !t.done)
        }),

      // Chat Actions
      addChatMessage: (persona, message) =>
        set((state) => {
          if (!state.chatHistory[persona]) {
            state.chatHistory[persona] = []
          }
          state.chatHistory[persona].push({
            id: generateId(),
            timestamp: new Date().toISOString(),
            ...message,
          })
        }),

      clearChat: (persona) =>
        set((state) => {
          state.chatHistory[persona] = []
        }),

      // Timer Actions
      setTimerMode: (mode) =>
        set((state) => {
          state.timer.mode = mode
          state.timer.seconds = mode * 60
          state.timer.running = false
        }),

      setTimerSeconds: (seconds) =>
        set((state) => {
          state.timer.seconds = seconds
        }),

      setTimerRunning: (running) =>
        set((state) => {
          state.timer.running = running
        }),

      resetTimer: () =>
        set((state) => {
          state.timer.seconds = state.timer.mode * 60
          state.timer.running = false
        }),

      completeSession: () =>
        set((state) => {
          const today = getToday()
          state.timer.sessionsToday += 1
          state.stats.totalSessions += 1
          
          // Add study hours based on mode
          const hoursToAdd = state.timer.mode / 60
          state.stats.studyHours += hoursToAdd

          // Update daily session
          if (!state.sessions[today]) {
            state.sessions[today] = { date: today, hours: 0, sessions: 0 }
          }
          state.sessions[today].hours += hoursToAdd
          state.sessions[today].sessions += 1

          // Update streak
          get().updateStreak()
        }),

      // Stats Actions
      addStudyHours: (hours) =>
        set((state) => {
          state.stats.studyHours += hours
          const today = getToday()
          if (!state.sessions[today]) {
            state.sessions[today] = { date: today, hours: 0, sessions: 0 }
          }
          state.sessions[today].hours += hours
        }),

      incrementQuizzes: () =>
        set((state) => {
          state.stats.quizzesDone += 1
        }),

      updateStreak: () =>
        set((state) => {
          const today = getToday()
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split("T")[0]

          if (state.stats.lastActiveDate === today) {
            // Already updated today
            return
          }

          if (state.stats.lastActiveDate === yesterdayStr) {
            // Consecutive day
            state.stats.dayStreak += 1
          } else if (state.stats.lastActiveDate !== today) {
            // Streak broken, start fresh
            state.stats.dayStreak = 1
          }

          state.stats.lastActiveDate = today
        }),

      // UI Actions
      setSidebarOpen: (open) => set((state) => { state.sidebarOpen = open }),
      setActiveSection: (section) => set((state) => { state.activeSection = section }),
      setFocusMode: (enabled) => set((state) => { state.focusMode = enabled }),
      setLofiPlaying: (playing) => set((state) => { state.lofiPlaying = playing }),
      setCurrentVibe: (vibe) => set((state) => { state.currentVibe = vibe }),
      setCurrentTrack: (track) => set((state) => { state.currentTrack = track }),
      setFocusTask: (task) => set((state) => { state.focusTask = task }),

      // Reset
      reset: () => set(initialState),
    })),
    {
      name: "studyai-pro-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist everything except running state
        board: state.board,
        classLevel: state.classLevel,
        subject: state.subject,
        examDate: state.examDate,
        theme: state.theme,
        notes: state.notes,
        homework: state.homework,
        flashcards: state.flashcards,
        weakTopics: state.weakTopics,
        quickTasks: state.quickTasks,
        chatHistory: state.chatHistory,
        timer: { ...state.timer, running: false },
        stats: state.stats,
        sessions: state.sessions,
        flashcardIndex: state.flashcardIndex,
        currentVibe: state.currentVibe,
        currentTrack: state.currentTrack,
        focusTask: state.focusTask,
      }),
    }
  )
)

// Selectors for performance
export const useBoard = () => useStudyStore((s) => s.board)
export const useClassLevel = () => useStudyStore((s) => s.classLevel)
export const useSubject = () => useStudyStore((s) => s.subject)
export const useStats = () => useStudyStore((s) => s.stats)
export const useTimer = () => useStudyStore((s) => s.timer)
export const useNotes = () => useStudyStore((s) => s.notes)
export const useHomework = () => useStudyStore((s) => s.homework)
export const useFlashcards = () => useStudyStore((s) => s.flashcards)
export const useActiveSection = () => useStudyStore((s) => s.activeSection)
export const useSidebarOpen = () => useStudyStore((s) => s.sidebarOpen)

'use client'
import { create } from 'zustand'

interface SetLogEntry {
  exerciseId: string
  setNumber: number
  weightKg: number
  repsDone: number
  completed: boolean
}

interface SessionState {
  sessionId: string | null
  workoutId: string | null
  currentExerciseIndex: number
  currentSetIndex: number
  setLogs: SetLogEntry[]
  timerActive: boolean
  timerSeconds: number
  timerEndTime: number   // timestamp absoluto — permite retomar após tela bloqueada
  setSessionId: (id: string) => void
  setWorkoutId: (id: string) => void
  setCurrentExercise: (index: number) => void
  setCurrentSet: (index: number) => void
  addSetLog: (log: SetLogEntry) => void
  startTimer: (seconds: number) => void
  stopTimer: () => void
  decrementTimer: () => void
  resetSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  workoutId: null,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  setLogs: [],
  timerActive: false,
  timerSeconds: 0,
  timerEndTime: 0,
  setSessionId: (id) => set({ sessionId: id }),
  setWorkoutId: (id) => set({ workoutId: id }),
  setCurrentExercise: (index) => set({ currentExerciseIndex: index }),
  setCurrentSet: (index) => set({ currentSetIndex: index }),
  addSetLog: (log) => set((state) => ({ setLogs: [...state.setLogs, log] })),
  startTimer: (seconds) => set({ timerActive: true, timerSeconds: seconds, timerEndTime: Date.now() + seconds * 1000 }),
  stopTimer: () => set({ timerActive: false, timerSeconds: 0, timerEndTime: 0 }),
  decrementTimer: () => set((state) => ({
    timerSeconds: state.timerSeconds > 0 ? state.timerSeconds - 1 : 0,
    timerActive: state.timerSeconds > 1,
  })),
  resetSession: () => set({
    sessionId: null,
    workoutId: null,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    setLogs: [],
    timerActive: false,
    timerSeconds: 0,
    timerEndTime: 0,
  }),
}))

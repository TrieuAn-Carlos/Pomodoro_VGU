import { create } from 'zustand'

export const useTimerStore = create((set) => ({
  timeLeft: 25 * 60,
  duration: 25 * 60,
  isRunning: false,
  isPaused: false,
  subject: null, // Current active subject
  mode: 'focus', // 'focus', 'short_break', 'long_break'
  sessionId: null,

  setTimeLeft: (time) => set({ timeLeft: time }),
  setDuration: (duration) => set({ duration }),
  setRunning: (running) => set({ isRunning: running }),
  setPaused: (paused) => set({ isPaused: paused }),
  setSubject: (subject) => set({ subject }),
  setMode: (mode) => set({ mode }),
  setSessionId: (id) => set({ sessionId: id }),

  resetTimer: () => set((state) => ({ 
    timeLeft: state.duration, 
    isRunning: false,
    isPaused: false 
  })),

  startTimer: () => set({ isRunning: true, isPaused: false }),
  pauseTimer: () => set({ isRunning: false, isPaused: true }),
  stopTimer: () => set((state) => ({ 
    isRunning: false, 
    isPaused: false,
    timeLeft: state.duration,
    sessionId: null
  })),
}))

import { create } from 'zustand'

export const useTimerStore = create((set) => ({
  // Default durations in seconds
  durations: {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  },

  timeLeft: 25 * 60,
  duration: 25 * 60,
  isRunning: false,
  isPaused: false,
  subject: null, // Current active subject
  mode: 'focus', // 'focus', 'shortBreak', 'longBreak'
  sessionId: null,

  setTimeLeft: (time) => set({ timeLeft: time }),

  // Update durations configuration
  setDurations: (newDurations) => set((state) => ({
    durations: { ...state.durations, ...newDurations }
  })),

  setRunning: (running) => set({ isRunning: running }),
  setPaused: (paused) => set({ isPaused: paused }),
  setSubject: (subject) => set({ subject }),
  setSessionId: (id) => set({ sessionId: id }),

  // Switch mode and reset timer to that mode's duration
  setMode: (mode) => set((state) => {
    const newDuration = state.durations[mode];
    return {
      mode,
      duration: newDuration,
      timeLeft: newDuration,
      isRunning: false,
      isPaused: false
    }
  }),

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

import { useState, useEffect, useCallback } from 'react'
import { useTimerStore } from '../store/timerStore'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import TimerDisplay from '../components/TimerDisplay'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Play, Coffee, Brain, Moon, Volume2 } from 'lucide-react'

export default function Timer() {
  const { 
    timeLeft, isRunning, isPaused, subject, sessionId, mode, duration,
    startTimer, pauseTimer, stopTimer, setTimeLeft, setSessionId, setSubject, setMode
  } = useTimerStore()
  
  const { subjects, fetchSubjects, addSession, updateSession } = useDataStore()
  const { user } = useAuthStore()
  
  const [selectedSubjectId, setSelectedSubjectId] = useState('')

  useEffect(() => {
    if (user && subjects.length === 0) fetchSubjects()
  }, [user, subjects.length, fetchSubjects])

  const playNotificationSound = useCallback(() => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
    audio.play().catch(e => console.error(e))
  }, [])

  const handleComplete = useCallback(async () => {
    stopTimer()
    if (sessionId) {
      await updateSession(sessionId, {
        end_time: new Date().toISOString(),
        duration: duration, // Use the full duration setting
        completed: true
      })
    }
    playNotificationSound()
    // Optional: Show a modal or toast here
    if (window.confirm('Session Completed! Start a break?')) {
        setMode('shortBreak')
    }
  }, [sessionId, stopTimer, updateSession, duration, playNotificationSound, setMode])

  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      handleComplete()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, setTimeLeft, handleComplete])

  const handleStart = async () => {
    if (mode === 'focus' && !selectedSubjectId) {
      alert('Please select a subject first!')
      return
    }
    
    if (!sessionId) {
      const newSession = await addSession({
        user_id: user.id,
        subject_id: mode === 'focus' ? selectedSubjectId : null, // Breaks might not have subjects
        type: mode,
        duration: 0, // Placeholder until complete
        start_time: new Date().toISOString(),
        completed: false
      })
      setSessionId(newSession.id)
      if (mode === 'focus') {
          setSubject(subjects.find(s => s.id === selectedSubjectId))
      }
    }
    
    startTimer()
  }

  const handlePause = () => {
    pauseTimer()
  }

  const handleReset = () => {
      stopTimer()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 relative pb-20">

      {/* Mode Switcher */}
      <GlassCard className="flex items-center p-1.5 gap-1 rounded-full bg-secondary/50 backdrop-blur-md border-border/50">
        <button
            onClick={() => { setMode('focus'); handleReset() }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                mode === 'focus' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`}
        >
            <Brain className="w-4 h-4" /> Focus
        </button>
        <button
            onClick={() => { setMode('shortBreak'); handleReset() }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                mode === 'shortBreak' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`}
        >
            <Coffee className="w-4 h-4" /> Short Break
        </button>
        <button
            onClick={() => { setMode('longBreak'); handleReset() }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                mode === 'longBreak' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`}
        >
            <Moon className="w-4 h-4" /> Long Break
        </button>
      </GlassCard>

      {/* Main Timer */}
      <div className="relative z-10">
        <TimerDisplay 
          timeLeft={timeLeft}
          duration={duration}
          isRunning={isRunning}
          mode={mode}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />
      </div>

      {/* Subject Selector (Only for Focus Mode) */}
      <div className={`w-full max-w-md transition-all duration-500 ${mode === 'focus' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="relative">
            <select
            value={selectedSubjectId}
            onChange={(e) => {
                setSelectedSubjectId(e.target.value)
                setSubject(subjects.find(s => s.id === e.target.value))
            }}
            disabled={isRunning || isPaused}
            className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer hover:border-primary/50"
            >
            <option value="" disabled>Select a subject to focus on...</option>
            {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <Volume2 className="w-4 h-4 opacity-50" />
            </div>
        </div>

        {subjects.length === 0 && (
             <p className="text-center text-xs text-muted-foreground mt-2">
                 No subjects found. <a href="/subjects" className="text-primary hover:underline">Create one</a> first.
             </p>
        )}
      </div>

      {/* Ambient Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { useTimerStore } from '../store/timerStore'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import TimerDisplay from '../components/TimerDisplay'
import { AnimatePresence } from 'framer-motion'

export default function Timer() {
  const { 
    timeLeft, isRunning, isPaused, subject, sessionId, 
    startTimer, pauseTimer, stopTimer, setTimeLeft, setSessionId, setSubject 
  } = useTimerStore()
  
  const { subjects, fetchSubjects, addSession, updateSession } = useDataStore()
  const { user } = useAuthStore()
  
  const [selectedSubjectId, setSelectedSubjectId] = useState('')

  useEffect(() => {
    if (user && subjects.length === 0) fetchSubjects()
  }, [user, fetchSubjects, subjects.length]) // Added dependencies

  const playNotificationSound = useCallback(() => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
    audio.play().catch(e => console.error(e))
  }, [])

  const handleComplete = useCallback(async () => {
    stopTimer()
    if (sessionId) {
      await updateSession(sessionId, {
        end_time: new Date().toISOString(),
        duration: 25 * 60,
        completed: true
      })
    }
    playNotificationSound()
    alert('Session Completed! Great job!')
  }, [sessionId, stopTimer, updateSession, playNotificationSound])

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
    if (!selectedSubjectId) {
      alert('Please select a subject first!')
      return
    }
    
    if (!sessionId) {
      const newSession = await addSession({
        user_id: user.id,
        subject_id: selectedSubjectId,
        type: 'focus',
        duration: 0,
        start_time: new Date().toISOString(),
        completed: false
      })
      setSessionId(newSession.id)
      setSubject(subjects.find(s => s.id === selectedSubjectId))
    }
    
    startTimer()
  }

  const handlePause = () => {
    pauseTimer()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-slate-400 mb-2">Select Subject</label>
        <select
          value={selectedSubjectId}
          onChange={(e) => {
            setSelectedSubjectId(e.target.value)
            setSubject(subjects.find(s => s.id === e.target.value))
          }}
          disabled={isRunning || isPaused}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>Choose a subject...</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full animate-pulse" />
        
        <TimerDisplay 
          timeLeft={timeLeft}
          duration={25 * 60}
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={stopTimer}
          subjectColor={subject?.color || '#6366f1'}
        />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">{subject ? subject.name : 'Ready to Focus?'}</h2>
        <p className="text-slate-400">
          {isRunning ? 'Keep going! You are doing great.' : 'Select a subject and start the timer.'}
        </p>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from './ui/Button'

export default function TimerDisplay({ 
  timeLeft, 
  duration, 
  isRunning, 
  mode,
  onStart, 
  onPause, 
  onReset
}) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  // Color mapping based on mode
  const modeColors = {
    focus: 'stroke-primary',
    shortBreak: 'stroke-teal-500',
    longBreak: 'stroke-blue-500'
  }

  const strokeColor = modeColors[mode] || 'stroke-primary'

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative w-80 h-80 flex items-center justify-center group">
        {/* Outer Glow */}
        <div className={`absolute inset-0 rounded-full blur-[60px] opacity-20 transition-colors duration-500 ${
            mode === 'focus' ? 'bg-primary' :
            mode === 'shortBreak' ? 'bg-teal-500' : 'bg-blue-500'
        }`} />

        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            className="stroke-muted/30"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            className={`${strokeColor} transition-colors duration-500`}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: timeLeft / duration }}
            transition={{ duration: 0.5, ease: "linear" }}
            style={{
              strokeDasharray: 2 * Math.PI * 140,
              filter: 'drop-shadow(0 0 8px currentColor)'
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span 
            key={formattedTime}
            initial={{ opacity: 0.8, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl font-bold tracking-tighter text-white font-mono"
          >
            {formattedTime}
          </motion.span>
          <span className="text-muted-foreground mt-4 font-medium tracking-[0.2em] uppercase text-xs">
            {mode === 'focus' ? 'Focus Mode' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-12 z-10">
        {!isRunning ? (
          <Button
            onClick={onStart}
            size="lg"
            className="h-16 w-16 rounded-full p-0 shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-transform"
          >
            <Play className="w-6 h-6 fill-current ml-1" />
          </Button>
        ) : (
          <Button
            onClick={onPause}
            size="lg"
            variant="secondary"
            className="h-16 w-16 rounded-full p-0 hover:bg-yellow-500/20 hover:text-yellow-500 hover:scale-110 active:scale-95 transition-all border-none"
          >
            <Pause className="w-6 h-6 fill-current" />
          </Button>
        )}

        <Button
          onClick={onReset}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-destructive/10 hover:text-destructive"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

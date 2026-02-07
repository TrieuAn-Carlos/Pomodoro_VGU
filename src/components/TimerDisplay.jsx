import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function TimerDisplay({ 
  timeLeft, 
  duration, 
  isRunning, 
  onStart, 
  onPause, 
  onReset,
  subjectColor = '#6366f1' 
}) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative w-80 h-80 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="140"
            className="stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            stroke={subjectColor}
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: timeLeft / duration }}
            transition={{ duration: 0.5, ease: "linear" }}
            style={{
              strokeDasharray: 2 * Math.PI * 140,
              strokeDashoffset: 2 * Math.PI * 140 * (1 - timeLeft / duration)
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            key={formattedTime}
            initial={{ opacity: 0.5, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-bold tracking-tighter text-white font-mono"
          >
            {formattedTime}
          </motion.span>
          <span className="text-slate-400 mt-2 font-medium tracking-wide uppercase text-sm">Focus Mode</span>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-12">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="p-6 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 group"
          >
            <Play className="w-8 h-8 fill-current group-hover:text-cyan-400 transition-colors" />
          </button>
        ) : (
          <button
            onClick={onPause}
            className="p-6 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 group"
          >
            <Pause className="w-8 h-8 fill-current group-hover:text-yellow-400 transition-colors" />
          </button>
        )}

        <button
          onClick={onReset}
          className="p-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-full transition-colors border border-slate-800"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

export function GlassCard({ children, className, hoverEffect = false, ...props }) {
  return (
    <div
      className={twMerge(clsx(
        "relative overflow-hidden bg-card/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-sm",
        hoverEffect && "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group",
        className
      ))}
      {...props}
    >
      {/* Optional: subtle gradient overlay */}
      <div className={clsx(
        "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none transition-opacity duration-500",
        hoverEffect ? "opacity-0 group-hover:opacity-100" : "opacity-0"
      )} />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}

import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-primary",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
  }

  const sizes = {
    sm: "h-9 px-3 text-xs rounded-lg",
    md: "h-11 px-6 text-sm rounded-xl",
    lg: "h-14 px-8 text-base rounded-2xl",
    icon: "h-10 w-10 p-2 rounded-xl flex items-center justify-center"
  }

  return (
    <button
      className={twMerge(clsx(
        "inline-flex items-center justify-center font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background gap-2 whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      ))}
      {...props}
    >
      {children}
    </button>
  )
}

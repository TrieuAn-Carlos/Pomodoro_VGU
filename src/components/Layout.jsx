import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Timer, BookOpen, BarChart2, Settings, User, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { clsx } from 'clsx'
import { AnimatePresence } from 'framer-motion'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Timer, label: 'Timer', path: '/timer' },
  { icon: BookOpen, label: 'Subjects', path: '/subjects' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
]

const NavContent = ({ setIsMobileMenuOpen }) => {
  const { user, signOut } = useAuthStore()
  const location = useLocation()

  return (
    <>
      <div className="p-6 border-b border-slate-800 flex items-center justify-between md:justify-start gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">
            S
          </div>
          <span className="font-bold text-lg tracking-tight text-white">StudyFlow</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="md:hidden text-slate-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
              isActive 
                ? "bg-slate-800/50 text-white shadow-inner border border-slate-700/50" 
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/30"
            )}
          >
            <item.icon className={clsx("w-5 h-5 transition-colors", location.pathname === item.path ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400")} />
            <span className="font-medium relative z-10">{item.label}</span>
            {location.pathname === item.path && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-r-full" />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-slate-200">{user?.email}</p>
            <button 
              onClick={() => signOut()}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors mt-0.5"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex-col hidden md:flex z-20">
        <NavContent setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-50 md:hidden flex flex-col"
            >
              <NavContent setIsMobileMenuOpen={setIsMobileMenuOpen} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 relative overflow-hidden flex flex-col bg-slate-950">
        <header className="md:hidden h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
               S
             </div>
             <span className="font-bold text-lg tracking-tight text-white">StudyFlow</span>
           </div>
           <button 
             onClick={() => setIsMobileMenuOpen(true)}
             className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
           >
             <Menu className="w-6 h-6" />
           </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent p-4 md:p-8">
           <Outlet />
        </div>
      </main>
    </div>
  )
}

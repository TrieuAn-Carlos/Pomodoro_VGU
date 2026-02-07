import { useEffect } from 'react'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Clock, Calendar, Zap, Play, ChevronRight, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { stats, recentSessions, subjects, fetchDashboardStats, fetchRecentSessions, fetchSubjects } = useDataStore()

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
      fetchRecentSessions()
      fetchSubjects()
    }
  }, [user])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1">
            {greeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">{user?.user_metadata?.full_name?.split(' ')[0] || 'Scholar'}</span>
          </h1>
          <p className="text-muted-foreground text-lg">Ready to make progress today?</p>
        </div>
        <GlassCard className="flex items-center gap-3 px-4 py-2 bg-card/40 border-primary/20">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">{format(new Date(), 'EEEE, MMMM do')}</span>
        </GlassCard>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hoverEffect className="p-6 flex flex-col justify-between h-40 group">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today's Focus</span>
          </div>
          <div>
            <div className="text-4xl font-bold text-white tracking-tight">
              {stats.today}<span className="text-lg text-muted-foreground ml-1 font-medium">min</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
               {stats.today > 0 ? 'Great start!' : 'Start your first session'}
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect className="p-6 flex flex-col justify-between h-40 group">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Streak</span>
          </div>
          <div>
            <div className="text-4xl font-bold text-white tracking-tight">
              {stats.streak}<span className="text-lg text-muted-foreground ml-1 font-medium">days</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Consistency is key
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect className="p-6 flex flex-col justify-between h-40 group">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Weekly Total</span>
          </div>
          <div>
            <div className="text-4xl font-bold text-white tracking-tight">
              {Math.round(stats.week / 60)}<span className="text-lg text-muted-foreground ml-1 font-medium">hrs</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {stats.week % 60} minutes
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <GlassCard className="lg:col-span-2 p-8 min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Activity Overview</h3>
            <select className="bg-secondary text-sm rounded-lg px-3 py-1 outline-none border border-white/5">
              <option>This Week</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyActivity}>
                <XAxis
                  dataKey="name"
                  stroke="#52525b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}m`}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border p-3 rounded-xl shadow-xl">
                          <p className="text-foreground font-medium mb-1">{payload[0].payload.name}</p>
                          <p className="text-primary text-sm font-bold">
                            {payload[0].value} minutes
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="minutes" radius={[6, 6, 6, 6]} barSize={40}>
                  {stats.dailyActivity?.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.minutes > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Sidebar: Recent & Quick Start */}
        <div className="space-y-6">
            {/* Quick Start Card */}
            <GlassCard className="p-6 bg-gradient-to-br from-primary/20 via-card/60 to-card/60 border-primary/20">
                <h3 className="text-lg font-bold text-white mb-4">Quick Focus</h3>
                <p className="text-muted-foreground text-sm mb-6">Pick a subject and start a 25m session instantly.</p>

                <div className="space-y-3">
                    {subjects.slice(0, 3).map(subject => (
                        <Link to="/timer" key={subject.id} className="block">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-card/50 hover:bg-primary/20 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                                    <span className="text-sm font-medium text-foreground group-hover:text-white">{subject.name}</span>
                                </div>
                                <Play className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                            </div>
                        </Link>
                    ))}
                    <Link to="/timer">
                        <Button className="w-full mt-4" variant="primary">
                            Open Timer <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </GlassCard>

            {/* Recent Activity List */}
            <GlassCard className="p-6 h-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                </div>

                <div className="space-y-4">
                    {recentSessions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No recent activity.
                        </div>
                    ) : (
                        recentSessions.slice(0, 5).map((session) => (
                            <div key={session.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                        {session.type === 'focus' ? <Clock className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{session.subjects?.name || 'Unknown Subject'}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(session.start_time), 'MMM d, h:mm a')}</p>
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-white">
                                    {Math.round(session.duration / 60)}m
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  )
}

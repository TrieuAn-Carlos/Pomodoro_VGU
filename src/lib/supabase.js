import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://spekxvzmdiixmimyqrux.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWt4dnptZGlpeG1pbXlxcnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzgwODUsImV4cCI6MjA4NjA1NDA4NX0.QjHLVC3vP6tMlPWATrsnpFfwPHD0Ciwsmo2G__OzMw8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

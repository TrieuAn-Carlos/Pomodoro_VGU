import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect } from 'react'

export default function ProtectedRoute() {
  const { user, loading } = useAuthStore()

  if (loading) return <div>Loading...</div>

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

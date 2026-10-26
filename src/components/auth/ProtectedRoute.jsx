import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageLoader } from '../ui/Spinner'

export function RequireAuth({ children }) {
  const { isLoggedIn, loading } = useAuth()
  const location = useLocation()
  if (loading)     return <PageLoader />
  if (!isLoggedIn) return <Navigate to="/" state={{ from: location }} replace />
  return children
}

export function RequireAdmin({ children }) {
  const { isAdmin, isLoggedIn, loading } = useAuth()
  const location = useLocation()
  if (loading)     return <PageLoader />
  if (!isLoggedIn) return <Navigate to="/" state={{ from: location }} replace />
  if (!isAdmin)    return <Navigate to="/stats" replace />
  return children
}

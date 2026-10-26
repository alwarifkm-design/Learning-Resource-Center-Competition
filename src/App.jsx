import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import { RequireAuth, RequireAdmin } from './components/auth/ProtectedRoute'

import HomePage  from './pages/HomePage'
import StatsPage from './pages/StatsPage'
import GradePage from './pages/GradePage'
import AdminPage from './pages/AdminPage'
import NotFound  from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/stats"        element={<RequireAuth><StatsPage /></RequireAuth>} />
            <Route path="/grade/:grade" element={<RequireAuth><GradePage /></RequireAuth>} />
            <Route path="/admin"        element={<RequireAdmin><AdminPage /></RequireAdmin>} />
            <Route path="/404"          element={<NotFound />} />
            <Route path="*"             element={<Navigate to="/404" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

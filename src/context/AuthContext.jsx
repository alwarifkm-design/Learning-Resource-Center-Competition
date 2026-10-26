import { createContext, useContext, useState, useEffect } from 'react'
import { getUserByUsername, addLog } from '../firebase/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('iqra_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        sessionStorage.removeItem('iqra_user')
      }
    }
    setLoading(false)
  }, [])

  async function login(username, passwordHash) {
    const normalized = username?.trim()
    if (!normalized) throw new Error('اسم المستخدم مطلوب')

    const data = await getUserByUsername(normalized)
    if (!data) throw new Error('اسم المستخدم غير موجود')

    const isActive = data.isActive ?? data.is_active ?? true
    if (isActive === false) throw new Error('الحساب معطَّل، تواصل مع المشرف')

    const storedHash = data.passwordHash ?? data.password_hash
    if (storedHash !== passwordHash) throw new Error('كلمة المرور غير صحيحة')

    const u = { id: data.id, username: data.username, role: data.role || 'user' }
    setUser(u)
    sessionStorage.setItem('iqra_user', JSON.stringify(u))

    try {
      await addLog('login', 'تسجيل دخول', data.username)
    } catch (error) {
      // لا نوقف الدخول إذا كان السجل غير متاح مؤقتاً
    }

    return u
  }

  async function logout() {
    if (user) {
      try {
        await addLog('logout', 'تسجيل خروج', user.username)
      } catch {
        // تجاهل خطأ السجل في حالة الخروج
      }
    }

    setUser(null)
    sessionStorage.removeItem('iqra_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}

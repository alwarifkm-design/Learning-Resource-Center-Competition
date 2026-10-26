import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NAV_LINKS } from '../../utils/constants'

export default function Header({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout, isLoggedIn } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const isHome    = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    if (isHome) document.querySelector(href)?.scrollIntoView({ behavior:'smooth' })
    else navigate('/' + href)
  }

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }

  const navBase   = scrolled ? 'text-navy-700 hover:text-navy-900 hover:bg-navy-50' : 'text-white/90 hover:text-white hover:bg-white/15'
  const headerBg  = scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100' : 'bg-transparent'

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* شعار */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/msader.png" alt="شعار مركز مصادر التعلم"
              className="h-10 md:h-12 w-auto object-contain"
              onError={e => { e.target.style.display = 'none' }} />
            <div className="hidden sm:block">
              <p className={`text-xs font-medium leading-none ${scrolled?'text-navy-500':'text-white/70'}`}>مركز مصادر التعلم</p>
              <p className={`text-sm font-bold leading-tight ${scrolled?'text-navy-800':'text-white'}`}>اقرأ وأرتقي</p>
            </div>
          </Link>

          {/* روابط desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {isHome && NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${navBase}`}>
                {l.label}
              </button>
            ))}
            {isLoggedIn && !isHome && (
              <Link to="/stats" className="px-4 py-2 rounded-lg text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors">
                الإحصائيات
              </Link>
            )}
          </nav>

          {/* يمين: دخول / مستخدم */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-50 border border-navy-100">
                  <div className="w-7 h-7 rounded-full bg-navy-800 flex items-center justify-center text-white text-xs font-bold">
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-navy-700">{user?.username}</span>
                  {user?.role === 'admin' && <span className="badge bg-yellow-100 text-yellow-700">أدمن</span>}
                </div>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="px-3 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50 rounded-xl transition-colors">
                    لوحة التحكم
                  </Link>
                )}
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  خروج
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={onLoginClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${navBase}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  دخول
                </button>
                <button onClick={onLoginClick}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-navy-800 text-white hover:bg-navy-700 shadow-md active:scale-95 transition-all">
                  ابدأ
                </button>
              </div>
            )}

            {/* زر موبايل */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled?'text-navy-700 hover:bg-navy-50':'text-white hover:bg-white/15'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* قائمة موبايل */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {isHome && NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)}
                className="block w-full text-right px-4 py-2.5 rounded-xl text-navy-700 hover:bg-navy-50 font-medium text-sm">
                {l.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2.5 mb-1">
                    <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-white text-sm font-bold">
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-navy-700 font-medium">{user?.username}</span>
                    {user?.role === 'admin' && <span className="badge bg-yellow-100 text-yellow-700">أدمن</span>}
                  </div>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)}
                      className="block w-full text-right px-4 py-2.5 rounded-xl text-navy-700 hover:bg-navy-50 font-medium text-sm">
                      لوحة التحكم
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="block w-full text-right px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm">
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <button onClick={() => { setMenuOpen(false); onLoginClick?.() }}
                  className="w-full py-3 rounded-xl bg-navy-800 text-white font-bold text-sm">
                  ابدأ / تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

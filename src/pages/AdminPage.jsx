import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/footer'
import AdminUsers    from '../components/admin/AdminUsers'
import AdminSections from '../components/admin/AdminSections'
import AdminSecurity from '../components/admin/AdminSecurity'
import AdminContent  from '../components/admin/AdminContent'
import AdminExport   from '../components/admin/AdminExport'
import AdminLogs     from '../components/admin/AdminLogs'
import { useAuth } from '../context/AuthContext'

const TABS = [
  { key:'users',    label:'المستخدمون',      d:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { key:'sections', label:'الشعب الدراسية', d:'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { key:'security', label:'رمز الأمان',      d:'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { key:'content',  label:'محتوى الموقع',    d:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { key:'export',   label:'تصدير البيانات',  d:'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
  { key:'logs',     label:'سجل العمليات',    d:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
]

export default function AdminPage() {
  const [tab, setTab] = useState('users')
  const { user } = useAuth()
  const navigate = useNavigate()

  const renderTab = () => {
    switch(tab) {
      case 'users':    return <AdminUsers />
      case 'sections': return <AdminSections />
      case 'security': return <AdminSecurity />
      case 'content':  return <AdminContent />
      case 'export':   return <AdminExport />
      case 'logs':     return <AdminLogs />
      default:         return null
    }
  }

  const current = TABS.find(t => t.key === tab)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onLoginClick={() => {}} />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* رأس */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black text-navy-900">لوحة التحكم</h1>
                <p className="text-sm text-slate-500">مرحباً، {user?.username}</p>
              </div>
            </div>
            <button onClick={() => navigate('/stats')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-navy-700 bg-white border border-slate-200 rounded-xl hover:bg-navy-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              الإحصائيات
            </button>
          </div>

          <div className="flex gap-6">
            {/* شريط جانبي desktop */}
            <aside className="w-56 shrink-0 hidden lg:block">
              <nav className="card p-2 space-y-1 sticky top-24">
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-right transition-all ${tab===t.key ? 'bg-navy-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-navy-800'}`}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.d} />
                    </svg>
                    {t.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* تبويبات موبايل */}
            <div className="lg:hidden w-full mb-4 -mt-2">
              <div className="flex overflow-x-auto gap-2 pb-2">
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${tab===t.key ? 'bg-navy-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.d} />
                    </svg>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* المحتوى */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={current?.d} />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-navy-800">{current?.label}</h2>
              </div>
              {renderTab()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

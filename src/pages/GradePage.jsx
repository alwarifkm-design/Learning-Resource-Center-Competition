import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import AuthModal from '../components/auth/AuthModal'
import StudentTable from '../components/grade/StudentTable'
import AddStudentModal from '../components/grade/AddStudentModal'
import StudentProfile from '../components/grade/StudentProfile'
import ClearDataModal from '../components/grade/ClearDataModal'
import { PageLoader } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'
import { useAuth } from '../context/AuthContext'
import {
  getStudentsByGrade, getStudentsBySection,
  getSectionsByGrade, deleteStudent, addLog,
} from '../firebase/firestore'
import { GRADE_NAMES, GRADE_COLORS } from '../utils/constants'
import { exportToExcel } from '../utils/export'

export default function GradePage() {
  const { grade: gp } = useParams()
  const grade = parseInt(gp, 10)
  const navigate = useNavigate()
  const { isAdmin, user } = useAuth()
  const toast = useToast()

  const [students,       setStudents]       = useState([])
  const [sections,       setSections]       = useState([])
  const [activeSection,  setActiveSection]  = useState('all')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [loading,        setLoading]        = useState(true)
  const [authOpen,       setAuthOpen]       = useState(false)
  const [addOpen,        setAddOpen]        = useState(false)
  const [profileStudent, setProfileStudent] = useState(null)
  const [clearOpen,      setClearOpen]      = useState(false)

  useEffect(() => { if (![10,11,12].includes(grade)) navigate('/stats') }, [grade])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [secs, studs] = await Promise.all([getSectionsByGrade(grade), getStudentsByGrade(grade)])
      setSections(secs); setStudents(studs)
    } catch { toast('حدث خطأ في تحميل البيانات','error') }
    finally { setLoading(false) }
  }, [grade])

  useEffect(() => { loadData() }, [loadData])

  const handleSectionChange = async (sec) => {
    setActiveSection(sec); setSearchQuery(''); setLoading(true)
    try {
      const studs = sec === 'all' ? await getStudentsByGrade(grade) : await getStudentsBySection(grade, sec)
      setStudents(studs)
    } catch { toast('حدث خطأ','error') }
    finally { setLoading(false) }
  }

  const filtered = students.filter(s => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return s.name?.toLowerCase().includes(q) || String(s.studentNumber).includes(q)
  })

  const handleDelete = async (id, name) => {
    try {
      await deleteStudent(id)
      await addLog('delete_student', `حذف الطالب: ${name}`, user?.username)
      toast(`تم حذف "${name}"`, 'success')
      loadData()
    } catch { toast('فشل الحذف','error') }
  }

  const handleExport = () => {
    if (!students.length) { toast('لا توجد بيانات للتصدير','warning'); return }
    exportToExcel(students, grade)
    toast('تم التصدير بنجاح','success')
  }

  const c = GRADE_COLORS[grade] || GRADE_COLORS[10]
  if (loading && !students.length) return <PageLoader />

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onLoginClick={() => setAuthOpen(true)} />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* شريط العنوان */}
          <div className={`rounded-2xl bg-gradient-to-r ${c.gradient} p-6 mb-6 text-white`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/stats')}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div>
                  <p className="text-white/70 text-sm">صفحة الصف</p>
                  <h1 className="text-2xl font-black">{GRADE_NAMES[grade]}</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-xl font-black">{students.length}</p>
                  <p className="text-xs text-white/70">طالب</p>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-xl font-black">{students.reduce((s,st)=>s+(st.booksCount||0),0)}</p>
                  <p className="text-xs text-white/70">كتاب</p>
                </div>
              </div>
            </div>
          </div>

          {/* شريط الأدوات */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* بحث */}
              <div className="relative flex-1 max-w-xs w-full">
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input type="search" placeholder="بحث بالاسم أو الرقم..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="input-field pr-10 text-sm" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* الشعب */}
              <div className="flex flex-wrap gap-2 flex-1 justify-center">
                <button onClick={() => handleSectionChange('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSection==='all' ? `${c.bg} text-white shadow-sm` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  الكل
                </button>
                {sections.map(sec => (
                  <button key={sec} onClick={() => handleSectionChange(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSection===sec ? `${c.bg} text-white shadow-sm` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {sec}
                  </button>
                ))}
              </div>

              {/* أزرار */}
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  تصدير
                </button>
                <button onClick={() => setAddOpen(true)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white ${c.bg} ${c.hover} rounded-xl transition-colors shadow-sm`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  إضافة طالب
                </button>
              </div>
            </div>
          </div>

          {/* الجدول */}
          <StudentTable
            students={filtered} loading={loading}
            onViewProfile={setProfileStudent}
            onDelete={isAdmin ? handleDelete : null}
            gradeColors={c} searchQuery={searchQuery}
          />

          {/* زر التصفية — أدمن فقط */}
          {isAdmin && (
            <div className="mt-8 pt-6 border-t border-dashed border-red-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-bold text-red-700 text-sm">منطقة الخطر</p>
                  <p className="text-xs text-slate-500 mt-0.5">تصفية جميع بيانات هذا الصف بشكل نهائي</p>
                </div>
                <button onClick={() => setClearOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  تصفية بيانات الصف
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <AddStudentModal isOpen={addOpen} onClose={() => setAddOpen(false)}
        grade={grade} sections={sections}
        onSuccess={() => { loadData(); toast('تمت إضافة الطالب','success') }} />
      {profileStudent && (
        <StudentProfile student={profileStudent} onClose={() => setProfileStudent(null)}
          onRefresh={loadData} gradeColors={c} />
      )}
      <ClearDataModal isOpen={clearOpen} onClose={() => setClearOpen(false)}
        grade={grade} gradeName={GRADE_NAMES[grade]}
        onSuccess={() => { loadData(); toast('تم تصفية البيانات','success') }} />
    </div>
  )
}

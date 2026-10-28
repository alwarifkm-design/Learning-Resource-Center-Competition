import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/footer'
import AuthModal from '../components/auth/AuthModal'
import GradeCard from '../components/stats/GradeCard'
import StatsChart from '../components/stats/StatsChart'
import StatsSummary from '../components/stats/StatsSummary'
import { PageLoader } from '../components/ui/Spinner'
import { getTopStudentByGrade, getBookCountByGrade, getStudentCountByGrade } from '../firebase/firestore'
import { GRADES, GRADE_NAMES } from '../utils/constants'

export default function StatsPage() {
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [authOpen,  setAuthOpen]  = useState(false)
  const navigate = useNavigate()

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const results = await Promise.all(GRADES.map(async grade => {
        const [topStudent, bookCount, studentCount] = await Promise.all([
          getTopStudentByGrade(grade),
          getBookCountByGrade(grade),
          getStudentCountByGrade(grade),
        ])
        return { grade, topStudent, bookCount, studentCount }
      }))
      const mapped = {}
      results.forEach(r => { mapped[r.grade] = r })
      setData(mapped)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  if (loading) return <PageLoader />

  const chartData    = GRADES.map(g => ({ name: GRADE_NAMES[g], كتب: data?.[g]?.bookCount||0, طلاب: data?.[g]?.studentCount||0 }))
  const totalBooks   = GRADES.reduce((s,g) => s + (data?.[g]?.bookCount   ||0), 0)
  const totalStudents= GRADES.reduce((s,g) => s + (data?.[g]?.studentCount||0), 0)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onLoginClick={() => setAuthOpen(true)} />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* رأس */}
          <div className="mb-8 animate-fade-in flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-navy-900">الإحصائيات</h1>
              <p className="text-slate-500 mt-1">نظرة عامة على مسابقة اقرأ وأرتقي</p>
            </div>
            <button onClick={loadStats}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-navy-700 bg-white border border-slate-200 rounded-xl hover:bg-navy-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              تحديث
            </button>
          </div>

          <StatsSummary totalBooks={totalBooks} totalStudents={totalStudents} />

          {/* بطاقات الصفوف */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {GRADES.map(grade => (
              <GradeCard
                key={grade}
                grade={grade}
                topStudent={data?.[grade]?.topStudent}
                bookCount={data?.[grade]?.bookCount    || 0}
                studentCount={data?.[grade]?.studentCount || 0}
                onClick={() => navigate(`/grade/${grade}`)}
              />
            ))}
          </div>

          <StatsChart data={chartData} />
        </div>
      </main>
      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

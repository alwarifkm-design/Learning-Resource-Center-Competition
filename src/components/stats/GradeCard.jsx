import { GRADE_NAMES, GRADE_COLORS } from '../../utils/constants'

export default function GradeCard({ grade, topStudent, bookCount, studentCount, onClick }) {
  const c = GRADE_COLORS[grade]

  return (
    <button onClick={onClick}
      className="group card text-right overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full">
      <div className={`h-1.5 w-full bg-gradient-to-r ${c.gradient}`} />
      <div className="p-6">
        {/* رأس */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400">الصف</p>
            <p className="text-2xl font-black text-navy-900">{grade}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-navy-800 mb-4">{GRADE_NAMES[grade]}</h3>

        {/* الطالب الأول */}
        <div className={`rounded-xl p-4 mb-4 ${c.light} border ${c.border}`}>
          <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            الطالب الأكثر استعارة
          </p>
          {topStudent ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{topStudent.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-navy-800 text-sm leading-tight">{topStudent.name}</p>
                  <p className="text-xs text-slate-500">{topStudent.section}</p>
                </div>
              </div>
              <div className="text-left">
                <p className={`text-xl font-black ${c.text}`}>{topStudent.booksCount || 0}</p>
                <p className="text-xs text-slate-400">كتاب</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-1">لا يوجد طلاب بعد</p>
          )}
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-xl font-black text-navy-800">{bookCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">إجمالي الكتب</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-xl font-black text-navy-800">{studentCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">طالب مشارك</p>
          </div>
        </div>

        <div className={`mt-4 flex items-center justify-center gap-2 text-sm font-bold ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
          <span>عرض تفاصيل الصف</span>
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}

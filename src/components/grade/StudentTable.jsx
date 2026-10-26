import { useState } from 'react'
import EmptyState from '../ui/EmptyState'
import { ConfirmModal } from '../ui/Modal'
import { formatDateAr } from '../../utils/date'
import Spinner from '../ui/Spinner'

export default function StudentTable({ students, loading, onViewProfile, onDelete, gradeColors: c, searchQuery }) {
  const [deleteTarget, setDeleteTarget] = useState(null)

  if (loading) return (
    <div className="card flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3"><Spinner size="lg" /><p className="text-slate-500 text-sm">جارٍ التحميل...</p></div>
    </div>
  )

  if (!students.length) return (
    <div className="card">
      <EmptyState
        title={searchQuery ? 'لا توجد نتائج' : 'لا يوجد طلاب بعد'}
        description={searchQuery ? `لم يُعثر على "${searchQuery}"` : 'اضغط "إضافة طالب" لتسجيل أول طالب'}
      />
    </div>
  )

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                {['رقم الطالب','اسم الطالب','الشعبة','عدد الكتب','آخر استلام','آخر تسليم',''].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((st, idx) => (
                <tr key={st.id} className={`hover:bg-navy-50/50 transition-colors ${idx%2===0?'bg-white':'bg-slate-50/50'}`}>
                  <td className="table-cell">
                    <span className="badge bg-navy-100 text-navy-700 font-bold">#{st.studentNumber}</span>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => onViewProfile(st)} className="flex items-center gap-2.5 group text-right">
                      <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                        <span className="text-white text-xs font-bold">{st.name?.charAt(0)}</span>
                      </div>
                      <span className={`font-semibold text-navy-800 group-hover:${c.text} transition-colors group-hover:underline underline-offset-2`}>
                        {st.name}
                      </span>
                    </button>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${c.light} ${c.text} font-semibold`}>{st.section}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-lg font-black ${st.booksCount>=10?'text-gold-500':st.booksCount>=5?c.text:'text-navy-700'}`}>
                        {st.booksCount||0}
                      </span>
                      {st.booksCount>=10 && (
                        <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{formatDateAr(st.lastReceivedDate)}</td>
                  <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{formatDateAr(st.lastReturnDate)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => onViewProfile(st)}
                        className="p-1.5 text-slate-400 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors" title="الملف الشخصي">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {onDelete && (
                        <button onClick={() => setDeleteTarget({ id:st.id, name:st.name })}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">إجمالي: <span className="font-bold text-navy-700">{students.length}</span> طالب</p>
          <p className="text-xs text-slate-500">إجمالي الكتب: <span className="font-bold text-navy-700">{students.reduce((s,st)=>s+(st.booksCount||0),0)}</span></p>
        </div>
      </div>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { onDelete?.(deleteTarget.id, deleteTarget.name); setDeleteTarget(null) }}
        title="حذف الطالب"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ سيُحذف نهائياً.`}
        confirmLabel="حذف" danger />
    </>
  )
}

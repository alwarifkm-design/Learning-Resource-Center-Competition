import { useState, useEffect } from 'react'
import Modal, { ConfirmModal } from '../ui/Modal'
import AddBookModal from './AddBookModal'
import { useToast } from '../ui/Toast'
import { useAuth } from '../../context/AuthContext'
import {
  getBooksForStudent, updateBook, updateStudent,
  deleteBook, addLog, getBooksCountTodayForStudent,
} from '../../firebase/firestore'
import { formatDateAr, todayStr } from '../../utils/date'
import { MAX_BOOKS_PER_DAY } from '../../utils/constants'
import Spinner from '../ui/Spinner'

export default function StudentProfile({ student, onClose, onRefresh, gradeColors: c }) {
  const [books,        setBooks]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [addBookOpen,  setAddBookOpen]  = useState(false)
  const [todayCount,   setTodayCount]   = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingReturn,setEditingReturn]= useState(null)
  const [returnDate,   setReturnDate]   = useState('')
  const { isAdmin, user } = useAuth()
  const toast = useToast()

  useEffect(() => { if (student?.id) loadBooks() }, [student])

  async function loadBooks() {
    setLoading(true)
    try {
      const [bks, cnt] = await Promise.all([
        getBooksForStudent(student.id),
        getBooksCountTodayForStudent(student.id, todayStr()),
      ])
      setBooks(bks); setTodayCount(cnt)
    } finally { setLoading(false) }
  }

  const handleDeleteBook = async () => {
    if (!deleteTarget) return
    try {
      await deleteBook(deleteTarget.id, student.id)
      await addLog('delete_book', `حذف كتاب "${deleteTarget.title}"`, user?.username)
      toast('تم حذف الكتاب','success')
      loadBooks(); onRefresh?.()
    } catch { toast('فشل الحذف','error') }
    finally { setDeleteTarget(null) }
  }

  const handleSetReturn = async (bookId) => {
    if (!returnDate) return
    try {
      await updateBook(bookId, { returnDate })
      await updateStudent(student.id, { lastReturnDate: returnDate })
      toast('تم تسجيل التسليم','success')
      setEditingReturn(null); setReturnDate('')
      loadBooks(); onRefresh?.()
    } catch { toast('فشل التحديث','error') }
  }

  return (
    <>
      <Modal isOpen={!!student} onClose={onClose} title="الملف الشخصي" size="lg">
        {/* رأس */}
        <div className={`rounded-2xl bg-gradient-to-r ${c.gradient} p-5 mb-6 text-white`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
              {student?.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black">{student?.name}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="badge bg-white/20 text-white text-xs">الصف {student?.grade}</span>
                <span className="badge bg-white/20 text-white text-xs">{student?.section}</span>
                <span className="badge bg-white/20 text-white text-xs">#{student?.studentNumber}</span>
              </div>
            </div>
            <div className="text-center bg-white/20 rounded-xl p-3">
              <p className="text-3xl font-black">{student?.booksCount||0}</p>
              <p className="text-xs text-white/70">كتاب</p>
            </div>
          </div>
        </div>

        {/* شريط الكتب */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-bold text-navy-800">قائمة الكتب ({books.length})</h3>
          <button onClick={() => setAddBookOpen(true)} disabled={todayCount>=MAX_BOOKS_PER_DAY}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${todayCount>=MAX_BOOKS_PER_DAY ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : `${c.bg} text-white hover:opacity-90`}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {todayCount>=MAX_BOOKS_PER_DAY ? `الحد اليومي (${MAX_BOOKS_PER_DAY})` : 'إضافة كتاب'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Spinner size="lg" /></div>
        ) : books.length===0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">لا توجد كتب مسجلة</div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto px-1">
            {books.map((book, idx) => (
              <div key={book.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>{idx+1}</div>
                    <div>
                      <p className="font-bold text-navy-800 text-sm">{book.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">رقم: {book.bookNumber}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-xs text-slate-500">استلام: {formatDateAr(book.receivedDate)}</span>
                        {book.returnDate
                          ? <span className="text-xs text-emerald-600 font-medium">✓ تسليم: {formatDateAr(book.returnDate)}</span>
                          : <span className="badge bg-amber-100 text-amber-700 text-xs">لم يُسلَّم بعد</span>
                        }
                      </div>
                      {editingReturn===book.id && (
                        <div className="flex items-center gap-2 mt-2">
                          <input type="date" value={returnDate} min={book.receivedDate}
                            onChange={e=>setReturnDate(e.target.value)} className="input-field text-xs py-1.5 px-3" />
                          <button onClick={()=>handleSetReturn(book.id)}
                            className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">حفظ</button>
                          <button onClick={()=>{setEditingReturn(null);setReturnDate('')}} className="px-2 py-1.5 text-xs text-slate-500">إلغاء</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!book.returnDate && (
                      <button onClick={()=>{setEditingReturn(book.id);setReturnDate(todayStr())}}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="تسجيل التسليم">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={()=>setDeleteTarget(book)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="btn-secondary w-full">إغلاق</button>
        </div>
      </Modal>

      <AddBookModal isOpen={addBookOpen} onClose={()=>setAddBookOpen(false)}
        studentId={student?.id} currentCount={todayCount}
        onAddToExisting={() => { loadBooks(); onRefresh?.(); toast('تمت إضافة الكتاب','success') }} />

      <ConfirmModal isOpen={!!deleteTarget} onClose={()=>setDeleteTarget(null)}
        onConfirm={handleDeleteBook} title="حذف الكتاب"
        message={`حذف كتاب "${deleteTarget?.title}"؟`} confirmLabel="حذف" danger />
    </>
  )
}

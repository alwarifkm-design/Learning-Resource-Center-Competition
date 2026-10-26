import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Select } from '../ui/Input'
import AddBookModal from './AddBookModal'
import { useToast } from '../ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { addStudent, getNextStudentNumber, addBook, addLog } from '../../firebase/firestore'
import { todayStr } from '../../utils/date'
import { MAX_BOOKS_PER_DAY } from '../../utils/constants'

export default function AddStudentModal({ isOpen, onClose, grade, sections, onSuccess }) {
  const init = () => ({ name:'', section:'', books:[] })
  const [form,         setForm]         = useState(init())
  const [errors,       setErrors]       = useState({})
  const [loading,      setLoading]      = useState(false)
  const [bookModalOpen,setBookModalOpen]= useState(false)
  const { user } = useAuth()
  const toast    = useToast()

  const resetAndClose = () => { setForm(init()); setErrors({}); onClose() }

  const validate = () => {
    const e = {}
    if (!form.name.trim())   e.name    = 'اسم الطالب مطلوب'
    else if (form.name.trim().split(' ').filter(Boolean).length < 2) e.name = 'أدخل الاسم الثلاثي'
    if (!form.section)       e.section = 'الشعبة مطلوبة'
    setErrors(e); return !Object.keys(e).length
  }

  const handleAddBook = (book) => {
    const todayBooks = form.books.filter(b => b.receivedDate === book.receivedDate)
    if (todayBooks.length >= MAX_BOOKS_PER_DAY) { toast(`الحد الأقصى ${MAX_BOOKS_PER_DAY} كتب في اليوم`,'warning'); return }
    setForm(p=>({...p,books:[...p.books,book]}))
    toast('تمت إضافة الكتاب','success')
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault(); if (!validate()) return
    setLoading(true)
    try {
      const studentNumber = await getNextStudentNumber(grade)
      const ref = await addStudent({
        name: form.name.trim(), grade, section: form.section, studentNumber,
        lastReceivedDate: form.books.length ? todayStr() : null, lastReturnDate: null,
      })
      for (const book of form.books) await addBook({ ...book, studentId: ref.id, grade })
      await addLog('add_student', `إضافة: ${form.name.trim()} — ${form.section} — ${form.books.length} كتاب`, user?.username)
      onSuccess?.(); resetAndClose()
    } catch (err) { toast(err.message||'حدث خطأ','error') }
    finally { setLoading(false) }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={resetAndClose} title="إضافة طالب جديد" size="md">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          <Input label="الاسم الثلاثي" placeholder="مثال: أحمد محمد علي"
            value={form.name} onChange={e=>{setForm(p=>({...p,name:e.target.value}));setErrors(p=>({...p,name:''}))}}
            error={errors.name} required />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-navy-700">الصف</label>
              <div className="input-field bg-slate-50 text-slate-500 cursor-not-allowed">الصف {grade}</div>
            </div>
            <Select label="الشعبة" value={form.section}
              onChange={e=>{setForm(p=>({...p,section:e.target.value}));setErrors(p=>({...p,section:''}))}}
              error={errors.section} required>
              <option value="">— اختر الشعبة —</option>
              {sections.map(s=><option key={s} value={s}>{s}</option>)}
            </Select>
          </div>

          {/* الكتب */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-sm font-semibold text-navy-700">الكتب</label>
                <p className="text-xs text-slate-400 mt-0.5">الحد الأقصى {MAX_BOOKS_PER_DAY} كتب/يوم</p>
              </div>
              <button type="button" onClick={()=>setBookModalOpen(true)} disabled={form.books.length>=MAX_BOOKS_PER_DAY}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-navy-700 bg-navy-50 border border-navy-200 rounded-xl hover:bg-navy-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إضافة كتاب
              </button>
            </div>

            {form.books.length===0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-400">
                لا توجد كتب مضافة بعد
              </div>
            ) : (
              <div className="space-y-2">
                {form.books.map((book, i) => (
                  <div key={i} className="flex items-center justify-between bg-navy-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-white text-xs font-bold">{i+1}</div>
                      <div>
                        <p className="text-sm font-semibold text-navy-800">{book.title}</p>
                        <p className="text-xs text-slate-500">رقم: {book.bookNumber} · {book.receivedDate}</p>
                      </div>
                    </div>
                    <button type="button" onClick={()=>setForm(p=>({...p,books:p.books.filter((_,j)=>j!==i)}))}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={resetAndClose} className="btn-secondary flex-1">إلغاء</button>
            <Button type="submit" loading={loading} className="flex-1">إضافة الطالب</Button>
          </div>
        </form>
      </Modal>

      <AddBookModal isOpen={bookModalOpen} onClose={()=>setBookModalOpen(false)}
        onAdd={handleAddBook} currentCount={form.books.length} />
    </>
  )
}

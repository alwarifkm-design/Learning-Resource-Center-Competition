import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { todayStr } from '../../utils/date'
import { MAX_BOOKS_PER_DAY } from '../../utils/constants'
import { addBook, getBooksCountTodayForStudent } from '../../firebase/firestore'

export default function AddBookModal({ isOpen, onClose, onAdd, currentCount=0, studentId, onAddToExisting }) {
  const init = () => ({ title:'', bookNumber:'', receivedDate:todayStr(), returnDate:'' })
  const [form,    setForm]    = useState(init())
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const remaining = MAX_BOOKS_PER_DAY - currentCount

  const validate = () => {
    const e = {}
    if (!form.title.trim())      e.title      = 'اسم الكتاب مطلوب'
    if (!form.bookNumber.trim()) e.bookNumber  = 'رقم الكتاب مطلوب'
    if (!form.receivedDate)      e.receivedDate= 'تاريخ الاستلام مطلوب'
    setErrors(e); return !Object.keys(e).length
  }

  const set = (k,v) => { setForm(p=>({...p,[k]:v})); setErrors(p=>({...p,[k]:''})) }

  const handleSubmit = async (ev) => {
    ev.preventDefault(); if (!validate()) return
    if (currentCount >= MAX_BOOKS_PER_DAY) return
    setLoading(true)
    try {
      if (studentId && onAddToExisting) {
        const cnt = await getBooksCountTodayForStudent(studentId, form.receivedDate)
        if (cnt >= MAX_BOOKS_PER_DAY) { setErrors({title:`تجاوز الحد اليومي (${MAX_BOOKS_PER_DAY})`}); return }
        await addBook({ ...form, studentId })
        onAddToExisting?.()
      } else {
        onAdd?.(form)
      }
      setForm(init()); setErrors({}); onClose()
    } finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة كتاب" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* تنبيه */}
        <div className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${remaining<=1?'bg-amber-50 text-amber-700 border border-amber-200':'bg-navy-50 text-navy-700 border border-navy-100'}`}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          متبقي {remaining} {remaining===1?'كتاب':'كتب'} من أصل {MAX_BOOKS_PER_DAY} اليوم
        </div>

        <Input label="اسم الكتاب"    placeholder="أدخل عنوان الكتاب"       value={form.title}      onChange={e=>set('title',e.target.value)}      error={errors.title}       required />
        <Input label="رقم الكتاب"    placeholder="رقم الكتاب في المكتبة"   value={form.bookNumber} onChange={e=>set('bookNumber',e.target.value)}  error={errors.bookNumber}  required />

        <div className="grid grid-cols-2 gap-3">
          <Input label="تاريخ الاستلام" type="date" value={form.receivedDate} onChange={e=>set('receivedDate',e.target.value)} error={errors.receivedDate} required />
          <Input label="تاريخ التسليم (اختياري)" type="date" value={form.returnDate} onChange={e=>set('returnDate',e.target.value)} min={form.receivedDate} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm">إلغاء</button>
          <Button type="submit" loading={loading} className="flex-1" disabled={currentCount>=MAX_BOOKS_PER_DAY}>إضافة</Button>
        </div>
      </form>
    </Modal>
  )
}

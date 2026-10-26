import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useToast } from '../ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { clearGradeData, addLog } from '../../firebase/firestore'

export default function ClearDataModal({ isOpen, onClose, grade, gradeName, onSuccess }) {
  const [step,        setStep]        = useState(1)
  const [confirmText, setConfirmText] = useState('')
  const [loading,     setLoading]     = useState(false)
  const { user } = useAuth()
  const toast    = useToast()
  const WORD     = 'تأكيد'

  const handleClose = () => { setStep(1); setConfirmText(''); onClose() }

  const handleConfirm = async () => {
    if (confirmText !== WORD) { toast(`اكتب "${WORD}" بالضبط`,'warning'); return }
    setLoading(true)
    try {
      const count = await clearGradeData(grade)
      await addLog('clear_grade', `تصفية ${gradeName} — ${count} طالب`, user?.username)
      toast(`تم تصفية بيانات ${gradeName}`,'success')
      onSuccess?.(); handleClose()
    } catch (err) { toast('حدث خطأ: ' + err.message,'error') }
    finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="تصفية بيانات الصف" size="sm" closeOnOverlay={false}>
      {step===1 ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-red-700 text-sm">تحذير: عملية غير قابلة للتراجع</p>
              <p className="text-xs text-red-600 mt-0.5">سيُحذف جميع طلاب {gradeName} وكتبهم نهائياً.</p>
            </div>
          </div>
          <div className="text-sm text-slate-600 space-y-1">
            <p className="font-semibold text-navy-800">ماذا سيُحذف؟</p>
            <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
              <li>جميع بيانات طلاب {gradeName}</li>
              <li>جميع سجلات الكتب المستعارة</li>
              <li>إحصائيات الصف بالكامل</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <button onClick={handleClose} className="btn-secondary flex-1 text-sm">إلغاء</button>
            <button onClick={()=>setStep(2)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-red-600 border-2 border-red-300 rounded-xl hover:bg-red-50 transition-colors">
              متابعة
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <p className="font-bold text-navy-800">تأكيد التصفية النهائية</p>
            <p className="text-sm text-slate-500 mt-1">
              اكتب <span className="font-black text-red-600">"{WORD}"</span> للمتابعة
            </p>
          </div>
          <input type="text" placeholder={`اكتب "${WORD}" هنا`} value={confirmText}
            onChange={e=>setConfirmText(e.target.value)}
            className={`input-field text-center font-bold text-lg ${confirmText && confirmText!==WORD ? 'border-red-400':''}`}
            autoFocus />
          {confirmText && confirmText!==WORD && (
            <p className="text-xs text-red-500 text-center -mt-2">غير متطابق</p>
          )}
          <div className="flex gap-3">
            <button onClick={()=>setStep(1)} className="btn-secondary flex-1 text-sm">رجوع</button>
            <Button onClick={handleConfirm} loading={loading} disabled={confirmText!==WORD}
              className="flex-1 bg-red-600 hover:bg-red-700 text-sm">
              تصفية نهائية
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

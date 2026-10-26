import { useState, useEffect } from 'react'
import { getSetting, setSetting, addLog } from '../../firebase/firestore'
import { hashSecurityCode } from '../../utils/hash'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function AdminSecurity() {
  const [newCode,     setNewCode]     = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [showCode,    setShowCode]    = useState(false)
  const [hasCode,     setHasCode]     = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [checking,    setChecking]    = useState(true)
  const [errors,      setErrors]      = useState({})
  const { user } = useAuth()
  const toast    = useToast()

  useEffect(() => {
    getSetting('security_code').then(s => { setHasCode(!!s?.hash); setChecking(false) })
  }, [])

  const validate = () => {
    const e = {}
    if (!newCode)                e.newCode     = 'رمز الأمان مطلوب'
    else if (newCode.length < 4) e.newCode     = 'يجب أن يكون 4 أحرف على الأقل'
    if (newCode !== confirmCode) e.confirmCode = 'الرمزان غير متطابقين'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSave = async (ev) => {
    ev.preventDefault(); if (!validate()) return
    setLoading(true)
    try {
      const hash = await hashSecurityCode(newCode)
      await setSetting('security_code', { hash })
      await addLog('change_security_code', 'تغيير رمز الأمان', user?.username)
      toast('تم حفظ رمز الأمان','success')
      setNewCode(''); setConfirmCode(''); setHasCode(true)
    } catch { toast('فشل الحفظ','error') }
    finally { setLoading(false) }
  }

  if (checking) return <div className="text-center py-10 text-slate-400 text-sm">جارٍ التحقق...</div>

  return (
    <div className="max-w-lg space-y-5">
      {/* حالة */}
      <div className={`card p-4 flex items-center gap-3 border ${hasCode?'border-emerald-200 bg-emerald-50':'border-amber-200 bg-amber-50'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasCode?'bg-emerald-100':'bg-amber-100'}`}>
          <svg className={`w-5 h-5 ${hasCode?'text-emerald-600':'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={hasCode ? 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'} />
          </svg>
        </div>
        <div>
          <p className={`font-bold text-sm ${hasCode?'text-emerald-700':'text-amber-700'}`}>
            {hasCode ? 'رمز الأمان مُفعَّل' : 'لم يُعيَّن رمز أمان بعد'}
          </p>
          <p className={`text-xs mt-0.5 ${hasCode?'text-emerald-600':'text-amber-600'}`}>
            {hasCode ? 'يُستخدم للتحقق عند إنشاء حسابات جديدة' : 'يجب تعيينه حتى يتمكن المستخدمون من التسجيل'}
          </p>
        </div>
      </div>

      {/* نموذج */}
      <div className="card p-6">
        <h3 className="font-bold text-navy-800 mb-1">{hasCode ? 'تغيير رمز الأمان' : 'تعيين رمز الأمان'}</h3>
        <p className="text-xs text-slate-500 mb-5">الرمز يُخزَّن مشفراً ولا يُعرض أبداً. وزِّعه على من تريد منحه صلاحية التسجيل.</p>

        <form onSubmit={handleSave} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-navy-700">الرمز الجديد <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showCode?'text':'password'} placeholder="أدخل رمز الأمان الجديد"
                value={newCode} onChange={e=>{setNewCode(e.target.value);setErrors(p=>({...p,newCode:''}))}}
                className={`input-field pl-10 ${errors.newCode?'border-red-400':''}`} autoComplete="off" />
              <button type="button" onClick={()=>setShowCode(!showCode)}
                className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600" tabIndex={-1}>
                <EyeToggle show={showCode} />
              </button>
            </div>
            {errors.newCode && <p className="text-xs text-red-500">{errors.newCode}</p>}
          </div>

          <Input label="تأكيد الرمز" type={showCode?'text':'password'} placeholder="أعد كتابة الرمز"
            value={confirmCode} onChange={e=>{setConfirmCode(e.target.value);setErrors(p=>({...p,confirmCode:''}))}}
            error={errors.confirmCode} required autoComplete="off" />

          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-amber-700">بعد التغيير، لن يصلح الرمز القديم لإنشاء حسابات جديدة.</p>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            {hasCode ? 'تحديث رمز الأمان' : 'حفظ رمز الأمان'}
          </Button>
        </form>
      </div>
    </div>
  )
}

function EyeToggle({ show }) {
  return show
    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

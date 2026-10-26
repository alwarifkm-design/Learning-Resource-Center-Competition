import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import { hashPassword, hashSecurityCode } from '../../utils/hash'
import { createUser, getUserByUsername, getSetting, addLog } from '../../firebase/firestore'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { EyeIcon } from './LoginForm'

export default function RegisterForm({ onSuccess, onLogin }) {
  const [form,     setForm]     = useState({ username:'', password:'', confirmPassword:'', securityCode:'' })
  const [showPass, setShowPass] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const toast      = useToast()

  const set = (k, v) => { setForm(p=>({...p,[k]:v})); setErrors(p=>({...p,[k]:''})) }

  const validate = () => {
    const e = {}
    if (!form.username.trim())              e.username = 'اسم المستخدم مطلوب'
    else if (form.username.trim().length<3) e.username = 'يجب أن يكون 3 أحرف على الأقل'
    if (!form.password)                     e.password = 'كلمة المرور مطلوبة'
    else if (form.password.length<6)        e.password = 'يجب أن تكون 6 أحرف على الأقل'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'كلمتا المرور غير متطابقتين'
    if (!form.securityCode.trim())          e.securityCode = 'رمز الأمان مطلوب'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault(); if (!validate()) return
    setLoading(true)
    try {
      // تحقق تكرار الاسم
      if (await getUserByUsername(form.username.trim())) {
        setErrors(p=>({...p,username:'اسم المستخدم موجود مسبقاً'})); return
      }
      // تحقق رمز الأمان من Firebase
      const sec = await getSetting('security_code')
      if (!sec?.hash) { toast('لم يُعيَّن رمز أمان بعد، تواصل مع المشرف','error'); return }
      if (await hashSecurityCode(form.securityCode.trim()) !== sec.hash) {
        setErrors(p=>({...p,securityCode:'رمز الأمان غير صحيح'})); return
      }
      // إنشاء الحساب
      const passwordHash = await hashPassword(form.password)
      await createUser({ username: form.username.trim(), passwordHash })
      await addLog('register', 'إنشاء حساب جديد', form.username.trim())
      const user = await login(form.username.trim(), passwordHash)
      toast('تم إنشاء الحساب بنجاح! 🎉','success')
      onSuccess?.()
      navigate(user.role==='admin' ? '/admin' : '/stats')
    } catch (err) { toast(err.message || 'حدث خطأ','error') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="flex justify-center mb-2">
        <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
      </div>
      <div className="text-center mb-2">
        <h2 className="text-xl font-black text-navy-800">إنشاء حساب</h2>
        <p className="text-sm text-slate-500 mt-1">أدخل بياناتك لإنشاء حساب جديد</p>
      </div>

      <Input label="اسم المستخدم" type="text" placeholder="مثال: ahmed123"
        value={form.username} onChange={e=>set('username',e.target.value)}
        error={errors.username} required autoComplete="username" />

      {/* كلمة المرور */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-navy-700">كلمة المرور <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type={showPass?'text':'password'} placeholder="6 أحرف على الأقل"
            value={form.password} onChange={e=>set('password',e.target.value)}
            className={`input-field pl-10 ${errors.password?'border-red-400':''}`} autoComplete="new-password" />
          <button type="button" onClick={()=>setShowPass(!showPass)}
            className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600" tabIndex={-1}>
            <EyeIcon show={showPass} />
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      <Input label="تأكيد كلمة المرور" type={showPass?'text':'password'} placeholder="أعد كتابة كلمة المرور"
        value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)}
        error={errors.confirmPassword} required autoComplete="new-password" />

      {/* رمز الأمان */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-navy-700">رمز الأمان <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type={showCode?'text':'password'} placeholder="أدخل رمز الأمان"
            value={form.securityCode} onChange={e=>set('securityCode',e.target.value)}
            className={`input-field pl-10 ${errors.securityCode?'border-red-400':''}`} autoComplete="off" />
          <button type="button" onClick={()=>setShowCode(!showCode)}
            className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600" tabIndex={-1}>
            <EyeIcon show={showCode} />
          </button>
        </div>
        {errors.securityCode
          ? <p className="text-xs text-red-500">{errors.securityCode}</p>
          : <p className="text-xs text-slate-400">يُزوِّدك إياه مشرف مركز مصادر التعلم</p>}
      </div>

      <Button type="submit" loading={loading} className="w-full mt-2" size="lg">إنشاء الحساب</Button>

      <p className="text-center text-sm text-slate-500 pt-1">
        لديك حساب؟{' '}
        <button type="button" onClick={onLogin} className="text-navy-700 font-bold hover:text-navy-900 underline underline-offset-2">
          تسجيل الدخول
        </button>
      </p>
    </form>
  )
}

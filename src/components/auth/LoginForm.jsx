import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import { hashPassword } from '../../utils/hash'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function LoginForm({ onSuccess, onRegister }) {
  const [form,     setForm]     = useState({ username:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const toast      = useToast()

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'اسم المستخدم مطلوب'
    if (!form.password)        e.password  = 'كلمة المرور مطلوبة'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault(); if (!validate()) return
    setLoading(true)
    try {
      const hashed = await hashPassword(form.password)
      const user   = await login(form.username.trim(), hashed)
      toast('مرحباً بك! تم تسجيل الدخول', 'success')
      onSuccess?.()
      navigate(user.role === 'admin' ? '/admin' : '/stats')
    } catch (err) { toast(err.message || 'حدث خطأ', 'error') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="flex justify-center mb-2">
        <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      <div className="text-center mb-4">
        <h2 className="text-xl font-black text-navy-800">تسجيل الدخول</h2>
        <p className="text-sm text-slate-500 mt-1">أدخل بيانات حسابك</p>
      </div>

      <Input label="اسم المستخدم" type="text" placeholder="أدخل اسم المستخدم"
        value={form.username} onChange={e => setForm(p=>({...p,username:e.target.value}))}
        error={errors.username} required autoComplete="username" />

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-navy-700">كلمة المرور <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type={showPass?'text':'password'} placeholder="أدخل كلمة المرور"
            value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))}
            className={`input-field pl-10 ${errors.password?'border-red-400':''}`} autoComplete="current-password" />
          <button type="button" onClick={()=>setShowPass(!showPass)}
            className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600" tabIndex={-1}>
            <EyeIcon show={showPass} />
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      <Button type="submit" loading={loading} className="w-full mt-2" size="lg">دخول</Button>

      <p className="text-center text-sm text-slate-500 pt-1">
        ليس لديك حساب؟{' '}
        <button type="button" onClick={onRegister} className="text-navy-700 font-bold hover:text-navy-900 underline underline-offset-2">
          إنشاء حساب جديد
        </button>
      </p>
    </form>
  )
}

export function EyeIcon({ show }) {
  return show
    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
}

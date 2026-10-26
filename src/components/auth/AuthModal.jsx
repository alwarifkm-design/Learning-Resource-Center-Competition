import { useState } from 'react'
import Modal from '../ui/Modal'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login')

  const handleClose = () => { onClose(); setTimeout(() => setMode('login'), 300) }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm" showClose>
      {/* تبديل */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
        {['login','register'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${mode===m ? 'bg-white text-navy-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {m==='login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        ))}
      </div>
      {mode==='login'
        ? <LoginForm    onSuccess={handleClose} onRegister={() => setMode('register')} />
        : <RegisterForm onSuccess={handleClose} onLogin={   () => setMode('login')} />
      }
    </Modal>
  )
}

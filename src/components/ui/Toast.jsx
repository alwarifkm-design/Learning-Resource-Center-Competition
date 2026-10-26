import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

const ToastCtx = createContext(null)

const ICONS = {
  success: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
  error:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
  warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />,
  info:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
}
const COLORS = {
  success:'text-emerald-500', error:'text-red-500', warning:'text-amber-500', info:'text-blue-500'
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now()
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration)
  }, [])

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
          {toasts.map(t => (
            <div key={t.id} className="animate-slide-up bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-3">
              <svg className={`w-5 h-5 shrink-0 ${COLORS[t.type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {ICONS[t.type]}
              </svg>
              <p className="text-sm font-medium text-navy-800 flex-1">{t.message}</p>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="text-slate-300 hover:text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast outside ToastProvider')
  return ctx.showToast
}

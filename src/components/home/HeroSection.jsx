import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function HeroSection({ onStart }) {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('opacity-100','translate-y-0'); el.classList.remove('opacity-0','translate-y-8') }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleStart = () => isLoggedIn ? navigate('/stats') : onStart?.()

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* خلفية */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-800 to-navy-700" />
      <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

      {/* المحتوى */}
      <div ref={ref}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto opacity-0 translate-y-8 transition-all duration-700 ease-out">

        {/* شارة */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <div className="w-5 h-5 rounded-full bg-gold-400 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="text-sm text-white/80 font-medium">مركز مصادر التعلم · مدرسة الإمام المهنا بن سلطان</span>
        </div>

        {/* العنوان */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
          اقرأ <span className="text-gold-400">وأرتقي</span>
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-4 leading-relaxed font-medium">
          مسابقة القراءة لطلاب الصفوف العاشر والحادي عشر والثاني عشر
        </p>
        <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto mb-10">
          استعر أكثر الكتب، تصدّر القائمة، وكن الأكثر ارتقاءً.
        </p>

        {/* أزرار */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={handleStart}
            className="group px-10 py-4 bg-white text-navy-900 font-black text-lg rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 min-w-[180px]">
            <span className="flex items-center gap-2 justify-center">
              ابدأ الآن
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
          <button onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior:'smooth' })}
            className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/50 active:scale-95 transition-all duration-300">
            اعرف أكثر
          </button>
        </div>

        {/* إحصائيات صغيرة */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto">
          {[{ v:'3', l:'صفوف دراسية' },{ v:'31+', l:'شعبة' },{ v:'3', l:'كتب/يوم' }].map(s => (
            <div key={s.l} className="text-center">
              <p className="text-2xl font-black text-gold-400">{s.v}</p>
              <p className="text-xs text-white/50 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* سهم تمرير */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <button onClick={() => document.querySelector('#faq')?.scrollIntoView({ behavior:'smooth' })}
          className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  )
}

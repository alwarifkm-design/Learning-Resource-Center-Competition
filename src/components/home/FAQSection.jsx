import { useState, useEffect } from 'react'
import { getFAQ } from '../../firebase/firestore'

export default function FAQSection() {
  const [items,   setItems]   = useState([])
  const [open,    setOpen]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getFAQ().then(setItems).finally(() => setLoading(false)) }, [])

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-navy-50 text-navy-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">الأسئلة الشائعة</span>
          <h2 className="section-title">كل ما تريد معرفته</h2>
          <p className="section-subtitle mt-2">إجابات على أكثر الأسئلة شيوعاً حول المسابقة</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => {
              const id = item.id || idx
              const isOpen = open === id
              return (
                <div key={id} className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-navy-200 shadow-md bg-navy-50/50' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}>
                  <button onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-right gap-4">
                    <span className="font-bold text-navy-800 text-sm md:text-base flex-1">{item.question}</span>
                    <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-navy-800 text-white rotate-180' : 'bg-slate-100 text-slate-500'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-6 pb-5">
                      <div className="h-px bg-navy-100 mb-4" />
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">{item.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { getSetting } from '../../firebase/firestore'
import { DEFAULT_ABOUT } from '../../utils/constants'

export default function AboutSection() {
  const [content, setContent] = useState(DEFAULT_ABOUT)

  useEffect(() => { getSetting('about').then(d => { if (d) setContent(d) }) }, [])

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <span className="inline-block bg-navy-50 text-navy-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">عن المسابقة</span>
          <h2 className="section-title">{content.title}</h2>
          <p className="text-gold-500 font-bold text-lg mt-1">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* الوصف */}
          <div className="card p-8">
            <div className="w-12 h-12 rounded-2xl bg-navy-800 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-navy-800 mb-4">نبذة عن المسابقة</h3>
            <p className="text-slate-600 leading-relaxed">{content.description}</p>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="font-bold text-navy-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                كيف تفوز؟
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">{content.howToWin}</p>
            </div>
          </div>

          {/* الأهداف */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-navy-800">أهداف المسابقة</h3>
            {content.goals?.map((goal, i) => (
              <div key={i} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center shrink-0">
                  <span className="text-navy-700 font-black text-sm">{i+1}</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed text-sm">{goal}</p>
              </div>
            ))}
            <div className="card p-5 bg-navy-800">
              <h4 className="font-bold text-white mb-3 text-sm">الفئة المستهدفة</h4>
              <div className="flex flex-wrap gap-2">
                {['الصف العاشر','الصف الحادي عشر','الصف الثاني عشر'].map(g => (
                  <span key={g} className="badge bg-white/20 text-white text-sm px-3 py-1">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

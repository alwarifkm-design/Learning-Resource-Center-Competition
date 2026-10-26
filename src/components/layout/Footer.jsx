import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="footer" className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* الشعار */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/msader.png" alt="شعار مركز مصادر التعلم"
                className="h-12 w-auto object-contain brightness-0 invert opacity-90"
                onError={e => { e.target.style.display='none' }} />
              <div>
                <p className="text-sm text-white/60">مركز مصادر التعلم</p>
                <p className="font-bold">اقرأ وأرتقي</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              مبادرة تعليمية لتشجيع طلاب مدرسة الإمام المهنا بن سلطان على القراءة والاطلاع.
            </p>
          </div>

          {/* روابط */}
          <div>
            <h3 className="font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { label:'الصفحة الرئيسية',    to:'/' },
                { label:'الإحصائيات',          to:'/stats' },
                { label:'الصف العاشر',         to:'/grade/10' },
                { label:'الصف الحادي عشر',     to:'/grade/11' },
                { label:'الصف الثاني عشر',     to:'/grade/12' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-3 h-3 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل */}
          <div id="contact">
            <h3 className="font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                مدرسة الإمام المهنا بن سلطان
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                مركز مصادر التعلم
              </li>
              <li>
                <a href="https://www.moe.gov.sa" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white transition-colors">
                  <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  وزارة التعليم
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/40">© {year} مركز مصادر التعلم · مدرسة الإمام المهنا بن سلطان. جميع الحقوق محفوظة.</p>
          <p className="text-sm text-white/40">منصة <span className="text-white/60 font-medium">اقرأ وأرتقي</span></p>
        </div>
      </div>
    </footer>
  )
}

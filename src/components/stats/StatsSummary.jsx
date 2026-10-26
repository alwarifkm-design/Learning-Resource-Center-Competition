export default function StatsSummary({ totalBooks, totalStudents }) {
  const stats = [
    {
      label: 'إجمالي الكتب المستعارة', value: totalBooks,
      bg: 'bg-navy-50', border: 'border-navy-100',
      icon: <svg className="w-6 h-6 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    },
    {
      label: 'إجمالي الطلاب المشاركين', value: totalStudents,
      bg: 'bg-emerald-50', border: 'border-emerald-100',
      icon: <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: 'متوسط كتب الطالب', value: totalStudents > 0 ? (totalBooks/totalStudents).toFixed(1) : '0',
      bg: 'bg-violet-50', border: 'border-violet-100',
      icon: <svg className="w-6 h-6 text-violet-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((s,i) => (
        <div key={i} className={`card p-5 flex items-center gap-4 border ${s.border} animate-slide-up`} style={{ animationDelay:`${i*80}ms` }}>
          <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
          <div>
            <p className="text-3xl font-black text-navy-900">{s.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

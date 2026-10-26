import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts'

const CLR = { كتب:'#172f79', طلاب:'#10b981' }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-4 text-sm font-medium">
      <p className="text-navy-800 font-bold mb-2 border-b border-slate-100 pb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mt-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-600">{p.dataKey}:</span>
          <span className="font-bold text-navy-800">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function StatsChart({ data }) {
  const [type, setType] = useState('bar')

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-800">إحصائيات الصفوف</h2>
          <p className="text-sm text-slate-500 mt-0.5">مقارنة عدد الكتب والطلاب لكل صف</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          {[{ k:'bar', l:'أعمدة' },{ k:'area', l:'مساحة' }].map(t => (
            <button key={t.k} onClick={() => setType(t.k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${type===t.k ? 'bg-white text-navy-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top:5, right:20, left:0, bottom:5 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize:12, fill:'#64748b', fontFamily:'Cairo' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:'#f8fafc' }} />
              <Legend formatter={v => <span style={{ fontSize:12, color:'#475569', fontFamily:'Cairo' }}>{v}</span>} />
              <Bar dataKey="كتب"  fill={CLR['كتب']}  radius={[6,6,0,0]} />
              <Bar dataKey="طلاب" fill={CLR['طلاب']} radius={[6,6,0,0]} />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top:5, right:20, left:0, bottom:5 }}>
              <defs>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={CLR['كتب']}  stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CLR['كتب']}  stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={CLR['طلاب']} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CLR['طلاب']} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize:12, fill:'#64748b', fontFamily:'Cairo' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span style={{ fontSize:12, color:'#475569', fontFamily:'Cairo' }}>{v}</span>} />
              <Area type="monotone" dataKey="كتب"  stroke={CLR['كتب']}  strokeWidth={2.5} fill="url(#gB)" dot={{ r:5, fill:CLR['كتب'] }} />
              <Area type="monotone" dataKey="طلاب" stroke={CLR['طلاب']} strokeWidth={2.5} fill="url(#gS)" dot={{ r:5, fill:CLR['طلاب'] }} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 text-center mt-4">البيانات تُحدَّث في الوقت الفعلي</p>
    </div>
  )
}

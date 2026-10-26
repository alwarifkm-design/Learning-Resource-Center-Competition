import { useEffect, useState } from 'react'
import { getLogs } from '../../firebase/firestore'
import { formatDateTimeAr } from '../../utils/date'
import Spinner from '../ui/Spinner'

export default function AdminLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    try {
      setLogs(await getLogs(100))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h3 className="text-lg font-black text-navy-900">سجل العمليات</h3>
        <button onClick={loadLogs} className="text-xs font-semibold text-navy-700 hover:text-navy-900">تحديث</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr>
              {['الإجراء', 'التفاصيل', 'المستخدم', 'التاريخ'].map((h) => (
                <th key={h} className="table-header">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="table-cell text-center text-slate-500 py-8">لا توجد عمليات مسجلة</td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr key={log.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="table-cell">
                    <span className="badge bg-navy-100 text-navy-700">{log.action || 'إجراء'}</span>
                  </td>
                  <td className="table-cell text-sm text-slate-700">{log.details || '—'}</td>
                  <td className="table-cell text-sm text-slate-600">{log.username || 'غير معروف'}</td>
                  <td className="table-cell text-xs text-slate-500">{formatDateTimeAr(log.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { getStudentsByGrade } from '../../firebase/firestore'
import { useToast } from '../ui/Toast'
import { exportAllToExcel } from '../../utils/export'
import { GRADES, GRADE_NAMES } from '../../utils/constants'
import Button from '../ui/Button'

export default function AdminExport() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const result = {}
      for (const grade of GRADES) {
        result[`grade${grade}`] = await getStudentsByGrade(grade)
      }
      setData(result)
    } catch {
      toast('تعذّر تحميل بيانات التصدير', 'error')
    } finally {
      setLoading(false)
    }
  }

  const total = GRADES.reduce((sum, grade) => sum + (data[`grade${grade}`]?.length || 0), 0)

  const handleExport = () => {
    if (!total) {
      toast('لا توجد بيانات للتصدير', 'warning')
      return
    }
    setExporting(true)
    try {
      exportAllToExcel(data)
      toast('تم تصدير البيانات بنجاح', 'success')
    } catch {
      toast('فشل تصدير الملف', 'error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-black text-navy-900">تصدير جميع البيانات</h3>
          <p className="text-sm text-slate-500">يمكنك تنزيل نسخة Excel كاملة لبيانات المسابقة</p>
        </div>
        <Button onClick={handleExport} loading={exporting} disabled={loading || !total}>
          تصدير Excel
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 py-6 text-center">جارٍ تجهيز البيانات...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GRADES.map((grade) => (
            <div key={grade} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{GRADE_NAMES[grade]}</p>
              <p className="mt-2 text-3xl font-black text-navy-900">{data[`grade${grade}`]?.length || 0}</p>
              <p className="text-xs text-slate-500">طالب</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

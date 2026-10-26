import { useState, useEffect } from 'react'
import { getSectionsByGrade, saveSectionsByGrade, addLog } from '../../firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import Button from '../ui/Button'
import { GRADES, GRADE_NAMES, GRADE_COLORS } from '../../utils/constants'

export default function AdminSections() {
  const [activeGrade, setActiveGrade] = useState(10)
  const [sections,    setSections]    = useState([])
  const [newSection,  setNewSection]  = useState('')
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [editIdx,     setEditIdx]     = useState(null)
  const [editVal,     setEditVal]     = useState('')
  const { user } = useAuth()
  const toast    = useToast()
  const c        = GRADE_COLORS[activeGrade]

  useEffect(() => { loadSections() }, [activeGrade])

  async function loadSections() {
    setLoading(true)
    try { setSections(await getSectionsByGrade(activeGrade)) } finally { setLoading(false) }
  }

  const save = async (list, msg) => {
    setSaving(true)
    try {
      await saveSectionsByGrade(activeGrade, list)
      await addLog('edit_sections', `${msg} — الصف ${activeGrade}`, user?.username)
      setSections(list); toast(msg,'success')
    } catch { toast('فشل الحفظ','error') }
    finally { setSaving(false) }
  }

  const handleAdd = async () => {
    const v = newSection.trim()
    if (!v) return
    if (sections.includes(v)) { toast('الشعبة موجودة','warning'); return }
    await save([...sections, v], `إضافة شعبة ${v}`)
    setNewSection('')
  }

  const handleDelete = (sec) => save(sections.filter(s=>s!==sec), `حذف شعبة ${sec}`)

  const handleEditSave = async (idx) => {
    const v = editVal.trim()
    if (!v) return
    if (sections.includes(v) && sections[idx]!==v) { toast('الشعبة موجودة','warning'); return }
    await save(sections.map((s,i)=>i===idx?v:s), `إعادة تسمية شعبة إلى ${v}`)
    setEditIdx(null)
  }

  return (
    <div className="space-y-5">
      {/* تبويبات */}
      <div className="flex gap-2 flex-wrap">
        {GRADES.map(g => (
          <button key={g} onClick={()=>setActiveGrade(g)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeGrade===g ? `${GRADE_COLORS[g].bg} text-white shadow-sm` : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
            {GRADE_NAMES[g]}
          </button>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-navy-800">شعب {GRADE_NAMES[activeGrade]}</h3>
          <span className="badge bg-navy-100 text-navy-700">{sections.length} شعبة</span>
        </div>

        {/* إضافة */}
        <div className="flex gap-2 mb-5">
          <input type="text" placeholder={`مثال: ${activeGrade}/7`}
            value={newSection} onChange={e=>setNewSection(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleAdd()}
            className="input-field flex-1 text-sm" />
          <Button onClick={handleAdd} loading={saving} size="sm" className="shrink-0">إضافة</Button>
        </div>

        {/* القائمة */}
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm">جارٍ التحميل...</div>
        ) : sections.length===0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">لا توجد شعب مضافة</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sections.map((sec, idx) => (
              <div key={sec} className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border ${editIdx===idx?'border-navy-300 bg-navy-50':'border-slate-100 bg-slate-50'}`}>
                {editIdx===idx ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
                      onKeyDown={e=>{ if(e.key==='Enter')handleEditSave(idx); if(e.key==='Escape')setEditIdx(null) }}
                      className="input-field text-xs py-1 px-2 flex-1" />
                    <button onClick={()=>handleEditSave(idx)} className="text-emerald-600 hover:text-emerald-700 p-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button onClick={()=>setEditIdx(null)} className="text-slate-400 hover:text-slate-600 p-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`text-sm font-bold ${c.text}`}>{sec}</span>
                    <div className="flex items-center gap-0.5">
                      <button onClick={()=>{setEditIdx(idx);setEditVal(sec)}} className="p-1 text-slate-400 hover:text-navy-600 rounded transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={()=>handleDelete(sec)} className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

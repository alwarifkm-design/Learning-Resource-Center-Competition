import { useState, useEffect } from 'react'
import { getSetting, setSetting, getFAQ, saveFAQ, addLog } from '../../firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import Button from '../ui/Button'
import { DEFAULT_ABOUT } from '../../utils/constants'

export default function AdminContent() {
  const [tab,    setTab]    = useState('about')
  const [about,  setAbout]  = useState(DEFAULT_ABOUT)
  const [faq,    setFaq]    = useState([])
  const [footer, setFooter] = useState({ school:'', center:'', email:'' })
  const [loading,setLoading]= useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const toast    = useToast()

  useEffect(() => {
    Promise.all([
      getSetting('about').then(d => d && setAbout(d)),
      getFAQ().then(setFaq),
      getSetting('footer').then(d => d && setFooter(d)),
    ]).finally(() => setLoading(false))
  }, [])

  const saveAbout = async () => {
    setSaving(true)
    try { await setSetting('about', about); await addLog('edit_content','تعديل "عن المسابقة"',user?.username); toast('تم الحفظ','success') }
    catch { toast('فشل الحفظ','error') } finally { setSaving(false) }
  }
  const saveFaqData = async () => {
    setSaving(true)
    try { await saveFAQ(faq); await addLog('edit_content','تعديل FAQ',user?.username); toast('تم الحفظ','success') }
    catch { toast('فشل الحفظ','error') } finally { setSaving(false) }
  }
  const saveFooter = async () => {
    setSaving(true)
    try { await setSetting('footer', footer); await addLog('edit_content','تعديل التواصل',user?.username); toast('تم الحفظ','success') }
    catch { toast('فشل الحفظ','error') } finally { setSaving(false) }
  }

  if (loading) return <div className="text-center py-10 text-slate-400 text-sm">جارٍ التحميل...</div>

  return (
    <div className="space-y-4">
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-fit">
        {[{k:'about',l:'عن المسابقة'},{k:'faq',l:'الأسئلة الشائعة'},{k:'footer',l:'التواصل'}].map(t => (
          <button key={t.k} onClick={()=>setTab(t.k)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${tab===t.k?'bg-white text-navy-800 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {tab==='about' && (
        <div className="card p-6 space-y-4">
          <F label="عنوان المسابقة"  value={about.title}       onChange={v=>setAbout(p=>({...p,title:v}))} />
          <F label="الشعار الفرعي"   value={about.subtitle}    onChange={v=>setAbout(p=>({...p,subtitle:v}))} />
          <F label="الوصف"            value={about.description} onChange={v=>setAbout(p=>({...p,description:v}))} multi />
          <F label="كيفية الفوز"      value={about.howToWin}    onChange={v=>setAbout(p=>({...p,howToWin:v}))} multi />
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-2">الأهداف</label>
            <div className="space-y-2">
              {about.goals?.map((g,i) => (
                <div key={i} className="flex gap-2">
                  <input value={g} onChange={e=>setAbout(p=>({...p,goals:p.goals.map((x,j)=>j===i?e.target.value:x)}))} className="input-field text-sm flex-1" />
                  <button onClick={()=>setAbout(p=>({...p,goals:p.goals.filter((_,j)=>j!==i)}))} className="text-red-400 hover:text-red-600 px-2">✕</button>
                </div>
              ))}
              <button onClick={()=>setAbout(p=>({...p,goals:[...(p.goals||[]),'']})) } className="text-xs text-navy-600 font-semibold hover:text-navy-800">+ إضافة هدف</button>
            </div>
          </div>
          <Button onClick={saveAbout} loading={saving}>حفظ التعديلات</Button>
        </div>
      )}

      {tab==='faq' && (
        <div className="card p-6 space-y-4">
          {faq.map((item,idx) => (
            <div key={item.id} className="p-4 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge bg-navy-100 text-navy-700 text-xs">سؤال {idx+1}</span>
                <button onClick={()=>setFaq(p=>p.filter(f=>f.id!==item.id))} className="text-xs text-red-500 hover:text-red-700 font-semibold">حذف</button>
              </div>
              <F label="السؤال"  value={item.question} onChange={v=>setFaq(p=>p.map(f=>f.id===item.id?{...f,question:v}:f))} />
              <F label="الإجابة" value={item.answer}   onChange={v=>setFaq(p=>p.map(f=>f.id===item.id?{...f,answer:v}:f))} multi />
            </div>
          ))}
          <button onClick={()=>setFaq(p=>[...p,{id:Date.now(),question:'',answer:''}])}
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 font-semibold hover:border-navy-300 hover:text-navy-700 transition-colors">
            + إضافة سؤال جديد
          </button>
          <Button onClick={saveFaqData} loading={saving}>حفظ الأسئلة</Button>
        </div>
      )}

      {tab==='footer' && (
        <div className="card p-6 space-y-4">
          <F label="اسم المدرسة"                  value={footer.school||''}  onChange={v=>setFooter(p=>({...p,school:v}))} />
          <F label="اسم مركز مصادر التعلم"        value={footer.center||''}  onChange={v=>setFooter(p=>({...p,center:v}))} />
          <F label="البريد الإلكتروني (اختياري)"  value={footer.email||''}   onChange={v=>setFooter(p=>({...p,email:v}))} />
          <Button onClick={saveFooter} loading={saving}>حفظ معلومات التواصل</Button>
        </div>
      )}
    </div>
  )
}

function F({ label, value, onChange, multi }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-navy-700">{label}</label>
      {multi
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={3} className="input-field resize-none text-sm leading-relaxed" />
        : <input type="text" value={value} onChange={e=>onChange(e.target.value)} className="input-field text-sm" />}
    </div>
  )
}

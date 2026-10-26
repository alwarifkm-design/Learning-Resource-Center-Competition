import { useState, useEffect } from 'react'
import { getAllUsers, updateUser, deleteUser, addLog } from '../../firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import { ConfirmModal } from '../ui/Modal'
import { formatDateTimeAr } from '../../utils/date'
import Spinner from '../ui/Spinner'

export default function AdminUsers() {
  const [users,        setUsers]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const { user: me }   = useAuth()
  const toast          = useToast()

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    try { setUsers(await getAllUsers()) } finally { setLoading(false) }
  }

  const handleToggle = async (u) => {
    if (u.id === me?.id) { toast('لا يمكنك تعطيل حسابك الحالي','warning'); return }
    try {
      await updateUser(u.id, { isActive: !u.isActive })
      await addLog('toggle_user', `${u.isActive?'تعطيل':'تفعيل'} حساب: ${u.username}`, me?.username)
      toast(`تم ${u.isActive?'تعطيل':'تفعيل'} الحساب`,'success')
      loadUsers()
    } catch { toast('فشلت العملية','error') }
  }

  const handleRole = async (u, role) => {
    if (u.id === me?.id) { toast('لا يمكنك تغيير دورك','warning'); return }
    try {
      await updateUser(u.id, { role })
      await addLog('change_role', `تغيير دور ${u.username} إلى ${role}`, me?.username)
      toast('تم تغيير الدور','success'); loadUsers()
    } catch { toast('فشلت العملية','error') }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    if (deleteTarget.id === me?.id) { toast('لا يمكنك حذف حسابك','warning'); setDeleteTarget(null); return }
    try {
      await deleteUser(deleteTarget.id)
      await addLog('delete_user', `حذف حساب: ${deleteTarget.username}`, me?.username)
      toast('تم حذف الحساب','success'); setDeleteTarget(null); loadUsers()
    } catch { toast('فشل الحذف','error') }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{users.length} حساب مسجل</p>
        <button onClick={loadUsers} className="text-xs text-navy-600 hover:text-navy-800 font-semibold flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          تحديث
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>{['اسم المستخدم','الدور','الحالة','تاريخ الإنشاء','إجراءات'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={i%2===0?'bg-white':'bg-slate-50/50'}>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-white text-xs font-bold">
                        {u.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-navy-800 text-sm">{u.username}</p>
                        {u.id===me?.id && <span className="text-xs text-slate-400">(أنت)</span>}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <select value={u.role||'user'} onChange={e=>handleRole(u,e.target.value)}
                      disabled={u.id===me?.id}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-navy-400 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="user">مستخدم</option>
                      <option value="admin">أدمن</option>
                    </select>
                  </td>
                  <td className="table-cell">
                    <button onClick={()=>handleToggle(u)} disabled={u.id===me?.id}
                      className={`badge cursor-pointer transition-colors disabled:cursor-not-allowed ${u.isActive?'bg-emerald-100 text-emerald-700 hover:bg-emerald-200':'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                      {u.isActive?'● مفعّل':'● معطَّل'}
                    </button>
                  </td>
                  <td className="table-cell text-xs text-slate-500">{formatDateTimeAr(u.createdAt)}</td>
                  <td className="table-cell">
                    <button onClick={()=>setDeleteTarget(u)} disabled={u.id===me?.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal isOpen={!!deleteTarget} onClose={()=>setDeleteTarget(null)}
        onConfirm={handleDelete} title="حذف الحساب"
        message={`حذف حساب "${deleteTarget?.username}"؟`} confirmLabel="حذف" danger />
    </div>
  )
}

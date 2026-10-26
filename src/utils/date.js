export const todayStr = () => new Date().toISOString().split('T')[0]

export function formatDateAr(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ar-SA', { year:'numeric', month:'long', day:'numeric' })
}

export function formatDateTimeAr(ts) {
  if (!ts) return '—'
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('ar-SA', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
}

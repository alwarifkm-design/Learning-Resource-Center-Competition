import * as XLSX from 'xlsx'

export function exportToExcel(students, grade) {
  const rows = students.map(s => ({
    'رقم الطالب':       s.studentNumber,
    'اسم الطالب':       s.name,
    'الشعبة':           s.section,
    'عدد الكتب':        s.booksCount || 0,
    'آخر استلام':       s.lastReceivedDate || '—',
    'آخر تسليم':        s.lastReturnDate   || '—',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [{ wch:12 },{ wch:30 },{ wch:10 },{ wch:12 },{ wch:15 },{ wch:15 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `الصف ${grade}`)
  XLSX.writeFile(wb, `طلاب_الصف_${grade}.xlsx`)
}

export function exportAllToExcel(data) {
  // data = { grade10:[], grade11:[], grade12:[] }
  const wb   = XLSX.utils.book_new()
  const names = { grade10:'الصف العاشر', grade11:'الصف الحادي عشر', grade12:'الصف الثاني عشر' }
  Object.entries(data).forEach(([key, students]) => {
    if (!students?.length) return
    const rows = students.map(s => ({
      'رقم الطالب':s.studentNumber,'اسم الطالب':s.name,'الشعبة':s.section,'عدد الكتب':s.booksCount||0
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{ wch:12 },{ wch:30 },{ wch:10 },{ wch:12 }]
    XLSX.utils.book_append_sheet(wb, ws, names[key])
  })
  XLSX.writeFile(wb, `بيانات_المسابقة.xlsx`)
}

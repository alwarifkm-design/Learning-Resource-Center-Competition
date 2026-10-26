import { supabase } from './config'

export const C = {
  USERS: 'users',
  STUDENTS: 'students',
  BOOKS: 'books',
  SETTINGS: 'settings',
  LOGS: 'logs',
  SECTIONS: 'sections',
  FAQ: 'faq',
}

const snake = (value) =>
  String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/-/g, '_')
    .toLowerCase()

const camel = (value) =>
  String(value).replace(/_([a-z])/g, (_, ch) => ch.toUpperCase())

const fieldMap = {
  passwordHash: 'password_hash',
  isActive: 'is_active',
  createdAt: 'created_at',
  booksCount: 'books_count',
  studentId: 'student_id',
  receivedDate: 'received_date',
  lastReceivedDate: 'last_received_date',
  securityCode: 'security_code',
  studentNumber: 'student_number',
  schoolName: 'school_name',
  bookTitle: 'book_title',
  bookId: 'book_id',
  parentName: 'parent_name',
  parentPhone: 'parent_phone',
  bookType: 'book_type',
  cashValue: 'cash_value',
  createdBy: 'created_by',
  updatedAt: 'updated_at',
}

function normalizeRow(row) {
  if (!row || typeof row !== 'object') return row

  const out = {}
  for (const [key, value] of Object.entries(row)) {
    const mapped = fieldMap[key] ? fieldMap[key] : snake(key)
    out[camel(mapped)] = value
  }

  if (Object.prototype.hasOwnProperty.call(row, 'password_hash') && !Object.prototype.hasOwnProperty.call(out, 'passwordHash')) {
    out.passwordHash = row.password_hash
  }

  if (Object.prototype.hasOwnProperty.call(row, 'is_active') && !Object.prototype.hasOwnProperty.call(out, 'isActive')) {
    out.isActive = row.is_active
  }

  if (Object.prototype.hasOwnProperty.call(row, 'created_at') && !Object.prototype.hasOwnProperty.call(out, 'createdAt')) {
    out.createdAt = row.created_at
  }

  if (Object.prototype.hasOwnProperty.call(row, 'books_count') && !Object.prototype.hasOwnProperty.call(out, 'booksCount')) {
    out.booksCount = row.books_count
  }

  if (Object.prototype.hasOwnProperty.call(row, 'received_date') && !Object.prototype.hasOwnProperty.call(out, 'receivedDate')) {
    out.receivedDate = row.received_date
  }

  return out
}

function normalizePayload(data) {
  if (!data || typeof data !== 'object') return data

  const payload = {}
  for (const [key, value] of Object.entries(data)) {
    const mappedKey = fieldMap[key] || snake(key)
    payload[mappedKey] = value
  }
  return payload
}

function parseSettingValue(raw) {
  if (!raw) return null
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw
  }
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return raw
    }
  }
  return raw
}

export async function getUserByUsername(username) {
  const value = String(username || '').trim()
  if (!value) return null

  const { data, error } = await supabase
    .from(C.USERS)
    .select('*')
    .ilike('username', value)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data ? normalizeRow(data) : null
}

export async function createUser(data) {
  const payload = normalizePayload({
    ...data,
    createdAt: new Date().toISOString(),
    isActive: true,
    role: 'user',
  })

  const { data: row, error } = await supabase
    .from(C.USERS)
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return row ? normalizeRow(row) : null
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from(C.USERS)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(normalizeRow)
}

export async function updateUser(id, data) {
  const payload = normalizePayload(data)
  const { error } = await supabase
    .from(C.USERS)
    .update(payload)
    .eq('id', id)

  if (error) throw error
}

export async function deleteUser(id) {
  const { error } = await supabase
    .from(C.USERS)
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getStudentsByGrade(grade) {
  const { data, error } = await supabase
    .from(C.STUDENTS)
    .select('*')
    .eq('grade', grade)
    .order('student_number', { ascending: true })

  if (error) throw error
  return (data || []).map(normalizeRow)
}

export async function getStudentsBySection(grade, section) {
  const { data, error } = await supabase
    .from(C.STUDENTS)
    .select('*')
    .eq('grade', grade)
    .eq('section', section)
    .order('student_number', { ascending: true })

  if (error) throw error
  return (data || []).map(normalizeRow)
}

export async function getNextStudentNumber(grade) {
  const { data, error } = await supabase
    .from(C.STUDENTS)
    .select('student_number')
    .eq('grade', grade)
    .order('student_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data?.student_number ? Number(data.student_number) + 1 : 1
}

export async function addStudent(data) {
  const payload = normalizePayload({
    ...data,
    createdAt: new Date().toISOString(),
    booksCount: 0,
  })

  const { data: row, error } = await supabase
    .from(C.STUDENTS)
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return row ? normalizeRow(row) : null
}

export async function updateStudent(id, data) {
  const { error } = await supabase
    .from(C.STUDENTS)
    .update(normalizePayload(data))
    .eq('id', id)

  if (error) throw error
}

export async function deleteStudent(id) {
  const { error } = await supabase
    .from(C.STUDENTS)
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getStudentById(id) {
  const { data, error } = await supabase
    .from(C.STUDENTS)
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data ? normalizeRow(data) : null
}

export async function getTopStudentByGrade(grade) {
  const { data, error } = await supabase
    .from(C.STUDENTS)
    .select('*')
    .eq('grade', grade)
    .order('books_count', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data ? normalizeRow(data) : null
}

export async function getBookCountByGrade(grade) {
  const { data, error } = await supabase
    .from(C.STUDENTS)
    .select('books_count')
    .eq('grade', grade)

  if (error) throw error
  return (data || []).reduce((sum, item) => sum + Number(item.books_count || 0), 0)
}

export async function getStudentCountByGrade(grade) {
  const { count, error } = await supabase
    .from(C.STUDENTS)
    .select('*', { count: 'exact', head: true })
    .eq('grade', grade)

  if (error) throw error
  return count || 0
}

export async function getBooksForStudent(studentId) {
  const { data, error } = await supabase
    .from(C.BOOKS)
    .select('*')
    .eq('student_id', studentId)
    .order('received_date', { ascending: false })

  if (error) throw error
  return (data || []).map(normalizeRow)
}

export async function getBooksCountTodayForStudent(studentId, dateStr) {
  const { count, error } = await supabase
    .from(C.BOOKS)
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('received_date', dateStr)

  if (error) throw error
  return count || 0
}

export async function addBook(data) {
  const book = normalizePayload({
    ...data,
    createdAt: new Date().toISOString(),
  })

  const { data: inserted, error } = await supabase
    .from(C.BOOKS)
    .insert(book)
    .select()
    .single()

  if (error) throw error

  const { data: student, error: studentError } = await supabase
    .from(C.STUDENTS)
    .select('books_count, last_received_date')
    .eq('id', data.studentId)
    .maybeSingle()

  if (studentError) throw studentError

  await supabase
    .from(C.STUDENTS)
    .update({
      books_count: Number(student?.books_count || 0) + 1,
      last_received_date: data.receivedDate,
    })
    .eq('id', data.studentId)

  return inserted ? normalizeRow(inserted) : null
}

export async function updateBook(id, data) {
  const { error } = await supabase
    .from(C.BOOKS)
    .update(normalizePayload(data))
    .eq('id', id)

  if (error) throw error
}

export async function deleteBook(bookId, studentId) {
  const { error } = await supabase
    .from(C.BOOKS)
    .delete()
    .eq('id', bookId)

  if (error) throw error

  const { data: student, error: studentError } = await supabase
    .from(C.STUDENTS)
    .select('books_count')
    .eq('id', studentId)
    .maybeSingle()

  if (studentError) throw studentError

  await supabase
    .from(C.STUDENTS)
    .update({ books_count: Math.max(Number(student?.books_count || 0) - 1, 0) })
    .eq('id', studentId)
}

export async function getSetting(key) {
  const { data, error } = await supabase
    .from(C.SETTINGS)
    .select('*')
    .eq('key', key)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  if (!data) return null

  if (typeof data.value !== 'undefined') {
    const parsed = parseSettingValue(data.value)
    if (key === 'security_code' && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { hash: parsed.hash || parsed.value || parsed, ...parsed }
    }
    return parsed
  }

  if (typeof data.hash !== 'undefined') return data
  return data
}

export async function setSetting(key, value) {
  const record = { key, value }
  const { error } = await supabase
    .from(C.SETTINGS)
    .upsert(record, { onConflict: 'key' })

  if (error) throw error
}

export function getDefaultSections(grade) {
  if (grade === 10) return Array.from({ length: 6 }, (_, i) => `10/${i + 1}`)
  if (grade === 11) return Array.from({ length: 14 }, (_, i) => `11/${i + 1}`)
  if (grade === 12) return Array.from({ length: 11 }, (_, i) => `12/${i + 1}`)
  return []
}

export async function getSectionsByGrade(grade) {
  const row = await getSetting(`grade_${grade}`)
  if (!row) return getDefaultSections(grade)
  return Array.isArray(row) ? row : row.sections || getDefaultSections(grade)
}

export async function saveSectionsByGrade(grade, sections) {
  await setSetting(`grade_${grade}`, sections)
}

export function getDefaultFAQ() {
  return [
    { id: 1, question: 'ما هي مسابقة "اقرأ وأرتقي"؟', answer: 'مبادرة تعليمية من مركز مصادر التعلم في مدرسة الإمام المهنا بن سلطان لتشجيع الطلاب على القراءة.' },
    { id: 2, question: 'من يحق له المشاركة؟', answer: 'طلاب الصفوف العاشر والحادي عشر والثاني عشر.' },
    { id: 3, question: 'كيف أشارك في المسابقة؟', answer: 'بزيارة مركز مصادر التعلم واستعارة الكتب، ويقوم المشرف بتسجيلها.' },
    { id: 4, question: 'ما الحد الأقصى للكتب في اليوم؟', answer: '3 كتب كحد أقصى في اليوم الواحد.' },
    { id: 5, question: 'كيف يُحدَّد الفائز؟', answer: 'الطالب صاحب أعلى عدد كتب مستعارة في كل صف يُتوَّج فائزاً في صفه.' },
  ]
}

export async function getFAQ() {
  const row = await getSetting('faq_list')
  if (!row) return getDefaultFAQ()
  return Array.isArray(row) ? row : row.items || getDefaultFAQ()
}

export async function saveFAQ(items) {
  await setSetting('faq_list', items)
}

export async function addLog(action, details, username) {
  const payload = normalizePayload({
    action,
    details,
    username: username || 'غير معروف',
    timestamp: new Date().toISOString(),
  })

  const { error } = await supabase.from(C.LOGS).insert(payload)
  if (error) throw error
}

export async function getLogs(limitCount = 100) {
  const { data, error } = await supabase
    .from(C.LOGS)
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limitCount)

  if (error) throw error
  return (data || []).map(normalizeRow)
}

export async function clearGradeData(grade) {
  const students = await getStudentsByGrade(grade)

  for (const student of students) {
    const books = await getBooksForStudent(student.id)
    for (const book of books) {
      await supabase.from(C.BOOKS).delete().eq('id', book.id)
    }
    await deleteStudent(student.id)
  }

  return students.length
}

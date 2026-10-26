export const GRADES      = [10, 11, 12]
export const MAX_BOOKS_PER_DAY = 3

export const GRADE_NAMES = { 10:'الصف العاشر', 11:'الصف الحادي عشر', 12:'الصف الثاني عشر' }

export const GRADE_COLORS = {
  10: { bg:'bg-blue-600',   hover:'hover:bg-blue-700',   light:'bg-blue-50',   text:'text-blue-600',   border:'border-blue-200',   gradient:'from-blue-600 to-blue-800' },
  11: { bg:'bg-emerald-600',hover:'hover:bg-emerald-700',light:'bg-emerald-50',text:'text-emerald-600',border:'border-emerald-200',gradient:'from-emerald-600 to-emerald-800' },
  12: { bg:'bg-violet-600', hover:'hover:bg-violet-700', light:'bg-violet-50', text:'text-violet-600', border:'border-violet-200', gradient:'from-violet-600 to-violet-800' },
}

export const NAV_LINKS = [
  { label:'الرئيسية',       href:'#hero'  },
  { label:'الأسئلة الشائعة',href:'#faq'   },
  { label:'عن المسابقة',    href:'#about' },
  { label:'تواصل معنا',     href:'#footer'},
]

export const DEFAULT_ABOUT = {
  title:       'مسابقة اقرأ وأرتقي',
  subtitle:    'نحو جيل قارئ واعٍ',
  description: 'مسابقة "اقرأ وأرتقي" مبادرة تعليمية يطلقها مركز مصادر التعلم في مدرسة الإمام المهنا بن سلطان للصفوف العاشر والحادي عشر والثاني عشر، بهدف تعزيز ثقافة القراءة وبناء عادات الاطلاع المستمر.',
  goals: [
    'تنمية حب القراءة وتشجيع الطلاب على الاطلاع المستمر',
    'رفع مستوى التحصيل الدراسي والثقافة العامة',
    'تحفيز روح المنافسة الإيجابية بين الطلاب',
    'تفعيل دور مركز مصادر التعلم في الحياة المدرسية',
  ],
  howToWin: 'الطالب صاحب أعلى عدد كتب مستعارة في كل صف يُتوَّج فائزاً في صفه بنهاية فترة المسابقة.',
}

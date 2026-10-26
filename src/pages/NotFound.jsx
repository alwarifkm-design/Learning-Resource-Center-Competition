import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="card max-w-md w-full text-center p-8 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
          404
        </div>
        <h1 className="mt-6 text-3xl font-black text-navy-900">الصفحة غير موجودة</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          الرابط الذي طلبته غير متوفر، أو قد تم نقله إلى صفحة أخرى.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-navy-800 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-navy-700"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  )
}

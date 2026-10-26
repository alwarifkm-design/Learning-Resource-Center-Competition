export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm:'w-5 h-5', md:'w-8 h-8', lg:'w-12 h-12' }
  return <div className={`spinner ${s[size]} ${className}`} />
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-navy-700 font-medium text-sm">جارٍ التحميل...</p>
      </div>
    </div>
  )
}

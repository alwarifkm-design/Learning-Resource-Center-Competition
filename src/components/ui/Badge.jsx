const variants = {
  default: 'bg-slate-100 text-slate-600',
  primary: 'bg-navy-100 text-navy-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger:  'bg-red-100 text-red-700',
  gold:    'bg-yellow-100 text-yellow-700',
}

export default function Badge({ children, variant='default', className='' }) {
  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>
}

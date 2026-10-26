import Spinner from './Spinner'

const variants = {
  primary:   'bg-navy-800 text-white hover:bg-navy-700 shadow-md hover:shadow-lg',
  secondary: 'bg-white text-navy-800 border-2 border-navy-200 hover:border-navy-400 hover:bg-navy-50',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700',
  ghost:     'text-navy-700 hover:bg-navy-50',
}
const sizes = { sm:'px-3 py-1.5 text-sm', md:'px-5 py-2.5 text-sm', lg:'px-7 py-3 text-base' }

export default function Button({ children, variant='primary', size='md', loading=false, disabled=false, className='', icon, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

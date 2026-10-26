export default function Input({ label, error, icon, className='', ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-navy-700">
          {label}{props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
        <input
          className={`input-field ${icon ? 'pr-10' : ''} ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

export function Select({ label, error, children, className='', ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-navy-700">
          {label}{props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <select
        className={`input-field appearance-none cursor-pointer ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

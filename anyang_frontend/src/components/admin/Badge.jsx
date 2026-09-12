const TONE_CLASSES = {
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  info: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

const DOT_CLASSES = {
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
};

export default function Badge({ tone = 'neutral', dot = false, icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${TONE_CLASSES[tone]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[tone]}`} />}
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

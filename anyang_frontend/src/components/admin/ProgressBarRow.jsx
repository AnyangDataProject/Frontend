export default function ProgressBarRow({
  label,
  percent,
  barColorClass = 'bg-blue-500',
  labelWidthClass = 'w-24',
  valueWidthClass = 'w-12',
  children,
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`${labelWidthClass} shrink-0 text-xs font-medium text-slate-500`}>{label}</span>
      <div className="h-2 flex-1 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${barColorClass}`} style={{ width: `${percent}%` }} />
      </div>
      <span className={`${valueWidthClass} shrink-0 text-right text-xs font-semibold text-slate-700`}>
        {children}
      </span>
    </div>
  );
}

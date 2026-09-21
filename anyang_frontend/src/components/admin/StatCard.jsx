import { TONE_CLASSES } from './toneClasses';

export default function StatCard({ icon: Icon, label, value, suffix, tone = 'info', hint }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}>
        {Icon && <Icon size={20} />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">
          {value}
          {suffix && <span className="ml-0.5 text-base font-medium text-slate-400">{suffix}</span>}
        </p>
        {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

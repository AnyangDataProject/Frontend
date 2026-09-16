export default function StatRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-1.5 text-sm text-slate-500">
        {Icon && <Icon size={15} />} {label}
      </dt>
      <dd className="text-sm font-semibold text-slate-900">{children}</dd>
    </div>
  );
}

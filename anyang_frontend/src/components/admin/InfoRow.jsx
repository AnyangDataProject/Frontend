export default function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={15} className="mt-0.5 shrink-0 text-slate-400" />
      <div>
        <dt className="mb-1 text-xs text-slate-400">{label}</dt>
        <dd className="font-medium text-slate-800">{children}</dd>
      </div>
    </div>
  );
}

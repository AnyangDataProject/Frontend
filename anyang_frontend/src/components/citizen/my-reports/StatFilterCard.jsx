export default function StatFilterCard({ icon: Icon, iconClass, label, count, active, onClick }) {
  return (
    <button
      className={`flex min-h-[96px] items-center gap-[13px] rounded-xl border p-[18px] text-left shadow-sm transition-colors max-[520px]:min-h-[82px] max-[520px]:p-[13px] ${
        active
          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
          : "border-slate-200 bg-white hover:border-blue-300"
      }`}
      onClick={onClick}
    >
      <div
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg max-[520px]:h-9 max-[520px]:w-9 ${iconClass}`}
      >
        <Icon size={20} />
      </div>
      <div className="flex flex-col gap-1 text-left">
        <span className="text-left text-xs font-medium text-slate-500">{label}</span>
        <strong className="text-left text-2xl font-semibold leading-none text-slate-900 max-[520px]:text-xl">
          {count}
        </strong>
      </div>
    </button>
  );
}

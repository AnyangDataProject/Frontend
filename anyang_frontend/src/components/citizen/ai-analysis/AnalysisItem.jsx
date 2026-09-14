export default function AnalysisItem({ number, title, value, description }) {
  return (
    <div className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg bg-white">
      <span className="w-8 h-8 min-w-[32px] max-w-[32px] flex-none flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-bold mt-px">
        {number}
      </span>

      <div className="flex flex-col gap-[3px] min-w-0">
        <span className="text-slate-400 text-xs">
          {title}
        </span>

        <strong className="text-sm font-semibold text-slate-900">{value}</strong>

        <p className="mt-1 text-slate-500 text-xs leading-[1.5]">{description}</p>
      </div>
    </div>
  );
}

import { SEVERITY_META } from "../../../mocks/citizen/constants";

export default function MainMapLegend() {
  return (
    <div className="absolute left-4 bottom-4 z-10 bg-white rounded-xl px-3.5 py-2 flex gap-3 text-xs font-semibold text-slate-500 shadow-[0_4px_16px_rgba(15,23,42,0.1)] border border-slate-200">
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: SEVERITY_META.low.dotColor }} />
        {SEVERITY_META.low.label}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: SEVERITY_META.mid.dotColor }} />
        {SEVERITY_META.mid.label}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-[11px] h-[11px] rounded-full" style={{ background: SEVERITY_META.high.dotColor }} />
        {SEVERITY_META.high.label}
      </span>
    </div>
  );
}
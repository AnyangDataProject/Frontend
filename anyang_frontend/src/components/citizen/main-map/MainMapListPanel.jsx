import { DAMAGE_TYPE_META, SEVERITY_META, REPORT_STATUS_META } from "../../../mocks/citizen/constants";

const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "전체 유형" },
  ...Object.entries(DAMAGE_TYPE_META).map(([value, meta]) => ({ value, label: meta.label })),
];

export default function MainMapListPanel({
  open,
  counts,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  pins,
  onSelectPin,
}) {
  return (
    <div
      className={`shrink-0 overflow-hidden bg-white border-l border-slate-200 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col *:w-[380px] max-[480px]:*:w-full max-[480px]:absolute max-[480px]:inset-0 max-[480px]:z-[15] ${
        open ? "w-[380px]" : "w-0"
      }`}
    >
      <div className="flex gap-1.5 px-4 pt-4">
        <button
          className={`flex-1 border-none px-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
            statusFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"
          }`}
          onClick={() => onStatusFilterChange("all")}
        >
          전체 신고 <b className="font-extrabold ml-1">{counts.all}</b>
        </button>
        <button
          className={`flex-1 border-none px-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
            statusFilter === "open" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"
          }`}
          onClick={() => onStatusFilterChange("open")}
        >
          미처리 <b className="font-extrabold ml-1">{counts.open}</b>
        </button>
        <button
          className={`flex-1 border-none px-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
            statusFilter === "done" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"
          }`}
          onClick={() => onStatusFilterChange("done")}
        >
          처리완료 <b className="font-extrabold ml-1">{counts.done}</b>
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-4 py-3 border-b border-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TYPE_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`shrink-0 border px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${
              typeFilter === opt.value
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-500"
            }`}
            onClick={() => onTypeFilterChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-4 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded">
        {pins.length === 0 && (
          <div className="py-[60px] px-2.5 text-center text-sm text-slate-500">해당하는 신고가 없어요.</div>
        )}

        {pins.map((pin) => {
          const sev = SEVERITY_META[pin.severity];
          const st = REPORT_STATUS_META[pin.status];
          return (
            <button
              key={pin.id}
              className="flex items-start gap-3 bg-slate-50 border border-transparent rounded-xl px-4 py-3.5 text-left cursor-pointer transition-all duration-200 hover:bg-white hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              onClick={() => onSelectPin(pin)}
            >
              <span className="w-2.5 h-2.5 rounded-full mt-[5px] shrink-0" style={{ background: sev.dotColor }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-900">{DAMAGE_TYPE_META[pin.type].label}</span>
                  <span style={{ color: sev.dotColor, fontWeight: 700 }}>{sev.label}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{pin.address}</div>
                <div className="flex justify-between text-xs text-slate-400 mt-2.5 pt-2 border-t border-dashed border-slate-200">
                  <span>{pin.reportedAt}</span>
                  <span style={{ color: st.color, fontWeight: 600 }}>{st.label}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

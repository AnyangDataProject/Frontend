import { MapPin, CalendarDays, Sparkles, ChevronRight, FileText } from "lucide-react";
import { DAMAGE_TYPE_META, SEVERITY_META, REPORT_STATUS_META } from "../../../mocks/citizen/constants";

export default function ReportCard({ report, onClick }) {
  const type = DAMAGE_TYPE_META[report.type] ?? { label: report.type ?? "-", icon: FileText };
  const severity = SEVERITY_META[report.severity];
  const status = REPORT_STATUS_META[report.status];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;

  return (
    <article
      className="grid min-h-[174px] cursor-pointer grid-cols-[190px_1fr] overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-colors hover:border-blue-300 max-[800px]:grid-cols-[135px_1fr] max-[520px]:grid-cols-[105px_1fr]"
      onClick={onClick}
    >
      <div className="relative min-h-[174px] overflow-hidden bg-slate-100 max-[800px]:min-h-[180px] max-[520px]:min-h-[170px]">
        <img src={report.imageUrl} alt={type.label} className="block h-full w-full object-cover" />
        <span
          className="absolute left-[10px] top-[10px] flex items-center gap-[5px] rounded-md px-[9px] py-[5px] text-xs font-semibold text-slate-900 backdrop-blur-sm"
          style={{
            color: severity.color,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
          }}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: severity.color }} />
          위험도 {severity.label}
        </span>
      </div>

      <div className="flex min-w-0 flex-col py-5 px-[22px] text-left max-[800px]:p-[15px] max-[520px]:p-3">
        <div className="mb-3 flex items-center justify-between gap-2.5 max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-2">
          <div className="flex items-center gap-[9px]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <TypeIcon size={16} />
            </span>
            <strong className="text-sm font-semibold text-slate-900">{type.label}</strong>
          </div>

          <div
            className="inline-flex items-center gap-[5px] whitespace-nowrap rounded-md px-2.5 py-[5px] text-xs font-medium max-[800px]:self-start"
            style={{
              color: status.color,
              backgroundColor: `${status.color}1F`,
            }}
          >
            <StatusIcon size={15} />
            {status.label}
          </div>
        </div>

        <div className="mb-1.5 flex items-center gap-[5px] text-left text-sm font-medium text-slate-900 max-[520px]:items-start max-[520px]:leading-[1.4]">
          <MapPin size={15} className="shrink-0 text-blue-600" />
          {report.address}
        </div>

        <div className="flex items-center gap-[5px] text-left text-xs text-slate-400">
          <CalendarDays size={14} />
          신고일 {report.reportedAt}
        </div>

        <p className="my-[10px] mb-[14px] line-clamp-2 text-left text-xs leading-[1.6] text-slate-500 max-[800px]:hidden">
          {report.description}
        </p>

        <div className="mt-auto flex items-center justify-between max-[800px]:mt-3 max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-2">
          <div className="flex items-center gap-[5px] text-xs text-slate-400">
            <Sparkles size={14} className="shrink-0 text-blue-600" />
            AI 분석 신뢰도{" "}
            <strong className="text-slate-900">
              {report.aiConfidence != null ? `${report.aiConfidence}%` : "탐지 없음"}
            </strong>
          </div>

          <span className="flex items-center gap-0.5 text-xs font-medium text-blue-600">
            상세보기
            <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}

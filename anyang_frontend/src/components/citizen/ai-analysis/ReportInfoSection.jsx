import { MapPin, CalendarDays, User } from "lucide-react";
import AnalysisCard from "./AnalysisCard";

export default function ReportInfoSection({ report, status, StatusIcon }) {
  return (
    <AnalysisCard
      eyebrow="REPORT INFORMATION"
      title="신고 정보"
      className="overflow-hidden"
      action={
        <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium">
          신고 #{String(report.id).padStart(4, "0")}
        </span>
      }
    >
      <div className="grid grid-cols-4 gap-[9px] mt-[15px] max-[700px]:grid-cols-1">
        <div className="flex items-center gap-3 min-h-[76px] p-[13px] border border-slate-200 rounded-lg bg-white text-left">
          <MapPin size={17} className="shrink-0 text-blue-600" />
          <div className="flex flex-col gap-[3px] min-w-0">
            <span className="text-slate-400 text-xs">신고 위치</span>
            <strong className="text-sm font-medium text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap">
              {report.address}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3 min-h-[76px] p-[13px] border border-slate-200 rounded-lg bg-white text-left">
          <CalendarDays size={17} className="shrink-0 text-blue-600" />
          <div className="flex flex-col gap-[3px] min-w-0">
            <span className="text-slate-400 text-xs">신고일</span>
            <strong className="text-sm font-medium text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap">
              {report.reportedAt}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3 min-h-[76px] p-[13px] border border-slate-200 rounded-lg bg-white text-left">
          <User size={17} className="shrink-0 text-blue-600" />
          <div className="flex flex-col gap-[3px] min-w-0">
            <span className="text-slate-400 text-xs">신고자</span>
            <strong className="text-sm font-medium text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap">
              {report.reporter ?? "정보 없음"}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3 min-h-[76px] p-[13px] border border-slate-200 rounded-lg bg-white text-left">
          <StatusIcon size={17} className="shrink-0 text-blue-600" />
          <div className="flex flex-col gap-[3px] min-w-0">
            <span className="text-slate-400 text-xs">처리 상태</span>
            <strong className={`text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap ${status.textClass}`}>
              {status.label}
            </strong>
          </div>
        </div>
      </div>
    </AnalysisCard>
  );
}

import { CalendarDays, ChevronRight } from "lucide-react";
import { INQUIRY_STATUS_META } from "../../../mocks/citizen/constants";
import { INQUIRY_TYPES } from "../../../mocks/citizen/inquiryData";

export default function InquiryCard({ inquiry, onClick }) {
  const typeLabel = INQUIRY_TYPES.find((t) => t.value === inquiry.type)?.label ?? "기타 민원";
  const status = INQUIRY_STATUS_META[inquiry.status] ?? INQUIRY_STATUS_META.waiting;
  const StatusIcon = status.icon;

  return (
    <article
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-blue-300 max-[520px]:p-4"
      onClick={onClick}
    >
      <div className="mb-3 flex items-center justify-between gap-2.5">
        <span className="rounded-md bg-blue-50 px-2.5 py-[5px] text-xs font-medium text-blue-600">{typeLabel}</span>

        <div
          className="inline-flex items-center gap-[5px] whitespace-nowrap rounded-md px-2.5 py-[5px] text-xs font-medium"
          style={{ color: status.color, backgroundColor: `${status.color}1F` }}
        >
          <StatusIcon size={15} />
          {status.label}
        </div>
      </div>

      <h3 className="mb-2 break-words text-sm font-semibold text-slate-900">{inquiry.title}</h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] text-xs text-slate-400">
          <CalendarDays size={14} />
          문의일 {inquiry.createdAt}
        </div>

        <span className="flex items-center gap-0.5 text-xs font-medium text-blue-600">
          상세보기
          <ChevronRight size={16} />
        </span>
      </div>
    </article>
  );
}

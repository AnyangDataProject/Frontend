import { RotateCcw } from 'lucide-react';
import { INQUIRY_TYPE_META } from '../../../mocks/admin/constants';

export default function AdminInquiriesFilterPanel({
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3">
      <label className="flex flex-col gap-1 text-xs text-slate-500">
        답변 상태
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none"
        >
          <option value="all">전체 상태</option>
          <option value="waiting">답변 대기</option>
          <option value="answered">답변 완료</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-slate-500">
        문의 유형
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none"
        >
          <option value="all">전체 유형</option>
          {Object.entries(INQUIRY_TYPE_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={onReset}
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
      >
        <RotateCcw size={13} /> 필터 초기화
      </button>
    </div>
  );
}

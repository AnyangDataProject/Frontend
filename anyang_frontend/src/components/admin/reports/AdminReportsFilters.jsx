import { RotateCcw, Search } from 'lucide-react';
import { DAMAGE_TYPE_META, REPORTABLE_DAMAGE_TYPES, SEVERITY_UI_META } from '../../../mocks/admin/constants';

export default function AdminReportsFilters({
  keyword,
  onKeywordChange,
  typeFilter,
  onTypeFilterChange,
  severityFilter,
  onSeverityFilterChange,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
        <Search size={14} className="text-slate-400" />
        <input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="신고번호, 주소, 신고자, 유형 검색"
          className="w-64 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600 outline-none"
      >
        <option value="all">전체 유형</option>
        {REPORTABLE_DAMAGE_TYPES.map((key) => (
          <option key={key} value={key}>
            {DAMAGE_TYPE_META[key].label}
          </option>
        ))}
      </select>
      <select
        value={severityFilter}
        onChange={(e) => onSeverityFilterChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600 outline-none"
      >
        <option value="all">전체 위험도</option>
        {Object.entries(SEVERITY_UI_META).map(([key, meta]) => (
          <option key={key} value={key}>
            {meta.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-50"
      >
        <RotateCcw size={13} /> 필터 초기화
      </button>
    </div>
  );
}

import { Search } from 'lucide-react';
import { DAMAGE_TYPE_META } from '../../../mocks/admin/constants';

export default function AdminReportsFilters({ keyword, onKeywordChange, typeFilter, onTypeFilterChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
        <Search size={14} className="text-slate-400" />
        <input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="신고번호, 주소 검색"
          className="w-40 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600 outline-none"
      >
        <option value="all">전체 유형</option>
        {Object.entries(DAMAGE_TYPE_META).map(([key, meta]) => (
          <option key={key} value={key}>
            {meta.label}
          </option>
        ))}
      </select>
    </div>
  );
}

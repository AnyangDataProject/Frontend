import { Search } from 'lucide-react';

export default function AdminMembersFilters({ keyword, onKeywordChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
        <Search size={14} className="text-slate-400" />
        <input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="아이디, 이름, 이메일 검색"
          className="w-48 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600 outline-none"
      >
        <option value="all">전체 상태</option>
        <option value="active">정상</option>
        <option value="restricted">이용 제한</option>
      </select>
    </div>
  );
}

import { Search, Filter } from 'lucide-react';

export default function AdminInquiriesToolbar({ keyword, onKeywordChange, filterOpen, onToggleFilterOpen }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
        <Search size={14} className="text-slate-400" />
        <input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="문의번호, 제목 검색"
          className="w-48 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <button
        onClick={() => onToggleFilterOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
          filterOpen ? 'border-blue-600 text-blue-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
        }`}
      >
        <Filter size={14} /> 필터
      </button>
    </div>
  );
}

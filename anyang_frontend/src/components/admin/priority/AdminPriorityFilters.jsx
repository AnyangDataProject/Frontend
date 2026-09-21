import { Search } from 'lucide-react';
import { PRIORITY_GRADE_META } from '../../../mocks/admin/constants';

const RISK_TABS = [
  { key: 'all', label: '전체' },
  ...Object.entries(PRIORITY_GRADE_META).map(([key, meta]) => ({ key, label: meta.label })),
];

const DISTRICTS = ['만안구', '동안구'];

export default function AdminPriorityFilters({
  keyword,
  onKeywordChange,
  riskFilter,
  onRiskFilterChange,
  districtFilter,
  onDistrictFilterChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
        <Search size={14} className="text-slate-400" />
        <input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="도로명 검색"
          className="w-40 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <select
        value={districtFilter}
        onChange={(e) => onDistrictFilterChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600 outline-none"
      >
        <option value="all">전체 구</option>
        {DISTRICTS.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
      <div className="flex overflow-hidden rounded-lg border border-slate-200">
        {RISK_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onRiskFilterChange(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              riskFilter === tab.key ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

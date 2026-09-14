import { MapPin } from 'lucide-react';
import Badge from '../Badge';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import Pagination from '../Pagination';
import { DAMAGE_TYPE_META, REPORT_STATUS_STEPS, SEVERITY_META } from '../../../mocks/admin/constants';

const STATUS_TABS = [{ key: 'all', label: '전체' }, ...REPORT_STATUS_STEPS];
const PAGE_SIZE = 15;

export default function AdminReportsTable({
  loading,
  reports,
  statusFilter,
  onStatusFilterChange,
  page,
  onPageChange,
  onRowClick,
  onStatusChange,
}) {
  const totalPages = Math.max(1, Math.ceil(reports.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = reports.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-5 pt-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onStatusFilterChange(tab.key)}
            className={`shrink-0 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === tab.key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : reports.length === 0 ? (
        <EmptyState title="조건에 맞는 신고가 없습니다" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                  <th className="w-24 py-3 pl-5 font-medium">신고번호</th>
                  <th className="w-28 py-3 font-medium">파손유형</th>
                  <th className="py-3 font-medium">위치</th>
                  <th className="w-40 py-3 font-medium">AI 판단 결과</th>
                  <th className="w-24 py-3 font-medium">등록일</th>
                  <th className="w-44 py-3 pr-5 font-medium">처리상태</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => onRowClick(r.id)}
                    className="cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-3 pl-5 font-semibold text-slate-700">#{r.id}</td>
                    <td className="py-3 text-slate-700">{DAMAGE_TYPE_META[r.type].label}</td>
                    <td className="py-3 text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="shrink-0 text-slate-400" />
                        <span className="truncate">{r.address}</span>
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Badge tone={SEVERITY_META[r.severity].tone}>{SEVERITY_META[r.severity].label}</Badge>
                        <span className="text-xs text-slate-400">{r.aiConfidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-slate-500">{r.createdAt}</td>
                    <td className="py-3 pr-5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={r.status}
                        onChange={(e) => onStatusChange(r.id, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500"
                      >
                        {REPORT_STATUS_STEPS.filter((step, i) => {
                          const currentIndex = REPORT_STATUS_STEPS.findIndex((s) => s.key === r.status);
                          return i === currentIndex || i === currentIndex + 1;
                        }).map((step) => (
                          <option key={step.key} value={step.key}>
                            {step.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            summary={`총 ${reports.length}건 중 ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(
              currentPage * PAGE_SIZE,
              reports.length
            )}건 표시`}
          />
        </>
      )}
    </>
  );
}

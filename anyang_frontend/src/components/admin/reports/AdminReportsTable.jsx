import { AlertTriangle, MapPin } from 'lucide-react';
import Badge from '../Badge';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import Pagination from '../Pagination';
import { DAMAGE_TYPE_META } from '../../../mocks/admin/constants';
import { SEVERITY_TO_UI } from '../../../api/enumMapping';

const STATUS_TABS = [
  { key: 'all', label: '전체' },
  { key: 'received', label: '접수됨' },
  { key: 'progress', label: '처리중' },
  { key: 'done', label: '처리완료' },
];

const SEVERITY_META = {
  low: { label: '낮음', tone: 'success' },
  mid: { label: '보통', tone: 'warning' },
  high: { label: '높음', tone: 'danger' },
};

// 관리자가 다음 단계로 진행시킬 때 보낼 백엔드 enum 옵션
const NEXT_STATUS_OPTIONS = {
  RECEIVED: [
    { value: 'RECEIVED', label: '접수됨' },
    { value: 'CONFIRMED', label: '확인됨' },
  ],
  AI_ANALYZED: [
    { value: 'AI_ANALYZED', label: 'AI 분석 완료' },
    { value: 'CONFIRMED', label: '확인됨' },
  ],
  CONFIRMED: [
    { value: 'CONFIRMED', label: '확인됨' },
    { value: 'IN_PROGRESS', label: '처리중' },
  ],
  IN_PROGRESS: [
    { value: 'IN_PROGRESS', label: '처리중' },
    { value: 'COMPLETED', label: '처리완료' },
  ],
  COMPLETED: [{ value: 'COMPLETED', label: '처리완료' }],
  REJECTED: [{ value: 'REJECTED', label: '반려' }],
};

const PAGE_SIZE = 15;

export default function AdminReportsTable({
  loading,
  error,
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

      {error ? (
        <EmptyState icon={AlertTriangle} title="신고 목록을 불러오지 못했습니다" description={error.message} />
      ) : loading ? (
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
                {paged.map((r) => {
                  const uiSeverity = SEVERITY_TO_UI[r.severity] ?? 'low';
                  const rawStatus = (r.status ?? 'received').toUpperCase();
                  const options = NEXT_STATUS_OPTIONS[rawStatus] ?? NEXT_STATUS_OPTIONS.RECEIVED;
                  const damageType = DAMAGE_TYPE_META[r.type] ?? { label: r.type ?? '-' };

                  return (
                    <tr
                      key={r.id}
                      onClick={() => onRowClick(r.id)}
                      className="cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50"
                    >
                      <td className="py-3 pl-5 font-semibold text-slate-700">#{r.id}</td>
                      <td className="py-3 text-slate-700">{damageType.label}</td>
                      <td className="py-3 text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="shrink-0 text-slate-400" />
                          <span className="truncate">{r.address}</span>
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <Badge tone={SEVERITY_META[uiSeverity].tone}>{SEVERITY_META[uiSeverity].label}</Badge>
                          <span className="text-xs text-slate-400">
                            {r.aiConfidence != null ? `${Math.round(r.aiConfidence)}%` : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-xs text-slate-500">
                        {r.reportedAt ? r.reportedAt.slice(0, 10) : '-'}
                      </td>
                      <td className="py-3 pr-5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={rawStatus}
                          onChange={(e) => onStatusChange(r.id, e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500"
                        >
                          {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
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
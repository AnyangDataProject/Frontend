import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import Badge from '../../components/admin/Badge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import { fetchReports, updateReportStatus } from '../../mocks/admin/api';
import { DAMAGE_TYPE_META, REPORT_STATUS_STEPS, SEVERITY_META } from '../../mocks/admin/constants';

const PAGE_SIZE = 15;

const STATUS_TABS = [{ key: 'all', label: '전체' }, ...REPORT_STATUS_STEPS];

export default function AdminReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchReports().then(setReports);
  }, []);

  const filtered = useMemo(() => {
    if (!reports) return [];
    const kw = keyword.trim().toLowerCase();
    return reports.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesType = typeFilter === 'all' || r.type === typeFilter;
      const matchesKeyword = !kw || r.id.includes(kw) || r.address.toLowerCase().includes(kw);
      return matchesStatus && matchesType && matchesKeyword;
    });
  }, [reports, statusFilter, typeFilter, keyword]);

  const setStatusFilterAndResetPage = (value) => {
    setStatusFilter(value);
    setPage(1);
  };
  const setTypeFilterAndResetPage = (value) => {
    setTypeFilter(value);
    setPage(1);
  };
  const setKeywordAndResetPage = (value) => {
    setKeyword(value);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = async (id, nextStatus) => {
    const updated = await updateReportStatus(id, nextStatus);
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  return (
    <AdminLayout title="신고 관리" description="시민이 등록한 도로파손 신고를 확인하고 처리 상태를 관리하세요.">
      <Card
        bodyClassName="p-0"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
              <Search size={14} className="text-slate-400" />
              <input
                value={keyword}
                onChange={(e) => setKeywordAndResetPage(e.target.value)}
                placeholder="신고번호, 주소 검색"
                className="w-40 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilterAndResetPage(e.target.value)}
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
        }
      >
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-5 pt-4">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilterAndResetPage(tab.key)}
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

        {!reports ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
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
                      onClick={() => navigate(`/admin/reports/${r.id}`)}
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
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500"
                        >
                          {REPORT_STATUS_STEPS.map((step) => (
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

            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <p className="text-xs text-slate-400">
                총 {filtered.length}건 중 {(page - 1) * PAGE_SIZE + 1}-
                {Math.min(page * PAGE_SIZE, filtered.length)}건 표시
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2 text-xs text-slate-500">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </AdminLayout>
  );
}

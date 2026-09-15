import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import AdminPriorityFilters from '../../components/admin/priority/AdminPriorityFilters';
import AdminPriorityTable from '../../components/admin/priority/AdminPriorityTable';
import { useAdminListQuery } from '../../hooks/admin/useAdminListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchPriorityClusters, fetchUnclassifiedReports } from '../../api/admin';

export default function AdminPriority() {
  const navigate = useNavigate();
  const { data: roads } = useAdminListQuery(fetchPriorityClusters);
  const { data: unclassifiedReports } = useAdminListQuery(fetchUnclassifiedReports);
  const [riskFilter, setRiskFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  const filtered = useListFilter(roads, (road) => {
    const kw = keyword.trim().toLowerCase();
    const matchesRisk = riskFilter === 'all' || road.priorityGrade === riskFilter;
    const matchesKeyword = !kw || (road.roadAddress ?? '').toLowerCase().includes(kw);
    return matchesRisk && matchesKeyword;
  });

  return (
    <AdminLayout
      title="점검 우선순위"
      description="종합 위험도 점수가 높은 구간부터 우선적으로 점검하세요."
    >
      <Card
        bodyClassName="p-0"
        title={roads ? `총 ${roads.length}개 구간` : undefined}
        actions={
          <AdminPriorityFilters
            keyword={keyword}
            onKeywordChange={setKeyword}
            riskFilter={riskFilter}
            onRiskFilterChange={setRiskFilter}
          />
        }
      >
        <AdminPriorityTable
          loading={!roads}
          roads={filtered}
          onRowClick={(id) => navigate(`/admin/roads/${id}`)}
        />
      </Card>

      <Card
        className="mt-4"
        title={
          unclassifiedReports
            ? `미분류 신고 (${unclassifiedReports.length}건)`
            : '미분류 신고'
        }
        description="기존 분석 구간에 매칭되지 않은 시민 신고입니다."
      >
        {!unclassifiedReports ? (
          <p className="py-6 text-center text-sm text-slate-400">불러오는 중...</p>
        ) : unclassifiedReports.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">미분류 신고가 없습니다.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-slate-100">
            {unclassifiedReports.map((report) => (
              <li key={report.id}>
                <button
                  onClick={() => navigate(`/admin/reports/${report.id}`)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-700">#{report.id}</span>
                  <span className="flex-1 truncate text-slate-500">
                    {report.address || '주소 정보 없음'}
                  </span>
                  <span className="text-xs text-slate-400">{report.userName ?? '-'}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AdminLayout>
  );
}
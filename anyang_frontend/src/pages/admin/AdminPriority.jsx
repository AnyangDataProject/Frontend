import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import AdminPriorityFilters from '../../components/admin/priority/AdminPriorityFilters';
import AdminPriorityTable from '../../components/admin/priority/AdminPriorityTable';
import { useAdminListQuery } from '../../hooks/admin/useAdminListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchPriorityRoads } from '../../mocks/admin/api';

export default function AdminPriority() {
  const navigate = useNavigate();
  const { data: roads } = useAdminListQuery(fetchPriorityRoads);
  const [riskFilter, setRiskFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  const filtered = useListFilter(roads, (road) => {
    const kw = keyword.trim().toLowerCase();
    const matchesRisk = riskFilter === 'all' || road.riskLevel === riskFilter;
    const matchesKeyword = !kw || road.name.toLowerCase().includes(kw) || road.district.includes(kw);
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
    </AdminLayout>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import AdminReportsFilters from '../../components/admin/reports/AdminReportsFilters';
import AdminReportsTable from '../../components/admin/reports/AdminReportsTable';
import { useAdminListQuery } from '../../hooks/admin/useAdminListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchReports, updateReportStatus } from '../../mocks/admin/api';

export default function AdminReports() {
  const navigate = useNavigate();
  const { data: reports, setData: setReports } = useAdminListQuery(fetchReports);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useListFilter(reports, (r) => {
    const kw = keyword.trim().toLowerCase();
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesKeyword = !kw || r.id.includes(kw) || r.address.toLowerCase().includes(kw);
    return matchesStatus && matchesType && matchesKeyword;
  });

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

  const handleStatusChange = async (id, nextStatus) => {
    const updated = await updateReportStatus(id, nextStatus);
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  return (
    <AdminLayout title="신고 관리" description="시민이 등록한 도로파손 신고를 확인하고 처리 상태를 관리하세요.">
      <Card
        bodyClassName="p-0"
        actions={
          <AdminReportsFilters
            keyword={keyword}
            onKeywordChange={setKeywordAndResetPage}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilterAndResetPage}
          />
        }
      >
        <AdminReportsTable
          loading={!reports}
          reports={filtered}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilterAndResetPage}
          page={page}
          onPageChange={setPage}
          onRowClick={(id) => navigate(`/admin/reports/${id}`)}
          onStatusChange={handleStatusChange}
        />
      </Card>
    </AdminLayout>
  );
}

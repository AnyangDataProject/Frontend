import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import AdminReportsFilters from '../../components/admin/reports/AdminReportsFilters';
import AdminReportsTable from '../../components/admin/reports/AdminReportsTable';
import { useListQuery } from '../../hooks/useListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchAllReports, updateReportStatusAdmin } from '../../api/report';
import ConfirmModal from '../../components/common/ConfirmModal';
import { SEVERITY_TO_UI, STATUS_TO_UI, REJECT_OPTION } from '../../api/enumMapping';
import { DAMAGE_TYPE_META } from '../../mocks/admin/constants';

export default function AdminReports() {
  const navigate = useNavigate();
  const { data: reports, setData: setReports, error } = useListQuery(fetchAllReports);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useListFilter(reports, (r) => {
    const kw = keyword.trim().toLowerCase();
    const uiStatus = STATUS_TO_UI[r.status] ?? 'received';
    const uiSeverity = SEVERITY_TO_UI[r.severity] ?? 'low';
    const matchesStatus = statusFilter === 'all' || uiStatus === statusFilter;
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || uiSeverity === severityFilter;
    const damageLabel = DAMAGE_TYPE_META[r.type]?.label ?? '';
    const matchesKeyword =
      !kw ||
      String(r.id).includes(kw) ||
      (r.address ?? '').toLowerCase().includes(kw) ||
      (r.userName ?? '').toLowerCase().includes(kw) ||
      damageLabel.toLowerCase().includes(kw);
    return matchesStatus && matchesType && matchesSeverity && matchesKeyword;
  });

  const setStatusFilterAndResetPage = (value) => {
    setStatusFilter(value);
    setPage(1);
  };
  const setTypeFilterAndResetPage = (value) => {
    setTypeFilter(value);
    setPage(1);
  };
  const setSeverityFilterAndResetPage = (value) => {
    setSeverityFilter(value);
    setPage(1);
  };
  const setKeywordAndResetPage = (value) => {
    setKeyword(value);
    setPage(1);
  };
  const handleResetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSeverityFilter('all');
    setKeyword('');
    setPage(1);
  };

  const applyStatus = async (id, nextStatus) => {
    try {
      await updateReportStatusAdmin(id, nextStatus);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: nextStatus.toLowerCase() } : r))
      );
    } catch (err) {
      alert(err.message || '신고 상태 변경에 실패했습니다.');
    }
  };

  // 반려는 UI에서 되돌릴 수 없어서 확인 모달을 거침
  const handleStatusChange = (id, nextStatus) => {
    if (nextStatus === REJECT_OPTION.value) {
      setRejectTargetId(id);
      return;
    }
    applyStatus(id, nextStatus);
  };

  const handleConfirmReject = async () => {
    const id = rejectTargetId;
    setRejecting(true);
    await applyStatus(id, REJECT_OPTION.value);
    setRejecting(false);
    setRejectTargetId(null);
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
            severityFilter={severityFilter}
            onSeverityFilterChange={setSeverityFilterAndResetPage}
            onReset={handleResetFilters}
          />
        }
      >
        <AdminReportsTable
          loading={!reports}
          error={error}
          reports={filtered}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilterAndResetPage}
          page={page}
          onPageChange={setPage}
          onRowClick={(id) => navigate(`/admin/reports/${id}`)}
          onStatusChange={handleStatusChange}
        />
      </Card>

      <ConfirmModal
        open={rejectTargetId != null}
        title={`신고 #${rejectTargetId}을(를) 반려하시겠습니까?`}
        description="반려한 신고는 화면에서 다시 다른 상태로 변경할 수 없습니다."
        confirmLabel="반려"
        tone="danger"
        loading={rejecting}
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectTargetId(null)}
      />
    </AdminLayout>
  );
}
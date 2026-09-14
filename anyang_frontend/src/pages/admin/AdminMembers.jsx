import { useState } from 'react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import ConfirmModal from '../../components/common/ConfirmModal';
import AdminMembersFilters from '../../components/admin/members/AdminMembersFilters';
import AdminMembersTable from '../../components/admin/members/AdminMembersTable';
import { useAdminListQuery } from '../../hooks/admin/useAdminListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchMembers, updateMemberStatus } from '../../api/admin';

export default function AdminMembers() {
  const { data: members, setData: setMembers } = useAdminListQuery(fetchMembers);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingId, setPendingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const filtered = useListFilter(members, (m) => {
    const kw = keyword.trim().toLowerCase();
    const matchesKeyword =
      !kw ||
      String(m.id).toLowerCase().includes(kw) ||
      (m.name ?? '').toLowerCase().includes(kw) ||
      (m.email ?? '').toLowerCase().includes(kw);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  const willRestrict = confirmTarget?.status === 'active';

  const handleConfirmToggle = async () => {
    const member = confirmTarget;
    const nextStatus = member.status === 'active' ? 'restricted' : 'active';
    setPendingId(member.id);
    try {
      const updated = await updateMemberStatus(member.id, nextStatus);
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, ...updated } : m)));
      setConfirmTarget(null);
    } catch (err) {
      alert(err.message || '회원 상태 변경에 실패했습니다.');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <AdminLayout title="회원 관리" description="시민 계정을 조회하고 이용 제한 여부를 관리하세요.">
      <Card
        bodyClassName="p-0"
        actions={
          <AdminMembersFilters
            keyword={keyword}
            onKeywordChange={setKeyword}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        }
      >
        <AdminMembersTable
          loading={!members}
          members={filtered}
          pendingId={pendingId}
          onToggleStatus={setConfirmTarget}
        />
      </Card>

      <ConfirmModal
        open={!!confirmTarget}
        title={
          willRestrict
            ? `${confirmTarget?.name}님의 이용을 제한하시겠습니까?`
            : `${confirmTarget?.name}님의 이용 제한을 해제하시겠습니까?`
        }
        description={
          willRestrict
            ? '이용 제한 시 해당 회원은 신고 및 문의 기능을 사용할 수 없습니다.'
            : '제한을 해제하면 해당 회원이 다시 정상적으로 서비스를 이용할 수 있습니다.'
        }
        confirmLabel={willRestrict ? '이용 제한' : '제한 해제'}
        tone={willRestrict ? 'danger' : 'default'}
        loading={pendingId === confirmTarget?.id}
        onConfirm={handleConfirmToggle}
        onCancel={() => setConfirmTarget(null)}
      />
    </AdminLayout>
  );
}

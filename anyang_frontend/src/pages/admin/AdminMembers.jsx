import { useState } from 'react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import AdminMembersFilters from '../../components/admin/members/AdminMembersFilters';
import AdminMembersTable from '../../components/admin/members/AdminMembersTable';
import { useAdminListQuery } from '../../hooks/admin/useAdminListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchMembers, updateMemberStatus } from '../../mocks/admin/api';

export default function AdminMembers() {
  const { data: members, setData: setMembers } = useAdminListQuery(fetchMembers);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingId, setPendingId] = useState(null);

  const filtered = useListFilter(members, (m) => {
    const kw = keyword.trim().toLowerCase();
    const matchesKeyword =
      !kw || m.id.toLowerCase().includes(kw) || m.name.toLowerCase().includes(kw) || m.email.toLowerCase().includes(kw);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  const handleToggleStatus = async (member) => {
    const nextStatus = member.status === 'active' ? 'restricted' : 'active';
    setPendingId(member.id);
    const updated = await updateMemberStatus(member.id, nextStatus);
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, ...updated } : m)));
    setPendingId(null);
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
          onToggleStatus={handleToggleStatus}
        />
      </Card>
    </AdminLayout>
  );
}

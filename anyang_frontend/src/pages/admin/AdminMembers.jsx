import { useState } from 'react';
import { Search, ShieldOff, ShieldCheck } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import Badge from '../../components/admin/Badge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import { useAdminListQuery } from '../../hooks/admin/useAdminListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchMembers, updateMemberStatus } from '../../mocks/admin/api';
import { MEMBER_STATUS_META } from '../../mocks/admin/constants';

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
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
              <Search size={14} className="text-slate-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="아이디, 이름, 이메일 검색"
                className="w-48 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600 outline-none"
            >
              <option value="all">전체 상태</option>
              <option value="active">정상</option>
              <option value="restricted">이용 제한</option>
            </select>
          </div>
        }
      >
        {!members ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState title="조건에 맞는 회원이 없습니다" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                  <th className="w-24 py-3 pl-5 font-medium">아이디</th>
                  <th className="py-3 font-medium">이름 / 이메일</th>
                  <th className="w-28 py-3 font-medium">가입일</th>
                  <th className="w-24 py-3 font-medium">신고 횟수</th>
                  <th className="w-44 py-3 font-medium">계정 상태</th>
                  <th className="w-32 py-3 pr-5 font-medium">이용 제한</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-3 pl-5 font-medium text-slate-700">{m.id}</td>
                    <td className="py-3">
                      <div className="font-medium text-slate-800">{m.name}</div>
                      <div className="text-xs text-slate-400">{m.email}</div>
                    </td>
                    <td className="py-3 text-slate-500">{m.joinedAt}</td>
                    <td className="py-3 text-slate-600">{m.reportCount}건</td>
                    <td className="py-3">
                      <Badge tone={MEMBER_STATUS_META[m.status].tone} dot>
                        {MEMBER_STATUS_META[m.status].label}
                      </Badge>
                      {m.restrictionReason && (
                        <p className="mt-1 max-w-[200px] whitespace-nowrap text-[11px] text-slate-400">{m.restrictionReason}</p>
                      )}
                    </td>
                    <td className="py-3 pr-5">
                      <button
                        onClick={() => handleToggleStatus(m)}
                        disabled={pendingId === m.id}
                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                          m.status === 'active'
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {m.status === 'active' ? (
                          <>
                            <ShieldOff size={13} /> 이용 제한
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={13} /> 제한 해제
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}

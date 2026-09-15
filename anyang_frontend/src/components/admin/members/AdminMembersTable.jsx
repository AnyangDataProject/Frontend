import { AlertTriangle, ShieldOff, ShieldCheck } from 'lucide-react';
import Badge from '../Badge';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import { MEMBER_STATUS_META } from '../../../mocks/admin/constants';

export default function AdminMembersTable({ loading, error, members, pendingId, onToggleStatus }) {
  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="회원 목록을 불러오지 못했습니다"
        description={error.message}
      />
    );
  }
  if (loading) return <LoadingState />;
  if (members.length === 0) return <EmptyState title="조건에 맞는 회원이 없습니다" />;

  return (
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
          {members.map((m) => (
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
                  onClick={() => onToggleStatus(m)}
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
  );
}

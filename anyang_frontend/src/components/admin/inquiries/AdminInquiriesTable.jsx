import { MessageSquare } from 'lucide-react';
import Badge from '../Badge';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import { INQUIRY_STATUS_META, INQUIRY_TYPE_META } from '../../../mocks/admin/constants';

export default function AdminInquiriesTable({ loading, inquiries, onRowClick }) {
  if (loading) return <LoadingState />;
  if (inquiries.length === 0) {
    return <EmptyState icon={MessageSquare} title="검색 결과가 없습니다" description="검색어나 필터 조건을 변경해보세요." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
            <th className="w-20 py-3 pl-5 font-medium">문의번호</th>
            <th className="w-32 py-3 pr-4 font-medium">유형</th>
            <th className="py-3 font-medium">제목</th>
            <th className="w-28 py-3 font-medium">문의자</th>
            <th className="w-24 py-3 font-medium">작성일</th>
            <th className="w-24 py-3 font-medium">신고번호</th>
            <th className="w-24 py-3 pr-5 font-medium">상태</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr
              key={inquiry.id}
              onClick={() => onRowClick(inquiry)}
              className="cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50"
            >
              <td className="py-3 pl-5 font-semibold text-slate-700">#{String(inquiry.id).padStart(4, '0')}</td>
              <td className="py-3 pr-4 text-slate-600">{INQUIRY_TYPE_META[inquiry.type].label}</td>
              <td className="py-3">
                <p className="font-medium text-slate-800">{inquiry.title}</p>
                <p className="max-w-[360px] truncate text-xs text-slate-400">{inquiry.content}</p>
              </td>
              <td className="py-3 text-slate-600">{inquiry.reporter}</td>
              <td className="py-3 text-xs text-slate-500">{inquiry.createdAt}</td>
              <td className="py-3">
                {inquiry.reportId ? (
                  <span className="font-medium text-blue-600">#{inquiry.reportId}</span>
                ) : (
                  <span className="text-slate-300">-</span>
                )}
              </td>
              <td className="py-3 pr-5">
                <Badge tone={INQUIRY_STATUS_META[inquiry.status].tone} dot>
                  {INQUIRY_STATUS_META[inquiry.status].label}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

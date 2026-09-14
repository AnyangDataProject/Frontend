import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Filter,
  RotateCcw,
  Clock3,
  Send,
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/admin/Badge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import InquiryDetailModal from '../../components/admin/InquiryDetailModal';
import { useAdminListQuery } from '../../hooks/admin/useAdminListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchInquiries, submitInquiryAnswer } from '../../mocks/admin/api';
import { INQUIRY_STATUS_META, INQUIRY_TYPE_META } from '../../mocks/admin/constants';

export default function AdminInquiries() {
  const navigate = useNavigate();

  const { data: inquiries, setData: setInquiries } = useAdminListQuery(fetchInquiries);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => {
    if (!inquiries) return { total: 0, waiting: 0, answered: 0 };
    return {
      total: inquiries.length,
      waiting: inquiries.filter((i) => i.status === 'waiting').length,
      answered: inquiries.filter((i) => i.status === 'answered').length,
    };
  }, [inquiries]);

  const filtered = useListFilter(inquiries, (inquiry) => {
    const keyword = searchKeyword.trim().toLowerCase();
    const matchesSearch =
      !keyword ||
      String(inquiry.id).includes(keyword) ||
      inquiry.title.toLowerCase().includes(keyword) ||
      inquiry.content.toLowerCase().includes(keyword) ||
      inquiry.reporter.toLowerCase().includes(keyword);
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    const matchesType = typeFilter === 'all' || inquiry.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const selectedInquiry = inquiries?.find((i) => i.id === selectedId) ?? null;

  const openInquiry = (inquiry) => {
    setSelectedId(inquiry.id);
    setAnswer(inquiry.answer || '');
  };

  const closeInquiry = () => {
    setSelectedId(null);
    setAnswer('');
  };

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    const updated = await submitInquiryAnswer(selectedInquiry.id, answer);
    setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSubmitting(false);
  };

  const resetFilters = () => {
    setSearchKeyword('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <AdminLayout title="문의 관리" description="시민 문의 내역을 확인하고 답변을 관리합니다.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={MessageSquare} label="전체 문의" value={stats.total} suffix="건" tone="info" />
        <StatCard icon={Clock3} label="답변 대기" value={stats.waiting} suffix="건" tone="warning" />
        <StatCard icon={Send} label="답변 완료" value={stats.answered} suffix="건" tone="success" />
      </div>

      <Card
        className="mt-4"
        bodyClassName="p-0"
        title={inquiries ? `문의 내역 · 총 ${filtered.length}건` : undefined}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
              <Search size={14} className="text-slate-400" />
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="제목, 내용, 문의자 검색"
                className="w-48 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => setFilterOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                filterOpen ? 'border-blue-600 text-blue-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Filter size={14} /> 필터
            </button>
          </div>
        }
      >
        {filterOpen && (
          <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3">
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              답변 상태
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none"
              >
                <option value="all">전체 상태</option>
                <option value="waiting">답변 대기</option>
                <option value="answered">답변 완료</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              문의 유형
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none"
              >
                <option value="all">전체 유형</option>
                {Object.entries(INQUIRY_TYPE_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              <RotateCcw size={13} /> 필터 초기화
            </button>
          </div>
        )}

        {!inquiries ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState icon={MessageSquare} title="검색 결과가 없습니다" description="검색어나 필터 조건을 변경해보세요." />
        ) : (
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
                {filtered.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => openInquiry(inquiry)}
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
        )}
      </Card>

      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          answer={answer}
          onAnswerChange={setAnswer}
          onClose={closeInquiry}
          onSubmit={handleAnswerSubmit}
          submitting={submitting}
          onViewReport={(reportId) => navigate(`/admin/reports/${reportId}`)}
        />
      )}
    </AdminLayout>
  );
}

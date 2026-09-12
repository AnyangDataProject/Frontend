import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileWarning,
  MessageSquare,
  Search,
  Filter,
  RotateCcw,
  ChevronRight,
  X,
  Clock3,
  FileText,
  Send,
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/admin/Badge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import { fetchInquiries, submitInquiryAnswer } from '../../mocks/admin/api';
import { INQUIRY_STATUS_META, INQUIRY_TYPE_META } from '../../mocks/admin/constants';

export default function AdminInquiries() {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInquiries().then(setInquiries);
  }, []);

  const stats = useMemo(() => {
    if (!inquiries) return { total: 0, waiting: 0, answered: 0 };
    return {
      total: inquiries.length,
      waiting: inquiries.filter((i) => i.status === 'waiting').length,
      answered: inquiries.filter((i) => i.status === 'answered').length,
    };
  }, [inquiries]);

  const filtered = useMemo(() => {
    if (!inquiries) return [];
    const keyword = searchKeyword.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
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
  }, [inquiries, searchKeyword, statusFilter, typeFilter]);

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
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 pt-[104px]"
          onClick={closeInquiry}
        >
          <div
            className="flex max-h-[calc(100vh-136px)] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs text-slate-400">문의 #{String(selectedInquiry.id).padStart(4, '0')}</p>
                <h2 className="mt-0.5 text-base font-semibold text-slate-900">{selectedInquiry.title}</h2>
              </div>
              <button onClick={closeInquiry} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <FileText size={13} /> 문의 정보
                </p>
                <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400">문의 유형</p>
                    <p className="font-medium text-slate-800">{INQUIRY_TYPE_META[selectedInquiry.type].label}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">상태</p>
                    <Badge tone={INQUIRY_STATUS_META[selectedInquiry.status].tone} dot>
                      {INQUIRY_STATUS_META[selectedInquiry.status].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">문의자</p>
                    <p className="font-medium text-slate-800">{selectedInquiry.reporter}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">이메일</p>
                    <p className="font-medium text-slate-800">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">작성 일시</p>
                    <p className="font-medium text-slate-800">{selectedInquiry.createdAt}</p>
                  </div>
                </div>
              </div>

              {selectedInquiry.reportId && (
                <button
                  onClick={() => navigate(`/admin/reports/${selectedInquiry.reportId}`)}
                  className="mb-4 flex w-full items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-left hover:bg-blue-100"
                >
                  <FileWarning size={16} className="shrink-0 text-blue-600" />
                  <span className="flex-1 text-sm font-medium text-blue-700">
                    관련 신고 #{selectedInquiry.reportId} 보기
                  </span>
                  <ChevronRight size={15} className="text-blue-400" />
                </button>
              )}

              <div className="mb-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <MessageSquare size={13} /> 문의 내용
                </p>
                <p className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  {selectedInquiry.content}
                </p>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Send size={13} /> 답변 작성
                </p>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="시민에게 전달할 답변을 입력해주세요."
                  disabled={selectedInquiry.status === 'answered'}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                />
                {selectedInquiry.status === 'answered' && (
                  <p className="mt-1 text-xs text-slate-400">이미 답변이 등록된 문의입니다.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button onClick={closeInquiry} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50">
                닫기
              </button>
              <button
                onClick={handleAnswerSubmit}
                disabled={selectedInquiry.status === 'answered' || submitting || !answer.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={14} />
                {submitting ? '등록 중...' : '답변 등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

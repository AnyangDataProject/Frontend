import { useMemo, useState } from 'react';
import { MessageSquare, Clock3, Send } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import EmptyState from '../../components/admin/EmptyState';
import StatCard from '../../components/admin/StatCard';
import AdminInquiriesToolbar from '../../components/admin/inquiries/AdminInquiriesToolbar';
import AdminInquiriesFilterPanel from '../../components/admin/inquiries/AdminInquiriesFilterPanel';
import AdminInquiriesTable from '../../components/admin/inquiries/AdminInquiriesTable';
import InquiryDetailModal from '../../components/admin/inquiries/InquiryDetailModal';
import { useListQuery } from '../../hooks/useListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  fetchInquiries,
  fetchInquiryDetail,
  submitInquiryAnswer,
  deleteInquiry,
} from '../../api/inquiry';

export default function AdminInquiries() {
  const { data: inquiries, setData: setInquiries, error } = useListQuery(fetchInquiries);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      String(inquiry.id).includes(keyword) || inquiry.title.toLowerCase().includes(keyword);
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    const matchesType = typeFilter === 'all' || inquiry.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // 목록 응답에는 내용/이메일이 없어서 행을 열 때 상세를 따로 조회한다
  const openInquiry = async (inquiry) => {
    try {
      const detail = await fetchInquiryDetail(inquiry.id);
      if (!detail) throw new Error('문의 내용을 찾을 수 없습니다.');
      setSelectedInquiry(detail);
      setAnswer(detail.answer || '');
    } catch (err) {
      alert(err.message || '문의 상세를 불러오지 못했습니다.');
    }
  };

  const closeInquiry = () => {
    setSelectedInquiry(null);
    setAnswer('');
  };

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    const id = selectedInquiry.id;
    try {
      // 재조회에 실패해도(null) 답변 자체는 등록된 것이라 입력한 답변을 그대로 화면에 반영한다
      const updated =
        (await submitInquiryAnswer(id, answer)) ??
        { ...selectedInquiry, status: 'answered', answer: answer.trim() };
      // 응답을 기다리는 사이 모달이 닫혔거나 다른 문의가 열렸다면 덮어쓰지 않는다
      setSelectedInquiry((prev) => (prev?.id === id ? updated : prev));
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: updated.status } : i)));
    } catch (err) {
      alert(err.message || '답변 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteInquiry(selectedInquiry.id);
      setInquiries((prev) => prev.filter((i) => i.id !== selectedInquiry.id));
      setDeleteConfirmOpen(false);
      closeInquiry();
    } catch (err) {
      alert(err.message || '문의 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
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
          <AdminInquiriesToolbar
            keyword={searchKeyword}
            onKeywordChange={setSearchKeyword}
            filterOpen={filterOpen}
            onToggleFilterOpen={setFilterOpen}
          />
        }
      >
        {filterOpen && (
          <AdminInquiriesFilterPanel
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            onReset={resetFilters}
          />
        )}

        {error ? (
          <EmptyState title="문의 내역을 불러오지 못했습니다" description={error.message} />
        ) : (
          <AdminInquiriesTable loading={!inquiries} inquiries={filtered} onRowClick={openInquiry} />
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
          onDelete={() => setDeleteConfirmOpen(true)}
        />
      )}

      <ConfirmModal
        open={deleteConfirmOpen}
        title={`문의 #${String(selectedInquiry?.id ?? '').padStart(4, '0')}을(를) 삭제하시겠습니까?`}
        description="삭제한 문의는 복구할 수 없습니다."
        confirmLabel="삭제"
        tone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </AdminLayout>
  );
}

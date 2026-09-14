import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock3, Send } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import StatCard from '../../components/admin/StatCard';
import AdminInquiriesToolbar from '../../components/admin/inquiries/AdminInquiriesToolbar';
import AdminInquiriesFilterPanel from '../../components/admin/inquiries/AdminInquiriesFilterPanel';
import AdminInquiriesTable from '../../components/admin/inquiries/AdminInquiriesTable';
import InquiryDetailModal from '../../components/admin/inquiries/InquiryDetailModal';
import { useAdminListQuery } from '../../hooks/admin/useAdminListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchInquiries, submitInquiryAnswer } from '../../mocks/admin/api';

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

        <AdminInquiriesTable loading={!inquiries} inquiries={filtered} onRowClick={openInquiry} />
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

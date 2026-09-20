import { useMemo, useState } from "react";
import { MessageSquarePlus, MessageSquareText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/citizen/BackButton";
import PageHeader from "../../components/citizen/PageHeader";
import InquiryCard from "../../components/citizen/inquiry/InquiryCard";
import InquiryDetailModal from "../../components/citizen/inquiry/InquiryDetailModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import MessageModal from "../../components/common/MessageModal";
import { useMessageModal } from "../../hooks/useMessageModal";
import { useListQuery } from "../../hooks/useListQuery";
import { fetchInquiries, fetchInquiryDetail, updateInquiry, deleteInquiry } from "../../api/inquiry";

const STATUS_FILTER_TABS = [
  { value: "all", label: "전체" },
  { value: "waiting", label: "답변 대기" },
  { value: "answered", label: "답변 완료" },
];

// 상세 모달(z-[1000]) 위에 떠야 하는 확인/오류 모달용
const ABOVE_DETAIL_MODAL = "z-[1100]";

function Inquiry() {
  const navigate = useNavigate();
  const { data: inquiries, setData: setInquiries, loading, error } = useListQuery(fetchInquiries);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { modal, showError, close: closeModal } = useMessageModal();

  const filteredInquiries = useMemo(() => {
    if (!inquiries) return [];
    return statusFilter === "all" ? inquiries : inquiries.filter((i) => i.status === statusFilter);
  }, [inquiries, statusFilter]);

  // 목록 응답에는 내용/답변이 없어서 카드를 열 때 상세를 따로 조회한다
  const openInquiry = async (inquiry) => {
    try {
      const detail = await fetchInquiryDetail(inquiry.id);
      if (!detail) throw new Error("문의 내용을 찾을 수 없습니다.");
      setSelectedInquiry(detail);
    } catch (err) {
      showError(err.message || "문의 상세를 불러오지 못했습니다.");
    }
  };

  // 수정 성공 여부를 반환한다 (모달이 성공했을 때만 편집 모드를 닫도록)
  const handleUpdate = async (draft) => {
    try {
      const updated = await updateInquiry(selectedInquiry.id, draft);
      if (!updated) throw new Error("수정은 완료되었지만 최신 내용을 불러오지 못했습니다. 새로고침해주세요.");
      setSelectedInquiry(updated);
      setInquiries((prev) => prev.map((i) => (i.id === updated.id ? { ...i, title: updated.title } : i)));
      return true;
    } catch (err) {
      showError(err.message || "문의 수정에 실패했습니다.");
      return false;
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteInquiry(selectedInquiry.id);
      setInquiries((prev) => prev.filter((i) => i.id !== selectedInquiry.id));
      setDeleteConfirmOpen(false);
      setSelectedInquiry(null);
    } catch (err) {
      setDeleteConfirmOpen(false);
      showError(err.message || "문의 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-[72px] text-left text-slate-900 max-[768px]:pt-16">
      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10 max-[800px]:w-[calc(100%-32px)] max-[800px]:px-0 max-[800px]:pt-6 max-[800px]:pb-[60px]">
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        <PageHeader
          eyebrow="MY INQUIRIES"
          title="내 문의 내역"
          description="내가 접수한 민원 · 문의와 담당자 답변을 확인할 수 있습니다."
          action={
            <button
              className="flex shrink-0 items-center gap-2 rounded-lg border-0 bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 max-[800px]:w-full max-[800px]:justify-center"
              onClick={() => navigate("/inquiry/new")}
            >
              <MessageSquarePlus size={18} />
              문의하기
            </button>
          }
        />

        <section className="mt-2">
          <div className="mb-4 flex items-center justify-between max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              문의 내역
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                {filteredInquiries.length}
              </span>
            </h2>

            <div className="flex items-center gap-[3px] rounded-lg bg-slate-100 p-[3px] max-[800px]:w-full">
              {STATUS_FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition-all max-[800px]:flex-1 ${
                    statusFilter === tab.value ? "bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""
                  }`}
                  onClick={() => setStatusFilter(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center text-sm text-slate-400">
                불러오는 중...
              </div>
            ) : error ? (
              <div className="flex min-h-[280px] items-center justify-center text-sm text-red-500">
                {error.message || "문의 목록을 불러오지 못했습니다."}
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-center text-slate-400 shadow-sm">
                <MessageSquareText size={42} />
                <h3 className="mb-[5px] mt-[14px] text-sm font-medium text-slate-600">문의 내역이 없습니다.</h3>
                <p className="text-xs">
                  {statusFilter === "all" ? "궁금한 점이 있다면 문의하기를 눌러 접수해주세요." : "해당 상태의 문의가 없습니다."}
                </p>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <InquiryCard key={inquiry.id} inquiry={inquiry} onClick={() => openInquiry(inquiry)} />
              ))
            )}
          </div>
        </section>
      </main>

      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onUpdate={handleUpdate}
          onDelete={() => setDeleteConfirmOpen(true)}
        />
      )}

      <ConfirmModal
        open={deleteConfirmOpen}
        title="이 문의를 삭제하시겠습니까?"
        description="삭제한 문의는 복구할 수 없습니다."
        confirmLabel="삭제"
        tone="danger"
        loading={deleting}
        zIndexClass={ABOVE_DETAIL_MODAL}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

      <MessageModal
        open={!!modal}
        onClose={closeModal}
        variant={modal?.variant}
        message={modal?.message}
        zIndexClass={ABOVE_DETAIL_MODAL}
      />
    </div>
  );
}

export default Inquiry;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Clock, CheckCircle2, ChevronRight, CalendarDays } from "lucide-react";
import BackButton from "../../components/citizen/BackButton";
import PageHeader from "../../components/citizen/PageHeader";
import { getMyInquiries, getInquiryDetail } from "../../api/inquiry";
import { INQUIRY_TYPE_TO_UI, INQUIRY_STATUS_TO_UI } from "../../api/enumMapping";

const INQUIRY_TYPE_LABEL = {
  report: "신고 관련 문의",
  result: "처리 결과 문의",
  service: "서비스 이용 문의",
  other: "기타 민원",
};

const STATUS_META = {
  waiting: { label: "답변 대기", icon: Clock, color: "#d97706", bg: "bg-amber-50" },
  answered: { label: "답변 완료", icon: CheckCircle2, color: "#059669", bg: "bg-emerald-50" },
};

function normalizeInquiry(dto) {
  return {
    id: dto.id,
    type: INQUIRY_TYPE_TO_UI[dto.inquiryType] ?? "other",
    title: dto.title,
    status: INQUIRY_STATUS_TO_UI[dto.status] ?? "waiting",
    createdAt: dto.createdAt ? dto.createdAt.slice(0, 10) : "",
  };
}

export default function MyInquiries() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    getMyInquiries()
      .then((page) => setInquiries((page.content ?? []).map(normalizeInquiry)))
      .catch((err) => setError(err.message || "문의 내역을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (id) => {
    setDetailLoading(true);
    try {
      const detail = await getInquiryDetail(id);
      setSelected(detail);
    } catch (err) {
      setError(err.message || "문의 상세를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-[72px] text-left max-[768px]:pt-16">
      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        <PageHeader
          eyebrow="MY INQUIRIES"
          title="내 문의 현황"
          description="내가 접수한 민원·문의의 답변 여부를 확인할 수 있습니다."
        />

        <section className="mt-6">
          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center text-slate-400 text-sm">
              불러오는 중...
            </div>
          ) : error ? (
            <div className="flex min-h-[280px] items-center justify-center text-red-500 text-sm">
              {error}
            </div>
          ) : inquiries.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-center text-slate-400 shadow-sm">
              <MessageSquare size={42} />
              <h3 className="mt-[14px] mb-[5px] text-sm font-medium text-slate-600">문의 내역이 없습니다.</h3>
              <p className="text-xs">아직 접수한 문의가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {inquiries.map((inquiry) => {
                const status = STATUS_META[inquiry.status];
                const StatusIcon = status.icon;
                return (
                  <button
                    key={inquiry.id}
                    onClick={() => openDetail(inquiry.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-blue-300"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-xs font-medium text-blue-600">
                          {INQUIRY_TYPE_LABEL[inquiry.type]}
                        </span>
                      </div>
                      <h3 className="mb-1 truncate text-sm font-semibold text-slate-900">
                        {inquiry.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <CalendarDays size={13} />
                        {inquiry.createdAt}
                      </div>
                    </div>

                    <div
                      className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium ${status.bg}`}
                      style={{ color: status.color }}
                    >
                      <StatusIcon size={14} />
                      {status.label}
                    </div>

                    <ChevronRight size={18} className="shrink-0 text-slate-300" />
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {selected && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(15,23,42,0.55)] p-6 backdrop-blur-[6px]"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-[min(560px,100%)] max-h-[80vh] overflow-y-auto rounded-xl border border-white/20 bg-white p-6 text-left shadow-[0_24px_48px_-12px_rgba(15,23,42,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 text-xs font-semibold text-blue-600">
              {INQUIRY_TYPE_LABEL[INQUIRY_TYPE_TO_UI[selected.inquiryType] ?? "other"]}
            </div>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">{selected.title}</h2>

            <p className="mb-4 whitespace-pre-wrap text-sm leading-[1.6] text-slate-600">
              {selected.content}
            </p>

            {selected.fileUrls?.length > 0 && (
              <div className="mb-4 flex flex-col gap-1.5">
                {selected.fileUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline"
                  >
                    첨부파일 {i + 1}
                  </a>
                ))}
              </div>
            )}

            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-1.5 text-xs font-semibold text-slate-500">
                {selected.answer ? "답변 내용" : "답변 대기 중"}
              </div>
              {selected.answer ? (
                <p className="whitespace-pre-wrap text-sm leading-[1.6] text-slate-700">
                  {selected.answer}
                </p>
              ) : (
                <p className="text-sm text-slate-400">담당자 확인 후 순차적으로 답변드립니다.</p>
              )}
            </div>

            <button
              className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              onClick={() => setSelected(null)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {detailLoading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(15,23,42,0.3)]">
          <div className="rounded-lg bg-white px-4 py-3 text-sm text-slate-600">불러오는 중...</div>
        </div>
      )}
    </div>
  );
}
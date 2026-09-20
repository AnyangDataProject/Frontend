import { useState } from "react";
import { X, Paperclip, Pencil, Trash2, MessageSquareText } from "lucide-react";
import { INQUIRY_STATUS_META } from "../../../mocks/citizen/constants";
import { INQUIRY_TYPES } from "../../../mocks/citizen/inquiryData";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-[inherit] text-sm text-slate-900 outline-none transition-shadow focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]";

// onUpdate는 수정 성공 여부(boolean)를 돌려줘서, 성공했을 때만 편집 모드를 닫는다.
export default function InquiryDetailModal({ inquiry, onClose, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [saving, setSaving] = useState(false);

  const typeLabel = INQUIRY_TYPES.find((t) => t.value === inquiry.type)?.label ?? "기타 민원";
  const status = INQUIRY_STATUS_META[inquiry.status] ?? INQUIRY_STATUS_META.waiting;
  const StatusIcon = status.icon;
  const answered = inquiry.status === "answered";

  const startEdit = () => {
    setDraftTitle(inquiry.title);
    setDraftContent(inquiry.content);
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    const ok = await onUpdate({ title: draftTitle, content: draftContent });
    setSaving(false);
    if (ok) setEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(15,23,42,0.55)] p-6 backdrop-blur-[6px] max-[520px]:p-0"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(840px,calc(100vh-48px))] w-[min(640px,100%)] flex-col overflow-hidden rounded-xl border border-white/20 bg-white text-left shadow-[0_24px_48px_-12px_rgba(15,23,42,0.25)] max-[520px]:h-full max-[520px]:max-h-full max-[520px]:w-full max-[520px]:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white p-5">
          <div className="min-w-0">
            <p className="mb-0.5 text-xs font-semibold tracking-[0.05em] text-blue-600">문의 상세</p>
            <h2 className="break-words text-base font-semibold text-slate-900">{inquiry.title}</h2>
          </div>
          <button
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border-0 bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 max-[520px]:p-4">
          <div className="mb-5 grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 max-[800px]:grid-cols-1">
            <div className="flex flex-col gap-1.5 border-r border-slate-200 p-4 max-[800px]:border-b max-[800px]:border-r-0">
              <span className="text-xs font-medium text-slate-500">문의 유형</span>
              <strong className="text-sm font-medium text-slate-900">{typeLabel}</strong>
            </div>
            <div className="flex flex-col gap-1.5 border-r border-slate-200 p-4 max-[800px]:border-b max-[800px]:border-r-0">
              <span className="text-xs font-medium text-slate-500">상태</span>
              <strong className="flex items-center gap-1 text-sm font-medium" style={{ color: status.color }}>
                <StatusIcon size={15} />
                {status.label}
              </strong>
            </div>
            <div className="flex flex-col gap-1.5 p-4">
              <span className="text-xs font-medium text-slate-500">문의일</span>
              <strong className="text-sm font-medium text-slate-900">{inquiry.createdAt}</strong>
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold text-slate-500">문의 내용</p>
            {editing ? (
              <div className="flex flex-col gap-2">
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="제목"
                  maxLength={100}
                  className={inputClass}
                />
                <textarea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="문의 내용"
                  maxLength={1000}
                  rows={6}
                  className={`${inputClass} resize-y leading-[1.7]`}
                />
              </div>
            ) : (
              <p className="whitespace-pre-line break-words rounded-xl bg-slate-50 p-4 text-sm leading-[1.7] text-slate-700">
                {inquiry.content}
              </p>
            )}
          </div>

          {inquiry.fileUrls.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Paperclip size={13} /> 첨부파일
              </p>
              <ul className="flex flex-col gap-1 rounded-xl bg-slate-50 p-4 text-sm">
                {inquiry.fileUrls.map((url, index) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      첨부파일 {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {answered ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <MessageSquareText size={13} /> 담당자 답변
              </p>
              <p className="whitespace-pre-line break-words text-sm leading-[1.7] text-slate-700">{inquiry.answer}</p>
              {(inquiry.answeredByName || inquiry.answeredAt) && (
                <p className="mt-3 text-xs text-slate-400">
                  {[inquiry.answeredByName, inquiry.answeredAt].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
              담당자가 확인 중입니다. 답변이 등록되면 이곳에서 확인할 수 있습니다.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-slate-200 px-6 py-3 max-[520px]:px-4">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="ml-auto rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={saveEdit}
                disabled={saving || !draftTitle.trim() || !draftContent.trim()}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </>
          ) : (
            <>
              {/* 답변이 달린 뒤에 내용이 바뀌면 답변과 어긋나므로 답변 대기 중일 때만 수정·삭제 허용 */}
              {!answered && (
                <>
                  <button
                    onClick={onDelete}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} /> 삭제
                  </button>
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Pencil size={15} /> 수정
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="ml-auto rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
              >
                닫기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { MessageSquare, X, FileText, Send, Paperclip } from 'lucide-react';
import Badge from '../Badge';
import { INQUIRY_STATUS_META, INQUIRY_TYPE_META } from '../../../mocks/admin/constants';

export default function InquiryDetailModal({
  inquiry,
  answer,
  onAnswerChange,
  onClose,
  onSubmit,
  submitting,
}) {
  const answered = inquiry.status === 'answered';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 pt-[104px]"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100vh-136px)] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs text-slate-400">문의 #{String(inquiry.id).padStart(4, '0')}</p>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900">{inquiry.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
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
                <p className="font-medium text-slate-800">{INQUIRY_TYPE_META[inquiry.type].label}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">상태</p>
                <Badge tone={INQUIRY_STATUS_META[inquiry.status].tone} dot>
                  {INQUIRY_STATUS_META[inquiry.status].label}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-400">이메일</p>
                <p className="font-medium text-slate-800">{inquiry.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">작성 일시</p>
                <p className="font-medium text-slate-800">{inquiry.createdAt}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <MessageSquare size={13} /> 문의 내용
            </p>
            <p className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
              {inquiry.content}
            </p>
          </div>

          {inquiry.fileUrls?.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Paperclip size={13} /> 첨부파일
              </p>
              <ul className="flex flex-col gap-1 rounded-lg bg-slate-50 p-3 text-sm">
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

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Send size={13} /> 답변 작성
            </p>
            <textarea
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="시민에게 전달할 답변을 입력해주세요."
              disabled={answered}
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
            />
            {answered && (
              <p className="mt-1 text-xs text-slate-400">
                이미 답변이 등록된 문의입니다.
                {inquiry.answeredByName && ` (답변자: ${inquiry.answeredByName}${inquiry.answeredAt ? `, ${inquiry.answeredAt}` : ''})`}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50">
            닫기
          </button>
          <button
            onClick={onSubmit}
            disabled={answered || submitting || !answer.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={14} />
            {submitting ? '등록 중...' : '답변 등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

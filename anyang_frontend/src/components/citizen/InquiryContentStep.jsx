import StepSection from "./StepSection";

export default function InquiryContentStep({ title, onTitleChange, content, onContentChange }) {
  return (
    <StepSection number="02" title="문의 내용" description="문의 내용을 자세하게 작성해주세요." card={false}>
      <div className="relative mb-4 text-left">
        <label htmlFor="inq-title" className="mb-[7px] block text-xs font-medium text-slate-700">
          제목
          <em className="ml-[3px] not-italic text-red-600">*</em>
        </label>
        <input
          id="inq-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="문의 제목을 입력해주세요."
          maxLength={100}
          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-[13px] font-[inherit] text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
        />
        <div className="absolute bottom-2.5 right-3 text-xs text-slate-400">
          {title.length}/100
        </div>
      </div>

      <div className="relative text-left">
        <label htmlFor="inq-content" className="mb-[7px] block text-xs font-medium text-slate-700">
          문의 내용
          <em className="ml-[3px] not-italic text-red-600">*</em>
        </label>
        <textarea
          id="inq-content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={`문의하실 내용을 입력해주세요.\n\n예) 신고한 도로 파손이 처리중이라고 표시되는데 현재 어떤 단계인지 궁금합니다.`}
          maxLength={1000}
          className="min-h-[150px] w-full resize-y rounded-lg border border-slate-200 bg-white p-[13px] font-[inherit] text-sm leading-[1.7] text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
        />
        <div className="absolute bottom-2.5 right-3 text-xs text-slate-400">
          {content.length}/1000
        </div>
      </div>
    </StepSection>
  );
}

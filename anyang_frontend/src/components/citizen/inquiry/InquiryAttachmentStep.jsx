import { useRef } from "react";
import { Paperclip, X } from "lucide-react";
import StepSection from "../StepSection";

export default function InquiryAttachmentStep({ files, onChange, onRemove }) {
  const fileInputRef = useRef(null);

  return (
    <StepSection
      number="03"
      title="첨부파일"
      description="문의 내용을 설명하는 사진이나 파일을 첨부할 수 있습니다."
      card={false}
    >
      <input ref={fileInputRef} type="file" multiple hidden onChange={onChange} />

      <button
        type="button"
        className="flex h-11 items-center gap-2 rounded-lg border-[1.5px] border-dashed border-slate-200 bg-slate-50 px-3.5 font-[inherit] text-sm font-medium text-slate-500 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip size={17} />
        파일 첨부하기
        <span className="ml-1 text-xs font-normal text-slate-400">최대 5개</span>
      </button>

      {files.length > 0 && (
        <div className="mt-2.5 flex flex-col gap-1.5">
          {files.map((item) => (
            <div
              className="flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
              key={item.id}
            >
              <Paperclip size={14} />
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {item.file.name}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full border-0 bg-transparent text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </StepSection>
  );
}

import { Mail } from "lucide-react";

export default function InquiryContactStep({ email, onChange }) {
  return (
    <div>
      <div className="mb-5 flex items-start gap-3 text-left">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-600">
          04
        </span>
        <div className="min-w-0 flex-1 text-left">
          <h2 className="mb-[3px] text-sm font-semibold text-slate-900">답변 받을 정보</h2>
          <p className="text-xs text-slate-400">문의 답변을 받을 이메일을 입력해주세요.</p>
        </div>
      </div>

      <div className="text-left">
        <label htmlFor="inq-email" className="mb-[7px] block text-xs font-medium text-slate-700">
          이메일
          <em className="ml-[3px] not-italic text-red-600">*</em>
        </label>
        <div className="flex h-11 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-[13px] transition-shadow focus-within:border-blue-600 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]">
          <Mail size={17} className="shrink-0 text-blue-600" />
          <input
            id="inq-email"
            type="email"
            value={email}
            onChange={(e) => onChange(e.target.value)}
            placeholder="example@email.com"
            className="h-full w-full border-0 font-[inherit] text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

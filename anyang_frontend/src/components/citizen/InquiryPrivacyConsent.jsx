import Checkbox from "./Checkbox";

export default function InquiryPrivacyConsent({ agree, onChange }) {
  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <Checkbox
        checked={agree}
        onChange={(e) => onChange(e.target.checked)}
        label={
          <>
            개인정보 수집 및 이용에 동의합니다.
            <em className="not-italic text-red-600"> *</em>
          </>
        }
        emphasized
      />
      <p className="ml-6 mt-1.5 text-xs leading-[1.6] text-slate-500">
        문의 접수 및 답변을 위해 이메일 등의 정보를 수집하며, 목적 달성 후 관련 법령에
        따라 안전하게 관리됩니다.
      </p>
    </div>
  );
}

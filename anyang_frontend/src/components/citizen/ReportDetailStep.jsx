import StepSection from "./StepSection";

export default function ReportDetailStep({ value, onChange }) {
  return (
    <StepSection
      number="05"
      title="상세 내용"
      description={
        <>
          파손 상태나 주변 상황을 알려주세요.
          <span className="text-slate-400"> (선택)</span>
        </>
      }
    >
      <textarea
        className="w-full min-h-[130px] p-[13px] border border-slate-200 rounded-lg outline-none resize-y text-slate-900 bg-white text-sm leading-[1.7] text-left placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={500}
        placeholder={"예: 차량이 지나갈 때 큰 충격이 발생합니다.\n도로 우측 차선에 포트홀이 있습니다."}
      />
      <div className="mt-1.5 text-right text-slate-400 text-xs">{value.length} / 500</div>
    </StepSection>
  );
}

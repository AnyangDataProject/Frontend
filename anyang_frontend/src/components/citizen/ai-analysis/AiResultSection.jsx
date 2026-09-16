import { AlertTriangle, BrainCircuit, ShieldAlert } from "lucide-react";
import AnalysisCard from "./AnalysisCard";

export default function AiResultSection({ type, severity, confidence }) {
  return (
    <AnalysisCard
      eyebrow="ANALYSIS RESULT"
      title="AI 분석 결과"
      action={<BrainCircuit size={23} className="text-blue-600" />}
    >
      {/* Type */}
      <div className="flex items-center gap-3 p-[13px] rounded-lg bg-blue-50 border border-blue-100 mb-[18px]">
        <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <AlertTriangle size={25} />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 text-xs">탐지된 파손 유형</span>
          <strong className="text-base font-semibold text-slate-900">{type.label}</strong>
        </div>
      </div>

      {/* Confidence */}
      <div className="mb-[18px]">
        <div className="flex justify-between mb-1.5 text-xs">
          <span className="text-slate-500">AI 분석 신뢰도</span>
          <strong className="text-blue-600 font-semibold">{confidence != null ? `${confidence}%` : '-'}</strong>
        </div>

        <div className="h-2 rounded-full bg-slate-50 overflow-hidden border border-slate-200">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${confidence ?? 0}%` }}
          />
        </div>

        <p className="mt-1.5 text-slate-400 text-xs">
          {confidence != null
            ? `AI 모델이 해당 파손 유형으로 판단할 가능성이 ${confidence}%입니다.`
            : 'AI 분석이 아직 완료되지 않았습니다. 잠시 후 다시 확인해주세요.'}
        </p>
      </div>

      {/* Severity */}
      <div className="flex items-start gap-3 p-[13px] rounded-lg border border-slate-200 bg-slate-50">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
          <ShieldAlert size={22} />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-slate-400 text-xs">AI 위험도 평가</span>

          <strong className={`text-sm font-medium ${severity.textClass}`}>
            {severity.label}
          </strong>

          <p className="mt-0.5 text-slate-500 text-xs leading-[1.5]">
            {severity.analysisDescription}
          </p>
        </div>
      </div>
    </AnalysisCard>
  );
}

import { AlertTriangle, BrainCircuit, ShieldAlert, SearchX } from "lucide-react";
import AnalysisCard from "./AnalysisCard";

export default function AiResultSection({ type, severity, confidence }) {
  const hasDetection = confidence != null;

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
          <span className="text-slate-500 text-xs">신고된 파손 유형</span>
          <strong className="text-base font-semibold text-slate-900">{type.label}</strong>
        </div>
      </div>

      {/* Confidence */}
      <div className="mb-[18px]">
        <div className="flex justify-between mb-1.5 text-xs">
          <span className="text-slate-500">AI 분석 신뢰도</span>
          <strong className={hasDetection ? "text-blue-600 font-semibold" : "text-slate-400 font-semibold"}>
            {hasDetection ? `${confidence}%` : "측정 안 됨"}
          </strong>
        </div>

        <div className="h-2 rounded-full bg-slate-50 overflow-hidden border border-slate-200">
          <div
            className={`h-full rounded-full ${hasDetection ? "bg-blue-600" : "bg-slate-200"}`}
            style={{ width: hasDetection ? `${confidence}%` : "0%" }}
          />
        </div>

        <p className="mt-1.5 text-slate-400 text-xs">
          {hasDetection
            ? `AI 모델이 해당 파손 유형으로 판단할 가능성이 ${confidence}%입니다.`
            : "이 파손 유형은 AI가 아직 학습하지 않은 범위라 신뢰도를 계산할 수 없습니다."}
        </p>
      </div>

      {/* Severity */}
      <div className="flex items-start gap-3 p-[13px] rounded-lg border border-slate-200 bg-slate-50">
        <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${hasDetection ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-400"}`}>
          {hasDetection ? <ShieldAlert size={22} /> : <SearchX size={20} />}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-slate-400 text-xs">
            {hasDetection ? "AI 위험도 평가" : "신고자 입력 위험도"}
          </span>

          <strong className={`text-sm font-medium ${severity.textClass}`}>
            {severity.label}
          </strong>

          <p className="mt-0.5 text-slate-500 text-xs leading-[1.5]">
            {hasDetection
              ? severity.analysisDescription
              : "AI 분석이 이루어지지 않아, 신고 시 시민이 직접 선택한 위험도입니다."}
          </p>
        </div>
      </div>
    </AnalysisCard>
  );
}
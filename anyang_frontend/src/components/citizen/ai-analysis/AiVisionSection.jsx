import { AlertTriangle } from "lucide-react";
import AnalysisCard from "./AnalysisCard";

export default function AiVisionSection({ typeLabel, confidence }) {
  return (
    <AnalysisCard eyebrow="AI VISION" title="파손 이미지 분석">
      <div className="relative">
        <div className="relative aspect-[1.4/1] rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
          <div className="absolute h-0.5 bg-white/15 rotate-[-12deg] w-[120%] left-[-10%] top-[34%]" />
          <div className="absolute h-0.5 bg-white/15 rotate-[-12deg] w-[120%] left-[-10%] top-[61%]" />
          <div className="absolute h-0.5 bg-white/15 rotate-[-12deg] w-full left-[10%] top-[79%]" />

          <div className="absolute left-1/2 top-1/2 w-[120px] h-[75px] -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] border-2 border-dashed border-blue-600 rounded-[40%] bg-blue-600/20 text-white flex flex-col items-center justify-center gap-1">
            <AlertTriangle size={30} />
            <span className="text-xs font-bold">{typeLabel}</span>
          </div>

          <div className="absolute top-2.5 left-2.5 px-2.5 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-[4px] flex flex-col gap-px">
            <span className="text-blue-400 text-[9px] font-extrabold">
              AI DETECTION
            </span>

            <span className="text-white text-xs font-bold">
              {typeLabel}
            </span>

            <span className="text-slate-400 text-[9px]">
              신뢰도 {confidence != null ? `${confidence}%` : '분석 대기중'}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-slate-500 text-xs leading-[1.5]">
        AI가 신고 이미지에서 도로파손 영역을 탐지하고
        파손 유형을 분류했습니다.
      </p>
    </AnalysisCard>
  );
}
import AnalysisCard from "./AnalysisCard";
import AnalysisItem from "./AnalysisItem";

export default function DetailedAnalysisSection({ type, severity, analysisResult }) {
  const detections = analysisResult.detections || [];

  return (
    <AnalysisCard eyebrow="DETAILED ANALYSIS" title="상세 분석">
      <div className="grid grid-cols-2 gap-[9px] max-[700px]:grid-cols-1">
        <AnalysisItem
          number="01"
          title="파손 유형"
          value={type.label}
          description={type.analysisDescription}
        />

        <AnalysisItem
          number="02"
          title="파손 규모"
          value={analysisResult.size}
          description="AI 이미지 분석을 기반으로 파손 영역의 규모를 추정했습니다."
        />

        <AnalysisItem
          number="03"
          title="예상 위험도"
          value={severity.label}
          description={severity.analysisDescription}
        />

        <AnalysisItem
          number="04"
          title="원인 추정"
          value={analysisResult.cause}
          description="도로 상태 및 파손 형태를 기반으로 예상 원인을 분석했습니다."
        />
      </div>

      {detections.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="mb-2.5 text-xs font-semibold text-slate-700">
            AI 탐지 항목 ({detections.length}건)
          </h4>

          <div className="flex flex-col gap-1.5">
            {detections.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-xs"
              >
                <span className="font-medium text-slate-700">{d.className}</span>
                <span className="text-slate-500">
                  신뢰도 {Math.round(d.confidence * 100) / 100}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AnalysisCard>
  );
}
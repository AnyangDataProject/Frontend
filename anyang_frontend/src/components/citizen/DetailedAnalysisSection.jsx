import AnalysisCard from "./AnalysisCard";
import AnalysisItem from "./AnalysisItem";

export default function DetailedAnalysisSection({ type, severity, analysisResult }) {
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
    </AnalysisCard>
  );
}

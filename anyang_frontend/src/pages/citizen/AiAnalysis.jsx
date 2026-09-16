import { useLocation, useNavigate } from "react-router-dom";
import { BrainCircuit, ChevronRight } from "lucide-react";
import { fallbackReport, getMockAnalysis } from "../../mocks/citizen/aiAnalysisData";
import { DAMAGE_TYPE_META, SEVERITY_META, REPORT_STATUS_META } from "../../mocks/citizen/constants";
import { SECTION_LABEL_CLASS } from "../../components/citizen/ai-analysis/AnalysisCard";
import AiAnalysisTopBar from "../../components/citizen/ai-analysis/AiAnalysisTopBar";
import ReportInfoSection from "../../components/citizen/ai-analysis/ReportInfoSection";
import AiVisionSection from "../../components/citizen/ai-analysis/AiVisionSection";
import AiResultSection from "../../components/citizen/ai-analysis/AiResultSection";
import DetailedAnalysisSection from "../../components/citizen/ai-analysis/DetailedAnalysisSection";
import AiSummarySection from "../../components/citizen/ai-analysis/AiSummarySection";
import ProcessingStatusSection from "../../components/citizen/ai-analysis/ProcessingStatusSection";
import { useEffect, useState } from "react";
import { getAiAnalysis } from "../../api/ai";

export default function AiAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();

  // MainMap에서 전달받은 신고 데이터
  const report = location.state?.report;

  const selectedReport = report || fallbackReport;
  const [detectionData, setDetectionData] = useState(null);

  useEffect(() => {
    if (!selectedReport?.id) return;

    getAiAnalysis(selectedReport.id)
      .then((data) => setDetectionData(data))
      .catch((err) => {
        console.error('AI 분석 결과를 불러오지 못했습니다.', err);
        setDetectionData(null);
      });
  }, [selectedReport?.id]);

  const type = DAMAGE_TYPE_META[selectedReport.type] ?? { label: selectedReport.type ?? '-' };
  const severity = SEVERITY_META[selectedReport.severity];
  const status = REPORT_STATUS_META[selectedReport.status];

  const StatusIcon = status.icon;

  const mockResult = getMockAnalysis(selectedReport);

  // 실제 탐지 결과가 있으면 병합, 없으면(fallback 신고이거나 API 실패 시) mock 그대로
  const firstAnalysis = detectionData?.[0];

  const analysisResult = {
    ...mockResult,
    confidence: selectedReport.aiConfidence != null
      ? Math.round(selectedReport.aiConfidence)
      : mockResult.confidence,
    resultImageUrl: firstAnalysis?.resultImageUrl ?? null,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-[72px] max-[768px]:pt-16 text-left">
      <AiAnalysisTopBar onBack={() => navigate(-1)} />

      <main className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-10 pb-20 max-[700px]:w-[calc(100%-28px)] max-[700px]:mx-auto max-[700px]:pt-8 max-[430px]:w-[calc(100%-24px)] max-[430px]:mx-auto">

        {/* Page title */}
        <section className="flex items-end justify-between mb-[30px] text-left max-[700px]:block">
          <div className="flex-1 min-w-0 text-left">
            <span className={SECTION_LABEL_CLASS}>
              ROAD DAMAGE ANALYSIS
            </span>

            <h1 className="mt-2 mb-[9px] text-xl font-semibold tracking-[-0.04em] text-left text-slate-900">
              도로파손 AI 분석 결과
            </h1>

            <p className="m-0 text-slate-500 text-sm text-left">
              신고된 도로 사진과 위치 정보를 기반으로
              AI가 도로파손 유형과 위험도를 분석했습니다.
            </p>
          </div>

          <div className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium max-[700px]:mt-3">
            <BrainCircuit size={17} />
            AI 분석 완료
          </div>
        </section>

        <ReportInfoSection report={selectedReport} status={status} StatusIcon={StatusIcon} />

        <section className="grid grid-cols-2 gap-[15px] mb-[15px] max-[700px]:grid-cols-1">
          <AiVisionSection
            typeLabel={type.label}
            confidence={analysisResult.confidence}
            resultImageUrl={analysisResult.resultImageUrl}
          />
          <AiResultSection type={type} severity={severity} confidence={analysisResult.confidence} />
        </section>

        <DetailedAnalysisSection type={type} severity={severity} analysisResult={analysisResult} />

        <AiSummarySection summary={analysisResult.summary} />

        <ProcessingStatusSection
          status={selectedReport.status}
          onViewMyReports={() => navigate("/my-reports")}
        />

        {/* Bottom buttons */}
        <div className="flex justify-end gap-2 mt-6 max-[700px]:sticky max-[700px]:bottom-0 max-[700px]:py-3 max-[700px]:bg-slate-50/[0.94] max-[700px]:backdrop-blur-[10px] max-[430px]:flex-col">
          <button
            className="h-12 px-[22px] rounded-lg text-sm font-medium cursor-pointer flex items-center justify-center gap-[7px] transition-colors border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 max-[700px]:flex-1 max-[430px]:w-full"
            onClick={() => navigate(-1)}
          >
            지도에서 위치 보기
          </button>

          <button
            className="h-12 px-[22px] rounded-lg text-sm font-medium cursor-pointer flex items-center justify-center gap-[7px] transition-colors border-0 bg-blue-600 text-white hover:bg-blue-700 max-[700px]:flex-1 max-[430px]:w-full"
            onClick={() => navigate("/my-reports")}
          >
            내 신고 현황 보기
            <ChevronRight size={17} />
          </button>
        </div>

        <p className="mt-4 text-center text-slate-400 text-xs">
          ※ AI 분석 결과는 참고용이며 최종적인 도로파손 판정 및
          조치는 담당 부서의 현장 확인 결과에 따라 결정됩니다.
        </p>

      </main>
    </div>
  );
}

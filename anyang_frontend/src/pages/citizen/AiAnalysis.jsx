import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  CalendarDays,
  User,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { fallbackReport, getMockAnalysis } from "../../mocks/citizen/aiAnalysisData";
import { DAMAGE_TYPE_META, SEVERITY_META, REPORT_STATUS_META } from "../../mocks/citizen/constants";

const SECTION_LABEL = "text-blue-600 text-xs font-bold tracking-[0.13em] text-left";
const CARD = "p-7 mb-[15px] bg-white border border-slate-200 rounded-xl shadow-sm text-left max-[700px]:p-5 max-[430px]:p-[17px]";
const CARD_HEADER = "flex items-start justify-between gap-3 mb-[23px] text-left";
const CARD_HEADER_TITLE_WRAP = "flex-1 min-w-0 text-left";
const CARD_HEADER_H2 = "mt-1 text-sm font-semibold tracking-[-0.03em] text-left text-slate-900";

export default function AiAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();

  // MainMap에서 전달받은 신고 데이터
  const report = location.state?.report;

  const selectedReport = report || fallbackReport;

  const type = DAMAGE_TYPE_META[selectedReport.type];
  const severity = SEVERITY_META[selectedReport.severity];
  const status = REPORT_STATUS_META[selectedReport.status];

  const StatusIcon = status.icon;

  // 실제 AI 모델 연동 전 사용할 Mock 분석 결과
  const analysisResult = getMockAnalysis(selectedReport);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-[72px] max-[768px]:pt-16 text-left">

      {/* Header */}
      <header className="h-[72px] bg-white/[0.94] border-b border-slate-200 fixed top-0 left-0 right-0 z-[100] backdrop-blur-[10px]">
        <div className="max-w-[1440px] h-full mx-auto px-6 lg:px-10 flex items-center">

          <button
            className="border-0 bg-transparent inline-flex items-center gap-1.5 p-0 text-slate-500 text-sm font-semibold cursor-pointer transition-colors hover:text-slate-900"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            <span>이전</span>
          </button>

          <div className="ml-4 pl-4 border-l border-slate-200 flex items-center gap-2.5 text-blue-600">
            <BrainCircuit size={20} />
            <div className="flex flex-col gap-px text-left">
              <strong className="text-slate-900 text-sm font-bold">AI 분석 결과</strong>
              <span className="text-slate-400 text-xs">로드센스 도로파손 분석 시스템</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-10 pb-20 max-[700px]:w-[calc(100%-28px)] max-[700px]:mx-auto max-[700px]:pt-8 max-[430px]:w-[calc(100%-24px)] max-[430px]:mx-auto">

        {/* Page title */}
        <section className="flex items-end justify-between mb-[30px] text-left max-[700px]:block">
          <div className="flex-1 min-w-0 text-left">
            <span className={SECTION_LABEL}>
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

        {/* Report information */}
        <section className={`${CARD} overflow-hidden`}>

          <div className={CARD_HEADER}>
            <div className={CARD_HEADER_TITLE_WRAP}>
              <span className={SECTION_LABEL}>
                REPORT INFORMATION
              </span>

              <h2 className={CARD_HEADER_H2}>신고 정보</h2>
            </div>

            <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium">
              신고 #{String(selectedReport.id).padStart(4, "0")}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-[9px] mt-[15px] max-[700px]:grid-cols-1">

            <div className="flex items-center gap-3 min-h-[76px] p-[13px] border border-slate-200 rounded-lg bg-white text-left">
              <MapPin size={17} className="shrink-0 text-blue-600" />
              <div className="flex flex-col gap-[3px] min-w-0">
                <span className="text-slate-400 text-xs">신고 위치</span>
                <strong className="text-sm font-medium text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap">
                  {selectedReport.address}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3 min-h-[76px] p-[13px] border border-slate-200 rounded-lg bg-white text-left">
              <CalendarDays size={17} className="shrink-0 text-blue-600" />
              <div className="flex flex-col gap-[3px] min-w-0">
                <span className="text-slate-400 text-xs">신고일</span>
                <strong className="text-sm font-medium text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap">
                  {selectedReport.reportedAt}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3 min-h-[76px] p-[13px] border border-slate-200 rounded-lg bg-white text-left">
              <User size={17} className="shrink-0 text-blue-600" />
              <div className="flex flex-col gap-[3px] min-w-0">
                <span className="text-slate-400 text-xs">신고자</span>
                <strong className="text-sm font-medium text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap">
                  {selectedReport.reporter ?? "정보 없음"}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3 min-h-[76px] p-[13px] border border-slate-200 rounded-lg bg-white text-left">
              <StatusIcon size={17} className="shrink-0 text-blue-600" />
              <div className="flex flex-col gap-[3px] min-w-0">
                <span className="text-slate-400 text-xs">처리 상태</span>
                <strong className={`text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap ${status.textClass}`}>
                  {status.label}
                </strong>
              </div>
            </div>

          </div>

        </section>

        {/* AI Analysis */}
        <section className="grid grid-cols-2 gap-[15px] mb-[15px] max-[700px]:grid-cols-1">

          {/* Image */}
          <div className={CARD}>

            <div className={CARD_HEADER}>
              <div className={CARD_HEADER_TITLE_WRAP}>
                <span className={SECTION_LABEL}>
                  AI VISION
                </span>

                <h2 className={CARD_HEADER_H2}>파손 이미지 분석</h2>
              </div>
            </div>

            <div className="relative">

              <div className="relative aspect-[1.4/1] rounded-lg overflow-hidden bg-slate-900 border border-slate-200">

                <div className="absolute h-0.5 bg-white/15 rotate-[-12deg] w-[120%] left-[-10%] top-[34%]" />
                <div className="absolute h-0.5 bg-white/15 rotate-[-12deg] w-[120%] left-[-10%] top-[61%]" />
                <div className="absolute h-0.5 bg-white/15 rotate-[-12deg] w-full left-[10%] top-[79%]" />

                <div className="absolute left-1/2 top-1/2 w-[120px] h-[75px] -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] border-2 border-dashed border-blue-600 rounded-[40%] bg-blue-600/20 text-white flex flex-col items-center justify-center gap-1">
                  <AlertTriangle size={30} />
                  <span className="text-xs font-bold">{type.label}</span>
                </div>

                <div className="absolute top-2.5 left-2.5 px-2.5 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-[4px] flex flex-col gap-px">
                  <span className="text-blue-400 text-[9px] font-extrabold">
                    AI DETECTION
                  </span>

                  <span className="text-white text-xs font-bold">
                    {type.label}
                  </span>

                  <span className="text-slate-400 text-[9px]">
                    신뢰도 {analysisResult.confidence}%
                  </span>
                </div>

              </div>
            </div>

            <p className="mt-3 text-slate-500 text-xs leading-[1.5]">
              AI가 신고 이미지에서 도로파손 영역을 탐지하고
              파손 유형을 분류했습니다.
            </p>

          </div>

          {/* Result */}
          <div className={CARD}>

            <div className={CARD_HEADER}>
              <div className={CARD_HEADER_TITLE_WRAP}>
                <span className={SECTION_LABEL}>
                  ANALYSIS RESULT
                </span>

                <h2 className={CARD_HEADER_H2}>AI 분석 결과</h2>
              </div>

              <BrainCircuit size={23} className="text-blue-600" />
            </div>

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
                <strong className="text-blue-600 font-semibold">{analysisResult.confidence}%</strong>
              </div>

              <div className="h-2 rounded-full bg-slate-50 overflow-hidden border border-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${analysisResult.confidence}%`,
                  }}
                />
              </div>

              <p className="mt-1.5 text-slate-400 text-xs">
                AI 모델이 해당 파손 유형으로 판단할 가능성이
                {` ${analysisResult.confidence}%`}입니다.
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

          </div>

        </section>

        {/* Detailed analysis */}
        <section className={CARD}>

          <div className={CARD_HEADER}>
            <div className={CARD_HEADER_TITLE_WRAP}>
              <span className={SECTION_LABEL}>
                DETAILED ANALYSIS
              </span>

              <h2 className={CARD_HEADER_H2}>상세 분석</h2>
            </div>
          </div>

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

        </section>

        {/* AI Summary */}
        <section className="flex items-start gap-3.5 p-5 mb-[15px] bg-white border-l-4 border-blue-600 text-left max-[430px]:p-[17px]">

          <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BrainCircuit size={25} />
          </div>

          <div>
            <span className={SECTION_LABEL}>
              AI SUMMARY
            </span>

            <h2 className="mt-0.5 mb-1.5 text-sm font-semibold text-slate-900">AI 분석 요약</h2>

            <p className="text-slate-500 text-xs leading-[1.7]">
              {analysisResult.summary}
            </p>

          </div>

        </section>

        {/* Processing status */}
        <section className={CARD}>

          <div className={CARD_HEADER}>
            <div className={CARD_HEADER_TITLE_WRAP}>
              <span className={SECTION_LABEL}>
                PROCESS STATUS
              </span>

              <h2 className={CARD_HEADER_H2}>신고 처리 현황</h2>
            </div>

            <button
              className="border-0 bg-transparent flex items-center gap-1 text-slate-500 text-xs font-semibold cursor-pointer p-0 transition-colors hover:text-blue-600"
              onClick={() => navigate("/my-reports")}
            >
              내 신고에서 보기
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-[14px]">

            <TimelineItem
              title="신고 접수"
              description="시민 신고가 접수되었습니다."
              active={true}
              done={true}
            />

            <TimelineItem
              title="AI 분석"
              description="신고 사진에 대한 AI 분석이 완료되었습니다."
              active={true}
              done={true}
            />

            <TimelineItem
              title="담당 부서 확인"
              description="담당 부서에서 현장 상태를 확인합니다."
              active={selectedReport.status !== "received"}
              done={
                selectedReport.status === "done"
              }
            />

            <TimelineItem
              title="보수 및 처리 완료"
              description="도로파손 보수 작업이 완료됩니다."
              active={selectedReport.status === "done"}
              done={selectedReport.status === "done"}
              last
            />

          </div>

        </section>

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


/* ------------------------------------------------------------------
   Components
------------------------------------------------------------------ */

function AnalysisItem({
  number,
  title,
  value,
  description,
}) {
  return (
    <div className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg bg-white">

      <span className="w-8 h-8 min-w-[32px] max-w-[32px] flex-none flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-bold mt-px">
        {number}
      </span>

      <div className="flex flex-col gap-[3px] min-w-0">

        <span className="text-slate-400 text-xs">
          {title}
        </span>

        <strong className="text-sm font-semibold text-slate-900">{value}</strong>

        <p className="mt-1 text-slate-500 text-xs leading-[1.5]">{description}</p>

      </div>

    </div>
  );
}


function TimelineItem({
  title,
  description,
  active,
  done,
  last,
}) {
  return (
    <div className={`relative flex items-start gap-3 ${active ? "opacity-100" : "opacity-50"}`}>

      <div
        className={`w-6 h-6 shrink-0 rounded-full border-[1.5px] bg-white flex items-center justify-center z-[2] ${
          done
            ? "bg-blue-600 border-blue-600 text-white"
            : active
              ? "border-blue-600 text-blue-600"
              : "border-slate-200"
        }`}
      >
        {done ? (
          <CheckCircle2 size={17} />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-600" : "bg-slate-200"}`} />
        )}
      </div>

      {!last && (
        <div className="absolute left-[11px] top-6 w-px h-[calc(100%+14px)] bg-slate-200" />
      )}

      <div>

        <strong className="block text-sm font-medium text-slate-900">{title}</strong>

        <p className="mt-0.5 text-slate-500 text-xs">{description}</p>

      </div>

    </div>
  );
}

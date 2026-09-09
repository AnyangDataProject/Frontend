import React from "react";
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
  Activity,
  Wrench,
  ChevronRight,
} from "lucide-react";
import "./AiAnalysis.css";

const TYPE_META = {
  pothole: {
    label: "포트홀",
    description: "도로 표면이 국부적으로 파여 있는 형태의 파손입니다.",
  },
  crack: {
    label: "노면 균열",
    description: "도로 표면에 균열이 발생한 상태입니다.",
  },
  sign: {
    label: "표지판 파손",
    description: "도로 안전시설물 또는 표지판이 파손된 상태입니다.",
  },
  manhole: {
    label: "맨홀/시설물",
    description: "맨홀 및 도로 주변 시설물에 이상이 발생한 상태입니다.",
  },
};

const SEVERITY_META = {
  low: {
    label: "낮음",
    description: "현재 즉각적인 사고 위험은 낮은 상태입니다.",
  },
  mid: {
    label: "보통",
    description: "통행 시 주의가 필요하며 정비가 권장됩니다.",
  },
  high: {
    label: "높음",
    description: "사고 위험이 높아 신속한 정비가 필요한 상태입니다.",
  },
};

const STATUS_META = {
  received: {
    label: "접수됨",
    description: "시민 신고가 접수되어 담당 부서의 확인을 기다리고 있습니다.",
    icon: Activity,
  },
  progress: {
    label: "처리중",
    description: "담당 부서에서 현장 확인 및 보수 작업을 진행하고 있습니다.",
    icon: Wrench,
  },
  done: {
    label: "처리완료",
    description: "도로파손에 대한 조치가 완료되었습니다.",
    icon: CheckCircle2,
  },
};

export default function AiAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();

  // MainMap에서 전달받은 신고 데이터
  const report = location.state?.report;

  // 직접 URL로 들어왔을 때 사용할 임시 데이터
  const fallbackReport = {
    id: 1,
    type: "pothole",
    severity: "high",
    status: "received",
    address: "동안구 평촌대로 123",
    reportedAt: "2026-09-08",
    reporter: "김민준",
  };

  const selectedReport = report || fallbackReport;

  const type = TYPE_META[selectedReport.type];
  const severity = SEVERITY_META[selectedReport.severity];
  const status = STATUS_META[selectedReport.status];

  const StatusIcon = status.icon;

  // 실제 AI 모델 연동 전 사용할 Mock 분석 결과
  const analysisResult = getMockAnalysis(selectedReport);

  return (
    <div className="ai-page">

      {/* Header */}
      <header className="ai-header">
        <div className="ai-header-inner">

          <button
            className="ai-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            <span>이전</span>
          </button>

          <div className="ai-header-title">
            <BrainCircuit size={20} />
            <div>
              <strong>AI 분석 결과</strong>
              <span>로드센스 도로파손 분석 시스템</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="ai-main">

        {/* Page title */}
        <section className="ai-page-title">
          <div>
            <span className="ai-eyebrow">
              ROAD DAMAGE ANALYSIS
            </span>

            <h1>도로파손 AI 분석 결과</h1>

            <p>
              신고된 도로 사진과 위치 정보를 기반으로
              AI가 도로파손 유형과 위험도를 분석했습니다.
            </p>
          </div>

          <div className="ai-analysis-badge">
            <BrainCircuit size={17} />
            AI 분석 완료
          </div>
        </section>

        {/* Report information */}
        <section className="ai-report-card">

          <div className="ai-card-header">
            <div>
              <span className="ai-section-label">
                REPORT INFORMATION
              </span>

              <h2>신고 정보</h2>
            </div>

            <span className="ai-report-number">
              신고 #{String(selectedReport.id).padStart(4, "0")}
            </span>
          </div>

          <div className="ai-report-grid">

            <div className="ai-info-item">
              <MapPin size={17} />
              <div>
                <span>신고 위치</span>
                <strong>{selectedReport.address}</strong>
              </div>
            </div>

            <div className="ai-info-item">
              <CalendarDays size={17} />
              <div>
                <span>신고일</span>
                <strong>{selectedReport.reportedAt}</strong>
              </div>
            </div>

            <div className="ai-info-item">
              <User size={17} />
              <div>
                <span>신고자</span>
                <strong>{selectedReport.reporter}</strong>
              </div>
            </div>

            <div className="ai-info-item">
              <StatusIcon size={17} />
              <div>
                <span>처리 상태</span>
                <strong className={`status-${selectedReport.status}`}>
                  {status.label}
                </strong>
              </div>
            </div>

          </div>

        </section>

        {/* AI Analysis */}
        <section className="ai-analysis-grid">

          {/* Image */}
          <div className="ai-image-card">

            <div className="ai-card-header">
              <div>
                <span className="ai-section-label">
                  AI VISION
                </span>

                <h2>파손 이미지 분석</h2>
              </div>
            </div>

            <div className="ai-image-area">

              <div className="ai-road-placeholder">

                <div className="ai-road-line line-1" />
                <div className="ai-road-line line-2" />
                <div className="ai-road-line line-3" />

                <div className="ai-damage-area">
                  <AlertTriangle size={30} />
                  <span>{type.label}</span>
                </div>

              </div>

              <div className="ai-detection-box">
                <span className="detection-label">
                  AI DETECTION
                </span>

                <span className="detection-type">
                  {type.label}
                </span>

                <span className="detection-confidence">
                  신뢰도 {analysisResult.confidence}%
                </span>
              </div>

            </div>

            <p className="ai-image-description">
              AI가 신고 이미지에서 도로파손 영역을 탐지하고
              파손 유형을 분류했습니다.
            </p>

          </div>

          {/* Result */}
          <div className="ai-result-card">

            <div className="ai-card-header">
              <div>
                <span className="ai-section-label">
                  ANALYSIS RESULT
                </span>

                <h2>AI 분석 결과</h2>
              </div>

              <BrainCircuit size={23} />
            </div>

            {/* Type */}
            <div className="ai-result-main">

              <div className="ai-result-icon">
                <AlertTriangle size={25} />
              </div>

              <div>
                <span>탐지된 파손 유형</span>
                <strong>{type.label}</strong>
              </div>

            </div>

            {/* Confidence */}
            <div className="ai-progress-section">

              <div className="ai-progress-top">
                <span>AI 분석 신뢰도</span>
                <strong>{analysisResult.confidence}%</strong>
              </div>

              <div className="ai-progress">
                <div
                  className="ai-progress-fill"
                  style={{
                    width: `${analysisResult.confidence}%`,
                  }}
                />
              </div>

              <p>
                AI 모델이 해당 파손 유형으로 판단할 가능성이
                {` ${analysisResult.confidence}%`}입니다.
              </p>

            </div>

            {/* Severity */}
            <div className="ai-severity-box">

              <div className="ai-severity-icon">
                <ShieldAlert size={22} />
              </div>

              <div className="ai-severity-content">
                <span>AI 위험도 평가</span>

                <strong
                  className={`severity-${selectedReport.severity}`}
                >
                  {severity.label}
                </strong>

                <p>
                  {severity.description}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Detailed analysis */}
        <section className="ai-detail-card">

          <div className="ai-card-header">
            <div>
              <span className="ai-section-label">
                DETAILED ANALYSIS
              </span>

              <h2>상세 분석</h2>
            </div>
          </div>

          <div className="ai-detail-grid">

            <AnalysisItem
              number="01"
              title="파손 유형"
              value={type.label}
              description={type.description}
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
              description={severity.description}
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
        <section className="ai-summary-card">

          <div className="ai-summary-icon">
            <BrainCircuit size={25} />
          </div>

          <div className="ai-summary-content">

            <span className="ai-section-label">
              AI SUMMARY
            </span>

            <h2>AI 분석 요약</h2>

            <p>
              {analysisResult.summary}
            </p>

          </div>

        </section>

        {/* Processing status */}
        <section className="ai-process-card">

          <div className="ai-card-header">
            <div>
              <span className="ai-section-label">
                PROCESS STATUS
              </span>

              <h2>신고 처리 현황</h2>
            </div>

            <button
              className="ai-detail-link"
              onClick={() => navigate("/my-reports")}
            >
              내 신고에서 보기
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="ai-timeline">

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
        <div className="ai-bottom-actions">

          <button
            className="ai-secondary-button"
            onClick={() => navigate(-1)}
          >
            지도에서 위치 보기
          </button>

          <button
            className="ai-primary-button"
            onClick={() => navigate("/my-reports")}
          >
            내 신고 현황 보기
            <ChevronRight size={17} />
          </button>

        </div>

        <p className="ai-disclaimer">
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
    <div className="ai-analysis-item">

      <span className="ai-analysis-number">
        {number}
      </span>

      <div className="ai-analysis-item-content">

        <span className="ai-analysis-item-title">
          {title}
        </span>

        <strong>{value}</strong>

        <p>{description}</p>

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
    <div
      className={`ai-timeline-item ${
        active ? "is-active" : ""
      } ${done ? "is-done" : ""}`}
    >

      <div className="ai-timeline-marker">
        {done ? (
          <CheckCircle2 size={17} />
        ) : (
          <span />
        )}
      </div>

      {!last && (
        <div className="ai-timeline-line" />
      )}

      <div className="ai-timeline-content">

        <strong>{title}</strong>

        <p>{description}</p>

      </div>

    </div>
  );
}


/* ------------------------------------------------------------------
   Mock AI result
   나중에 백엔드 API 결과로 교체
------------------------------------------------------------------ */

function getMockAnalysis(report) {
  const results = {
    pothole: {
      confidence: 96,
      size: "중형",
      cause: "노면 침하 및 반복 하중",
      summary:
        "도로 표면에서 포트홀 형태의 파손 영역이 확인되었습니다. 차량의 반복적인 통행과 노면 침하로 인해 파손이 발생했을 가능성이 높으며, 현재 위험도는 높은 수준으로 판단됩니다. 차량 및 이륜차 통행 시 주의가 필요하며 신속한 현장 확인과 보수가 권장됩니다.",
    },

    crack: {
      confidence: 91,
      size: "중형",
      cause: "노면 노후화 및 온도 변화",
      summary:
        "도로 표면에서 선형 균열이 확인되었습니다. 노면의 노후화 또는 온도 변화에 따른 반복적인 수축·팽창이 주요 원인으로 추정됩니다. 균열이 확대될 가능성이 있으므로 지속적인 관찰과 보수가 필요합니다.",
    },

    sign: {
      confidence: 94,
      size: "소형",
      cause: "외부 충격 또는 시설물 노후화",
      summary:
        "도로 안전시설물에서 파손 또는 변형이 확인되었습니다. 외부 충격이나 시설물 노후화에 의한 파손으로 추정되며, 도로 이용자의 안전을 위해 현장 확인이 필요합니다.",
    },

    manhole: {
      confidence: 89,
      size: "중형",
      cause: "시설물 노후화 및 주변 노면 침하",
      summary:
        "맨홀 및 주변 도로시설물에서 이상 징후가 확인되었습니다. 시설물 노후화 또는 주변 노면 침하가 원인일 가능성이 있으며, 차량 통행 시 충격이 발생할 수 있어 현장 점검이 권장됩니다.",
    },
  };

  return results[report.type] || results.pothole;
}
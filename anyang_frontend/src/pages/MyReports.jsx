import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Wrench,
  MapPin,
  ChevronRight,
  AlertTriangle,
  CircleDot,
  Construction,
  Signpost,
  X,
  Sparkles,
  CalendarDays,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./MyReports.css";

const TYPE_META = {
  pothole: {
    label: "포트홀",
    icon: CircleDot,
  },
  crack: {
    label: "노면 균열",
    icon: Construction,
  },
  sign: {
    label: "표지판 파손",
    icon: Signpost,
  },
  manhole: {
    label: "맨홀/시설물",
    icon: AlertTriangle,
  },
};

const SEVERITY_META = {
  low: {
    label: "낮음",
    color: "#3A8F6D",
  },
  mid: {
    label: "보통",
    color: "#E8A33D",
  },
  high: {
    label: "높음",
    color: "#D64545",
  },
};

const STATUS_META = {
  received: {
    label: "접수됨",
    icon: Clock,
    color: "#6B7280",
  },
  progress: {
    label: "처리중",
    icon: Wrench,
    color: "#D97B22",
  },
  done: {
    label: "처리완료",
    icon: CheckCircle2,
    color: "#3A8F6D",
  },
};

// ---------------------------------------
// 임시 신고 데이터
// 실제 구현에서는 Spring Boot API로 대체
// ---------------------------------------
const MY_REPORTS = [
  {
    id: 1,
    type: "pothole",
    severity: "high",
    status: "received",
    address: "안양시 동안구 평촌대로 123",
    reportedAt: "2026-09-08",
    description:
      "차량 통행이 많은 도로에 큰 포트홀이 발생해 차량 주행 시 위험해 보입니다.",
    aiConfidence: 94.2,
    aiRisk: "높음",
    image:
      "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    type: "crack",
    severity: "mid",
    status: "progress",
    address: "안양시 동안구 시민대로 45",
    reportedAt: "2026-09-06",
    description:
      "도로 중앙 부분에 길게 균열이 발생했습니다. 균열이 점점 넓어지는 것 같습니다.",
    aiConfidence: 91.8,
    aiRisk: "보통",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    type: "sign",
    severity: "low",
    status: "done",
    address: "안양시 만안구 안양로 210",
    reportedAt: "2026-09-03",
    description:
      "도로 옆 안내 표지판이 기울어져 있어 정비가 필요해 보입니다.",
    aiConfidence: 88.5,
    aiRisk: "낮음",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    type: "manhole",
    severity: "high",
    status: "progress",
    address: "안양시 동안구 관악대로 77",
    reportedAt: "2026-09-01",
    description:
      "맨홀 주변 도로가 내려앉아 차량이 지나갈 때 충격이 발생합니다.",
    aiConfidence: 96.1,
    aiRisk: "높음",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    type: "pothole",
    severity: "mid",
    status: "done",
    address: "안양시 만안구 삼덕로 8",
    reportedAt: "2026-08-27",
    description:
      "도로 우측에 작은 포트홀이 발생했습니다.",
    aiConfidence: 90.4,
    aiRisk: "보통",
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80",
  },
];

function MyReports() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  const counts = useMemo(() => {
    return {
      all: MY_REPORTS.length,
      received: MY_REPORTS.filter(
        (report) => report.status === "received"
      ).length,
      progress: MY_REPORTS.filter(
        (report) => report.status === "progress"
      ).length,
      done: MY_REPORTS.filter(
        (report) => report.status === "done"
      ).length,
    };
  }, []);

  const filteredReports = useMemo(() => {
    if (statusFilter === "all") {
      return MY_REPORTS;
    }

    return MY_REPORTS.filter(
      (report) => report.status === statusFilter
    );
  }, [statusFilter]);

  return (
    <div className="mr-page">
      {/* =========================
          Header
      ========================= */}
      <header className="mr-header">
        <div className="mr-header-inner">
          <button
            className="mr-logo"
            onClick={() => navigate("/")}
          >
            <div className="mr-logo-mark">
              <MapPin size={19} strokeWidth={2.5} />
            </div>

            <div>
              <div className="mr-logo-title">로드센스</div>
              <div className="mr-logo-sub">
                안양시 AI 도로파손 탐지 서비스
              </div>
            </div>
          </button>

          <nav className="mr-nav">
            <button onClick={() => navigate("/")}>
              지도
            </button>

            <button className="active">
              내 신고
            </button>

            <button onClick={() => navigate("/inquiry")}>
              민원/문의
            </button>
          </nav>

          <button
            className="mr-login"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        </div>
      </header>

      {/* =========================
          Main
      ========================= */}
      <main className="mr-main">

        {/* 뒤로가기 */}
        <button
          className="mr-back"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          지도 돌아가기
        </button>

        {/* 제목 */}
        <section className="mr-title-section">
          <div>
            <p className="mr-eyebrow">
              MY REPORTS
            </p>

            <h1>내 신고현황</h1>

            <p>
              내가 접수한 도로 파손 신고의 처리 현황을
              확인할 수 있습니다.
            </p>
          </div>

          <button
            className="mr-report-button"
            onClick={() => navigate("/report")}
          >
            <Camera size={18} />
            파손 신고하기
          </button>
        </section>

        {/* =========================
            상태 요약
        ========================= */}
        <section className="mr-summary">

          <button
            className={`mr-summary-card ${
              statusFilter === "all" ? "selected" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <div className="mr-summary-icon all">
              <FileText size={20} />
            </div>

            <div className="mr-summary-text">
              <span>전체 신고</span>
              <strong>{counts.all}</strong>
            </div>
          </button>

          <button
            className={`mr-summary-card ${
              statusFilter === "received" ? "selected" : ""
            }`}
            onClick={() => setStatusFilter("received")}
          >
            <div className="mr-summary-icon received">
              <Clock size={20} />
            </div>

            <div className="mr-summary-text">
              <span>접수됨</span>
              <strong>{counts.received}</strong>
            </div>
          </button>

          <button
            className={`mr-summary-card ${
              statusFilter === "progress" ? "selected" : ""
            }`}
            onClick={() => setStatusFilter("progress")}
          >
            <div className="mr-summary-icon progress">
              <Wrench size={20} />
            </div>

            <div className="mr-summary-text">
              <span>처리중</span>
              <strong>{counts.progress}</strong>
            </div>
          </button>

          <button
            className={`mr-summary-card ${
              statusFilter === "done" ? "selected" : ""
            }`}
            onClick={() => setStatusFilter("done")}
          >
            <div className="mr-summary-icon done">
              <CheckCircle2 size={20} />
            </div>

            <div className="mr-summary-text">
              <span>처리완료</span>
              <strong>{counts.done}</strong>
            </div>
          </button>

        </section>

        {/* =========================
            신고 목록
        ========================= */}
        <section className="mr-list-section">

          <div className="mr-list-header">
            <div>
              <h2>
                신고 내역
                <span>{filteredReports.length}</span>
              </h2>
            </div>

            <div className="mr-filter">
              <button
                className={
                  statusFilter === "all" ? "active" : ""
                }
                onClick={() => setStatusFilter("all")}
              >
                전체
              </button>

              <button
                className={
                  statusFilter === "received" ? "active" : ""
                }
                onClick={() => setStatusFilter("received")}
              >
                접수됨
              </button>

              <button
                className={
                  statusFilter === "progress" ? "active" : ""
                }
                onClick={() => setStatusFilter("progress")}
              >
                처리중
              </button>

              <button
                className={
                  statusFilter === "done" ? "active" : ""
                }
                onClick={() => setStatusFilter("done")}
              >
                완료
              </button>
            </div>
          </div>

          <div className="mr-list">

            {filteredReports.length === 0 ? (
              <div className="mr-empty">
                <FileText size={42} />
                <h3>신고 내역이 없습니다.</h3>
                <p>
                  아직 해당 상태의 신고가 없습니다.
                </p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const type = TYPE_META[report.type];
                const severity =
                  SEVERITY_META[report.severity];
                const status =
                  STATUS_META[report.status];

                const TypeIcon = type.icon;
                const StatusIcon = status.icon;

                return (
                  <article
                    className="mr-report-card"
                    key={report.id}
                    onClick={() =>
                      setSelectedReport(report)
                    }
                  >
                    {/* 이미지 */}
                    <div className="mr-report-image">
                      <img
                        src={report.image}
                        alt={type.label}
                      />

                      <span
                        className="mr-severity"
                        style={{
                          color: severity.color,
                          backgroundColor: `${severity.color}15`,
                        }}
                      >
                        <span
                          className="mr-severity-dot"
                          style={{
                            backgroundColor:
                              severity.color,
                          }}
                        />
                        위험도 {severity.label}
                      </span>
                    </div>

                    {/* 내용 */}
                    <div className="mr-report-content">

                      <div className="mr-report-top">
                        <div className="mr-report-type">
                          <span className="mr-type-icon">
                            <TypeIcon size={16} />
                          </span>

                          <strong>
                            {type.label}
                          </strong>
                        </div>

                        <div
                          className="mr-status"
                          style={{
                            color: status.color,
                            backgroundColor: `${status.color}12`,
                          }}
                        >
                          <StatusIcon size={15} />
                          {status.label}
                        </div>
                      </div>

                      <div className="mr-address">
                        <MapPin size={15} />
                        {report.address}
                      </div>

                      <div className="mr-date">
                        <CalendarDays size={14} />
                        신고일 {report.reportedAt}
                      </div>

                      <p className="mr-description">
                        {report.description}
                      </p>

                      <div className="mr-report-bottom">

                        <div className="mr-ai">
                          <Sparkles size={14} />
                          AI 분석 신뢰도{" "}
                          <strong>
                            {report.aiConfidence}%
                          </strong>
                        </div>

                        <span className="mr-detail">
                          상세보기
                          <ChevronRight size={16} />
                        </span>

                      </div>
                    </div>
                  </article>
                );
              })
            )}

          </div>
        </section>
      </main>

      {/* =========================
          신고 상세 모달
      ========================= */}
      {selectedReport && (
        <div
          className="mr-modal-backdrop"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="mr-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mr-modal-header">
              <div>
                <p>신고 상세</p>
                <h2>도로 파손 신고 #{selectedReport.id}</h2>
              </div>

              <button
                className="mr-close"
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="mr-modal-image">
              <img
                src={selectedReport.image}
                alt="신고 사진"
              />
            </div>

            <div className="mr-modal-content">

              {/* 상태 */}
              <div className="mr-progress">

                <div
                  className={`mr-progress-step ${
                    selectedReport.status === "received" ||
                    selectedReport.status === "progress" ||
                    selectedReport.status === "done"
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="mr-progress-dot">
                    <Clock size={15} />
                  </div>
                  <span>접수</span>
                </div>

                <div
                  className={`mr-progress-line ${
                    selectedReport.status ===
                      "progress" ||
                    selectedReport.status === "done"
                      ? "completed"
                      : ""
                  }`}
                />

                <div
                  className={`mr-progress-step ${
                    selectedReport.status ===
                      "progress" ||
                    selectedReport.status === "done"
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="mr-progress-dot">
                    <Wrench size={15} />
                  </div>
                  <span>처리중</span>
                </div>

                <div
                  className={`mr-progress-line ${
                    selectedReport.status === "done"
                      ? "completed"
                      : ""
                  }`}
                />

                <div
                  className={`mr-progress-step ${
                    selectedReport.status === "done"
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="mr-progress-dot">
                    <CheckCircle2 size={15} />
                  </div>
                  <span>처리완료</span>
                </div>

              </div>

              {/* 정보 */}
              <div className="mr-info-grid">

                <div className="mr-info-item">
                  <span>파손 유형</span>
                  <strong>
                    {TYPE_META[selectedReport.type].label}
                  </strong>
                </div>

                <div className="mr-info-item">
                  <span>위험도</span>
                  <strong
                    style={{
                      color:
                        SEVERITY_META[
                          selectedReport.severity
                        ].color,
                    }}
                  >
                    {
                      SEVERITY_META[
                        selectedReport.severity
                      ].label
                    }
                  </strong>
                </div>

                <div className="mr-info-item">
                  <span>신고일</span>
                  <strong>
                    {selectedReport.reportedAt}
                  </strong>
                </div>

                <div className="mr-info-item">
                  <span>AI 분석 신뢰도</span>
                  <strong>
                    {selectedReport.aiConfidence}%
                  </strong>
                </div>

              </div>

              {/* 위치 */}
              <div className="mr-detail-box">
                <div className="mr-detail-title">
                  <MapPin size={16} />
                  신고 위치
                </div>

                <p>{selectedReport.address}</p>
              </div>

              {/* 신고 내용 */}
              <div className="mr-detail-box">
                <div className="mr-detail-title">
                  <FileText size={16} />
                  신고 내용
                </div>

                <p>
                  {selectedReport.description}
                </p>
              </div>

              {/* AI */}
              <div className="mr-ai-box">
                <div className="mr-ai-box-title">
                  <Sparkles size={17} />
                  AI 분석 결과
                </div>

                <div className="mr-ai-result">

                  <div>
                    <span>파손 유형</span>
                    <strong>
                      {
                        TYPE_META[
                          selectedReport.type
                        ].label
                      }
                    </strong>
                  </div>

                  <div>
                    <span>위험도</span>
                    <strong>
                      {selectedReport.aiRisk}
                    </strong>
                  </div>

                  <div>
                    <span>분석 신뢰도</span>
                    <strong>
                      {selectedReport.aiConfidence}%
                    </strong>
                  </div>

                </div>

                <p>
                  AI 분석 결과는 도로 파손 여부와
                  위험도를 판단하기 위한 참고 정보이며,
                  최종 처리 여부는 담당 부서의 확인 후
                  결정됩니다.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReports;
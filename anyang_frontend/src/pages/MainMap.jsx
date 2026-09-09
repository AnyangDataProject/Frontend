import React, { useState, useMemo } from "react";
import {
  Camera,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Wrench,
  X,
  ChevronRight,
  Construction,
  CircleDot,
  Signpost,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./MainMap.css";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const TYPE_META = {
  pothole: { label: "포트홀", icon: CircleDot },
  crack: { label: "노면 균열", icon: Construction },
  sign: { label: "표지판 파손", icon: Signpost },
  manhole: { label: "맨홀/시설물", icon: AlertTriangle },
};

const SEVERITY_META = {
  low: { label: "낮음", color: "#3A8F6D" },
  mid: { label: "보통", color: "#E8A33D" },
  high: { label: "높음", color: "#D64545" },
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

const PINS = [
  {
    id: 1,
    x: 32,
    y: 28,
    type: "pothole",
    severity: "high",
    status: "received",
    address: "동안구 평촌대로 123",
    reportedAt: "2026-09-08",
    reporter: "김민준",
  },
  {
    id: 2,
    x: 55,
    y: 22,
    type: "crack",
    severity: "mid",
    status: "progress",
    address: "동안구 시민대로 45",
    reportedAt: "2026-09-07",
    reporter: "이서연",
  },
  {
    id: 3,
    x: 68,
    y: 45,
    type: "sign",
    severity: "low",
    status: "done",
    address: "만안구 안양로 210",
    reportedAt: "2026-09-05",
    reporter: "박지훈",
  },
  {
    id: 4,
    x: 41,
    y: 58,
    type: "pothole",
    severity: "mid",
    status: "received",
    address: "만안구 삼덕로 8",
    reportedAt: "2026-09-08",
    reporter: "최유리",
  },
  {
    id: 5,
    x: 22,
    y: 63,
    type: "manhole",
    severity: "high",
    status: "progress",
    address: "동안구 관악대로 77",
    reportedAt: "2026-09-06",
    reporter: "정도윤",
  },
  {
    id: 6,
    x: 77,
    y: 66,
    type: "crack",
    severity: "low",
    status: "done",
    address: "만안구 병목안로 19",
    reportedAt: "2026-09-03",
    reporter: "한소율",
  },
  {
    id: 7,
    x: 48,
    y: 78,
    type: "pothole",
    severity: "low",
    status: "received",
    address: "동안구 흥안대로 33",
    reportedAt: "2026-09-08",
    reporter: "오준서",
  },
  {
    id: 8,
    x: 60,
    y: 35,
    type: "sign",
    severity: "mid",
    status: "received",
    address: "동안구 평촌대로 301",
    reportedAt: "2026-09-07",
    reporter: "임하은",
  },
];

const ROADS = [
  "M 5 30 H 95",
  "M 5 55 H 95",
  "M 5 75 H 95",
  "M 20 5 V 95",
  "M 45 5 V 95",
  "M 70 5 V 95",
  "M 5 10 H 95",
];

export default function MainMap() {
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [listOpenMobile, setListOpenMobile] = useState(false);

  const filtered = useMemo(() => {
    return PINS.filter(
      (p) =>
        (typeFilter === "all" || p.type === typeFilter) &&
        (severityFilter === "all" || p.severity === severityFilter) &&
        (statusFilter === "all" || p.status === statusFilter)
    );
  }, [typeFilter, severityFilter, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: PINS.length,
      received: PINS.filter((p) => p.status === "received").length,
      progress: PINS.filter((p) => p.status === "progress").length,
      done: PINS.filter((p) => p.status === "done").length,
    };
  }, []);

  return (
    <div className="rs-app">

      {/* Header */}
      <header className="rs-header">
        <div className="rs-brand">
          <span className="rs-brand-mark" />

          <div>
            <div className="rs-brand-name">
              로드센스
            </div>

            <div className="rs-brand-sub">
              안양시 AI 도로파손 탐지 서비스
            </div>
          </div>
        </div>

        <nav className="rs-nav">
          <button className="rs-nav-item is-active">
            지도
          </button>

          <button
            className="rs-nav-item"
            onClick={() => navigate("/my-reports")}
          >
            내 신고
          </button>

          <button
            className="rs-nav-item"
            onClick={() => navigate("/inquiry")}
          >
            민원/문의
          </button>
        </nav>

        <button
          className="rs-login"
          onClick={() => navigate("/login")}
        >
          <User size={16} />
          로그인
        </button>
      </header>

      {/* Stats */}
      <div className="rs-stats">
        <Stat
          label="전체 신고"
          value={counts.total}
        />

        <Stat
          label="접수됨"
          value={counts.received}
          color={STATUS_META.received.color}
        />

        <Stat
          label="처리중"
          value={counts.progress}
          color={STATUS_META.progress.color}
        />

        <Stat
          label="처리완료"
          value={counts.done}
          color={STATUS_META.done.color}
        />
      </div>

      {/* Filters */}
      <div className="rs-filters">

        <FilterGroup
          label="파손 유형"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "전체" },
            ...Object.entries(TYPE_META).map(
              ([key, value]) => ({
                value: key,
                label: value.label,
              })
            ),
          ]}
        />

        <FilterGroup
          label="심각도"
          value={severityFilter}
          onChange={setSeverityFilter}
          options={[
            { value: "all", label: "전체" },
            ...Object.entries(SEVERITY_META).map(
              ([key, value]) => ({
                value: key,
                label: value.label,
              })
            ),
          ]}
        />

        <FilterGroup
          label="처리 상태"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "전체" },
            ...Object.entries(STATUS_META).map(
              ([key, value]) => ({
                value: key,
                label: value.label,
              })
            ),
          ]}
        />

      </div>

      {/* Body */}
      <div className="rs-body">

        {/* Map */}
        <div className="rs-map-wrap">

          <div className="rs-map">

            <svg
              className="rs-map-roads"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {ROADS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  className="rs-road"
                />
              ))}
            </svg>

            {filtered.map((pin) => {
              const Icon = TYPE_META[pin.type].icon;
              const color =
                SEVERITY_META[pin.severity].color;

              return (
                <button
                  key={pin.id}
                  className={`rs-pin ${
                    selected?.id === pin.id
                      ? "is-selected"
                      : ""
                  }`}
                  style={{
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    "--pin-color": color,
                  }}
                  onClick={() => setSelected(pin)}
                  aria-label={`${TYPE_META[pin.type].label} - ${pin.address}`}
                >
                  <Icon
                    size={13}
                    strokeWidth={2.4}
                  />
                </button>
              );
            })}

          </div>

          {/* Legend */}
          <div className="rs-legend">
            {Object.entries(SEVERITY_META).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="rs-legend-item"
                >
                  <span
                    className="rs-legend-dot"
                    style={{
                      background: value.color,
                    }}
                  />

                  {value.label}
                </div>
              )
            )}
          </div>

          {/* Report button */}
          <button
            className="rs-fab"
            onClick={() => navigate("/report")}
          >
            <Camera size={18} />
            파손 신고하기
          </button>

          {/* Mobile list */}
          <button
            className="rs-mobile-list-toggle"
            onClick={() => setListOpenMobile(true)}
          >
            목록 보기 ({filtered.length})
          </button>

        </div>

        {/* Sidebar */}
        <aside
          className={`rs-sidebar ${
            listOpenMobile ? "is-open" : ""
          }`}
        >

          <div className="rs-sidebar-head">
            <span>
              신고 목록 ({filtered.length})
            </span>

            <button
              className="rs-sidebar-close"
              onClick={() => setListOpenMobile(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="rs-list">

            {filtered.length === 0 && (
              <div className="rs-empty">
                조건에 맞는 신고가 없어요.
              </div>
            )}

            {filtered.map((pin) => {
              const Icon =
                TYPE_META[pin.type].icon;

              const sev =
                SEVERITY_META[pin.severity];

              const st =
                STATUS_META[pin.status];

              const StIcon = st.icon;

              return (
                <button
                  key={pin.id}
                  className={`rs-list-item ${
                    selected?.id === pin.id
                      ? "is-selected"
                      : ""
                  }`}
                  style={{
                    "--sev-color": sev.color,
                  }}
                  onClick={() => {
                    setSelected(pin);
                    setListOpenMobile(false);
                  }}
                >

                  <div className="rs-list-icon">
                    <Icon size={16} />
                  </div>

                  <div className="rs-list-body">

                    <div className="rs-list-top">

                      <span className="rs-list-type">
                        {TYPE_META[pin.type].label}
                      </span>

                      <span
                        className="rs-list-status"
                        style={{
                          color: st.color,
                        }}
                      >
                        <StIcon size={12} />
                        {st.label}
                      </span>

                    </div>

                    <div className="rs-list-addr">
                      {pin.address}
                    </div>

                    <div className="rs-list-meta">
                      {pin.reportedAt} · 심각도 {sev.label}
                    </div>

                  </div>

                  <ChevronRight
                    size={16}
                    className="rs-list-chevron"
                  />

                </button>
              );
            })}

          </div>

        </aside>

      </div>

      {/* Detail */}
      {selected && (
        <div
          className="rs-detail-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="rs-detail"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="rs-detail-close"
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>

            <div className="rs-detail-thumb">
              {React.createElement(
                TYPE_META[selected.type].icon,
                {
                  size: 36,
                  strokeWidth: 1.6,
                }
              )}
            </div>

            <div className="rs-detail-type">
              {TYPE_META[selected.type].label}
            </div>

            <div className="rs-detail-addr">
              {selected.address}
            </div>

            <div className="rs-detail-row">
              <span>심각도</span>

              <span
                className="rs-badge"
                style={{
                  background:
                    SEVERITY_META[
                      selected.severity
                    ].color,
                }}
              >
                {
                  SEVERITY_META[
                    selected.severity
                  ].label
                }
              </span>
            </div>

            <div className="rs-detail-row">
              <span>처리 상태</span>

              <span
                className="rs-badge rs-badge-outline"
                style={{
                  borderColor:
                    STATUS_META[
                      selected.status
                    ].color,
                  color:
                    STATUS_META[
                      selected.status
                    ].color,
                }}
              >
                {
                  STATUS_META[
                    selected.status
                  ].label
                }
              </span>
            </div>

            <div className="rs-detail-row">
              <span>신고일</span>
              <span>{selected.reportedAt}</span>
            </div>

            <div className="rs-detail-row">
              <span>신고자</span>
              <span>{selected.reporter}</span>
            </div>

            <button
            className="rs-detail-cta"
            onClick={() =>
                navigate("/ai-analysis", {
                state: {
                    report: selected,
                },
                })
            }
            >
            AI 분석 결과 자세히 보기
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="rs-stat">

      <div
        className="rs-stat-value"
        style={color ? { color } : undefined}
      >
        {value}
      </div>

      <div className="rs-stat-label">
        {label}
      </div>

    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="rs-filter-group">

      <span className="rs-filter-label">
        {label}
      </span>

      <div className="rs-chip-row">

        {options.map((opt) => (
          <button
            key={opt.value}
            className={`rs-chip ${
              value === opt.value
                ? "is-active"
                : ""
            }`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}

      </div>

    </div>
  );
}
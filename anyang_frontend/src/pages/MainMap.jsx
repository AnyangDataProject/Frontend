import React, { useMemo, useState } from "react";
import { Camera, X, Search, LocateFixed, Map as MapGlyph, List as ListIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Map, CustomOverlayMap, Polyline } from "react-kakao-maps-sdk";
import "./MainMap.css";

const TYPE_LABEL = {
  pothole: "포트홀",
  crack: "노면 균열",
  sign: "표지판 파손",
  manhole: "맨홀/시설물",
};

const SEVERITY_META = {
  low: { label: "낮음", color: "var(--sev-low)" },
  mid: { label: "보통", color: "var(--sev-mid)" },
  high: { label: "심각", color: "var(--sev-high)" },
};

const STATUS_META = {
  received: { label: "접수됨", color: "var(--ink-soft)" },
  progress: { label: "처리중", color: "var(--sev-mid)" },
  done: { label: "처리완료", color: "var(--sev-low)" },
};

const PINS = [
  { id: 1, lat: 37.3928, lng: 126.9516, type: "pothole", severity: "high", status: "received", address: "동안구 평촌대로 123", reportedAt: "2026-09-08", photoUrl: null },
  { id: 2, lat: 37.4014, lng: 126.9527, type: "crack", severity: "mid", status: "progress", address: "동안구 시민대로 45", reportedAt: "2026-09-07", photoUrl: null },
  { id: 3, lat: 37.3945, lng: 126.9226, type: "sign", severity: "low", status: "done", address: "만안구 안양로 210", reportedAt: "2026-09-05", photoUrl: null },
  { id: 4, lat: 37.3902, lng: 126.9241, type: "pothole", severity: "mid", status: "received", address: "만안구 삼덕로 8", reportedAt: "2026-09-08", photoUrl: null },
  { id: 5, lat: 37.3843, lng: 126.9556, type: "manhole", severity: "high", status: "progress", address: "동안구 관악대로 77", reportedAt: "2026-09-06", photoUrl: null },
  { id: 6, lat: 37.3798, lng: 126.9298, type: "crack", severity: "low", status: "done", address: "만안구 병목안로 19", reportedAt: "2026-09-03", photoUrl: null },
  { id: 7, lat: 37.3861, lng: 126.9613, type: "pothole", severity: "low", status: "received", address: "동안구 흥안대로 33", reportedAt: "2026-09-08", photoUrl: null },
  { id: 8, lat: 37.3971, lng: 126.9605, type: "sign", severity: "mid", status: "received", address: "동안구 평촌대로 301", reportedAt: "2026-09-07", photoUrl: null },
];

// 위험 예측 레이어용 임시 구간 데이터 (실제로는 백엔드 위험도 예측 API 값으로 교체)
const RISK_SEGMENTS = [
  {
    id: "seg1",
    risk: "high",
    path: [{ lat: 37.3960, lng: 126.9480 }, { lat: 37.3958, lng: 126.9560 }],
    mid: { lat: 37.3959, lng: 126.9520 },
    causes: [
      { label: "교통량", value: "높음" },
      { label: "최근 강수량", value: "많음" },
      { label: "사고 이력", value: "3건" },
    ],
  },
  {
    id: "seg2",
    risk: "mid",
    path: [{ lat: 37.3900, lng: 126.9500 }, { lat: 37.3862, lng: 126.9520 }],
    mid: { lat: 37.3881, lng: 126.9510 },
    causes: [
      { label: "교통량", value: "보통" },
      { label: "노후 도로", value: "8년 경과" },
      { label: "사고 이력", value: "1건" },
    ],
  },
  {
    id: "seg3",
    risk: "low",
    path: [{ lat: 37.3820, lng: 126.9350 }, { lat: 37.3822, lng: 126.9450 }],
    mid: { lat: 37.3821, lng: 126.9400 },
    causes: [
      { label: "교통량", value: "낮음" },
      { label: "사고 이력", value: "0건" },
    ],
  },
];

const RISK_COLOR = { low: "#3B6D11", mid: "#E8B923", high: "#C1432D" };
const RISK_LABEL = { low: "LOW", mid: "MID", high: "HIGH" };

const DEFAULT_CENTER = { lat: 37.3943, lng: 126.9568 };

export default function MainMap() {
  const navigate = useNavigate();
  const [listOpen, setListOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [layer, setLayer] = useState("current"); // current | prediction
  const [statusFilter, setStatusFilter] = useState("all"); // all | open | done
  const [typeFilter, setTypeFilter] = useState("all");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");

  const counts = useMemo(
    () => ({
      all: PINS.length,
      open: PINS.filter((p) => p.status !== "done").length,
      done: PINS.filter((p) => p.status === "done").length,
    }),
    []
  );

  const filteredPins = useMemo(() => {
    let list = PINS;
    if (statusFilter === "open") list = list.filter((p) => p.status !== "done");
    if (statusFilter === "done") list = list.filter((p) => p.status === "done");
    if (typeFilter !== "all") list = list.filter((p) => p.type === typeFilter);
    return list;
  }, [statusFilter, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError("");
    if (!searchText.trim()) return;

    if (!window.kakao?.maps?.services) {
      setSearchError("지도 서비스를 불러오는 중이에요. 잠시 후 다시 시도해주세요.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(searchText.trim(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        setCenter({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
      } else {
        setSearchError("주소를 찾을 수 없어요. 다르게 입력해보세요.");
      }
    });
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setSearchError("이 브라우저에서는 위치 확인을 지원하지 않아요.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSearchError("");
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setSearchError("위치 권한을 확인해주세요.")
    );
  };

  return (
    <div className="tv-page">
      <div className="tv-body">
        <div className="tv-map-view">
          <header className="tv-header">
            <div className="tv-tabs">
              <button
                className={!listOpen ? "is-active" : ""}
                onClick={() => setListOpen(false)}
              >
                <MapGlyph size={14} />
                지도
              </button>
              <button
                className={listOpen ? "is-active" : ""}
                onClick={() => setListOpen(true)}
              >
                <ListIcon size={14} />
                신고 목록
              </button>
            </div>

            <form className="tv-search" onSubmit={handleSearch}>
              <Search size={13} />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="도로명 주소 검색"
                aria-label="도로명 주소 검색"
              />
            </form>

            <div className="tv-layer-switch">
              <button
                className={layer === "current" ? "is-active" : ""}
                onClick={() => setLayer("current")}
              >
                현재
              </button>
              <button
                className={layer === "prediction" ? "is-active" : ""}
                onClick={() => setLayer("prediction")}
              >
                예측
              </button>
            </div>

            <button className="tv-report-btn" onClick={() => navigate("/report")}>
              <Camera size={14} />
              신고하기
            </button>
          </header>

          {searchError && <div className="tv-search-error">{searchError}</div>}

          <Map
            center={center}
            style={{ width: "100%", height: "100%" }}
            level={7}
            onClick={() => {
              setSelected(null);
              setSelectedRisk(null);
            }}
          >
            {layer === "current" &&
              PINS.map((pin) => {
                const sev = SEVERITY_META[pin.severity];
                return (
                  <CustomOverlayMap
                    key={pin.id}
                    position={{ lat: pin.lat, lng: pin.lng }}
                    xAnchor={0.5}
                    yAnchor={0.5}
                  >
                    <button
                      className={`tv-marker ${pin.severity === "high" ? "tv-marker--lg" : ""} ${
                        selected?.id === pin.id ? "is-selected" : ""
                      }`}
                      style={{ background: sev.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(pin);
                      }}
                      aria-label={`${TYPE_LABEL[pin.type]} - ${sev.label} - ${pin.address}`}
                    />
                  </CustomOverlayMap>
                );
              })}

            {layer === "prediction" &&
              RISK_SEGMENTS.map((seg) => (
                <React.Fragment key={seg.id}>
                  <Polyline
                    path={seg.path}
                    strokeWeight={6}
                    strokeColor={RISK_COLOR[seg.risk]}
                    strokeOpacity={0.85}
                    strokeStyle="solid"
                    onClick={() => setSelectedRisk(seg)}
                  />
                  <CustomOverlayMap position={seg.mid} xAnchor={0.5} yAnchor={1.4}>
                    <button
                      className="tv-risk-hit"
                      style={{ "--risk-color": RISK_COLOR[seg.risk] }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRisk(seg);
                      }}
                      aria-label={`위험도 ${RISK_LABEL[seg.risk]} 구간 상세`}
                    >
                      {RISK_LABEL[seg.risk]}
                    </button>
                  </CustomOverlayMap>
                </React.Fragment>
              ))}

            {selectedRisk && (
              <CustomOverlayMap position={selectedRisk.mid} xAnchor={0.5} yAnchor={2.4}>
                <div className="tv-risk-popup" onClick={(e) => e.stopPropagation()}>
                  <div className="tv-risk-popup-head">
                    <span style={{ color: RISK_COLOR[selectedRisk.risk] }}>
                      {RISK_LABEL[selectedRisk.risk]}
                    </span>
                    <button onClick={() => setSelectedRisk(null)} aria-label="닫기">
                      <X size={13} />
                    </button>
                  </div>
                  {selectedRisk.causes.map((c) => (
                    <div key={c.label} className="tv-risk-popup-row">
                      <span>{c.label}</span>
                      <span>{c.value}</span>
                    </div>
                  ))}
                </div>
              </CustomOverlayMap>
            )}
          </Map>

          <button className="tv-locate-btn" onClick={handleLocate} aria-label="내 위치로 이동">
            <LocateFixed size={16} />
          </button>

          {layer === "current" ? (
            <div className="tv-legend">
              <span><span className="tv-dot" style={{ background: "var(--sev-low)" }} />낮음</span>
              <span><span className="tv-dot" style={{ background: "var(--sev-mid)" }} />보통</span>
              <span><span className="tv-dot tv-dot--lg" style={{ background: "var(--sev-high)" }} />심각</span>
            </div>
          ) : (
            <div className="tv-legend">
              <span><span className="tv-bar" style={{ background: RISK_COLOR.low }} />LOW</span>
              <span><span className="tv-bar" style={{ background: RISK_COLOR.mid }} />MID</span>
              <span><span className="tv-bar" style={{ background: RISK_COLOR.high }} />HIGH</span>
            </div>
          )}
        </div>

        {/* 리스트 패널 (지도 옆에서 슬라이드로 열림/닫힘) */}
        <div className={`tv-list-panel ${listOpen ? "is-open" : ""}`}>
          <div className="tv-list-tabs">
            <button
              className={statusFilter === "all" ? "is-active" : ""}
              onClick={() => setStatusFilter("all")}
            >
              전체 신고 <b>{counts.all}</b>
            </button>
            <button
              className={statusFilter === "open" ? "is-active" : ""}
              onClick={() => setStatusFilter("open")}
            >
              미처리 <b>{counts.open}</b>
            </button>
            <button
              className={statusFilter === "done" ? "is-active" : ""}
              onClick={() => setStatusFilter("done")}
            >
              처리완료 <b>{counts.done}</b>
            </button>
          </div>

          <div className="tv-type-filter">
            {[
              { value: "all", label: "전체 유형" },
              ...Object.entries(TYPE_LABEL).map(([value, label]) => ({ value, label })),
            ].map((opt) => (
              <button
                key={opt.value}
                className={typeFilter === opt.value ? "is-active" : ""}
                onClick={() => setTypeFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="tv-cards">
            {filteredPins.length === 0 && (
              <div className="tv-cards-empty">해당하는 신고가 없어요.</div>
            )}

            {filteredPins.map((pin) => {
              const sev = SEVERITY_META[pin.severity];
              const st = STATUS_META[pin.status];
              return (
                <button key={pin.id} className="tv-card" onClick={() => setSelected(pin)}>
                  <span className="tv-card-dot" style={{ background: sev.color }} />
                  <div className="tv-card-body">
                    <div className="tv-card-top">
                      <span className="tv-card-type">{TYPE_LABEL[pin.type]}</span>
                      <span style={{ color: sev.color, fontWeight: 700 }}>{sev.label}</span>
                    </div>
                    <div className="tv-card-addr">{pin.address}</div>
                    <div className="tv-card-meta">
                      <span>{pin.reportedAt}</span>
                      <span style={{ color: st.color, fontWeight: 600 }}>{st.label}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 상세 모달 */}
      {selected && (
        <div className="tv-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="tv-detail-card" onClick={(e) => e.stopPropagation()}>
            <button className="tv-detail-close" onClick={() => setSelected(null)} aria-label="닫기">
              <X size={16} />
            </button>

            <div className="tv-detail-photo">
              {selected.photoUrl ? (
                <img src={selected.photoUrl} alt={`${TYPE_LABEL[selected.type]} 현장 사진`} />
              ) : (
                <span className="tv-detail-photo-empty">사진 없음</span>
              )}
            </div>

            <div className="tv-detail-type">{TYPE_LABEL[selected.type]}</div>
            <div className="tv-detail-addr">{selected.address}</div>

            <div className="tv-detail-row">
              <span>심각도</span>
              <span style={{ color: SEVERITY_META[selected.severity].color, fontWeight: 700 }}>
                {SEVERITY_META[selected.severity].label}
              </span>
            </div>
            <div className="tv-detail-row">
              <span>처리 상태</span>
              <span style={{ color: STATUS_META[selected.status].color, fontWeight: 700 }}>
                {STATUS_META[selected.status].label}
              </span>
            </div>
            <div className="tv-detail-row">
              <span>신고일</span>
              <span>{selected.reportedAt}</span>
            </div>

            <button
              className="tv-detail-cta"
              onClick={() => navigate("/ai-analysis", { state: { report: selected } })}
            >
              AI 분석 결과 자세히 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
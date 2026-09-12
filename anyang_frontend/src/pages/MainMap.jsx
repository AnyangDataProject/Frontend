import React, { useMemo, useState } from "react";
import { Camera, X, Search, LocateFixed, Map as MapGlyph, List as ListIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Map, CustomOverlayMap, Polyline } from "react-kakao-maps-sdk";

const TYPE_LABEL = {
  pothole: "포트홀",
  crack: "노면 균열",
  sign: "표지판 파손",
  manhole: "맨홀/시설물",
};

const SEVERITY_META = {
  low: { label: "낮음", color: "#10b981" },
  mid: { label: "보통", color: "#f59e0b" },
  high: { label: "심각", color: "#ef4444" },
};

const STATUS_META = {
  received: { label: "접수됨", color: "#64748b" },
  progress: { label: "처리중", color: "#f59e0b" },
  done: { label: "처리완료", color: "#10b981" },
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

const RISK_COLOR = { low: "#10b981", mid: "#f59e0b", high: "#ef4444" };
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
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-white pt-[72px] max-[768px]:pt-16">
      <style>{`
        @keyframes tvFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tvScaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>

      <div className="flex-1 min-h-0 flex relative">
        <div className="relative flex-1 min-w-0 bg-[#EAEAEA]">
          <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center gap-2.5 pointer-events-none">
            <div className="pointer-events-auto flex gap-1 bg-white rounded-full p-1 shadow-[0_4px_16px_rgba(15,23,42,0.08),0_1px_3px_rgba(0,0,0,0.05)] shrink-0">
              <button
                className={`flex items-center gap-1.5 border-none px-4 py-2 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 ${
                  !listOpen ? "bg-slate-900 text-white" : "bg-transparent text-slate-500 hover:text-slate-900"
                }`}
                onClick={() => setListOpen(false)}
              >
                <MapGlyph size={14} />
                지도
              </button>
              <button
                className={`flex items-center gap-1.5 border-none px-4 py-2 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 ${
                  listOpen ? "bg-slate-900 text-white" : "bg-transparent text-slate-500 hover:text-slate-900"
                }`}
                onClick={() => setListOpen(true)}
              >
                <ListIcon size={14} />
                신고 목록
              </button>
            </div>

            <form
              className="pointer-events-auto flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[0_4px_16px_rgba(15,23,42,0.08),0_1px_3px_rgba(0,0,0,0.05)] text-slate-500 flex-1 basis-[200px] max-w-[280px] min-w-0 border border-transparent transition-all duration-200 focus-within:border-slate-900 focus-within:shadow-[0_4px_20px_rgba(15,23,42,0.12)] max-[900px]:order-4 max-[900px]:basis-full max-[900px]:max-w-none"
              onSubmit={handleSearch}
            >
              <Search size={13} />
              <input
                className="border-none outline-none bg-transparent text-sm text-slate-900 flex-1 min-w-0 placeholder:text-slate-500 placeholder:opacity-70"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="도로명 주소 검색"
                aria-label="도로명 주소 검색"
              />
            </form>

            <div className="pointer-events-auto flex bg-white rounded-full p-1 shadow-[0_4px_16px_rgba(15,23,42,0.08),0_1px_3px_rgba(0,0,0,0.05)] shrink-0">
              <button
                className={`border-none px-4 py-[7px] rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 ${
                  layer === "current" ? "bg-slate-900 text-white" : "bg-transparent text-slate-500"
                }`}
                onClick={() => setLayer("current")}
              >
                현재
              </button>
              <button
                className={`border-none px-4 py-[7px] rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 ${
                  layer === "prediction" ? "bg-slate-900 text-white" : "bg-transparent text-slate-500"
                }`}
                onClick={() => setLayer("prediction")}
              >
                예측
              </button>
            </div>

            <button
              className="pointer-events-auto ml-auto flex items-center gap-1.5 bg-blue-600 text-white border-none px-[18px] py-[9px] rounded-full text-sm font-semibold cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.3)] shrink-0 whitespace-nowrap transition-all duration-200 hover:bg-blue-700 hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.38)]"
              onClick={() => navigate("/report")}
            >
              <Camera size={14} />
              신고하기
            </button>
          </header>

          {searchError && (
            <div className="absolute top-[66px] left-4 z-20 bg-red-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-[0_4px_12px_rgba(220,38,38,0.25)] animate-[tvFadeIn_0.2s_ease]">
              {searchError}
            </div>
          )}

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
                      className={`p-0 rounded-full border-2 border-white shadow-[0_0_0_1px_#e2e8f0,0_3px_8px_rgba(0,0,0,0.25)] cursor-pointer transition-transform duration-150 hover:scale-[1.2] ${
                        pin.severity === "high" ? "w-[26px] h-[26px] border-[3px]" : "w-[18px] h-[18px]"
                      } ${selected?.id === pin.id ? "outline outline-[3px] outline-slate-900 outline-offset-2" : ""}`}
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
                      className="border-none text-white text-[10.5px] font-extrabold px-[9px] py-1 rounded-xl cursor-pointer shadow-[0_3px_10px_rgba(0,0,0,0.2)] transition-transform duration-150 hover:scale-[1.08] bg-[var(--risk-color)]"
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
                <div
                  className="bg-white rounded-xl px-3.5 py-3 min-w-[180px] shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-slate-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between text-sm font-semibold mb-2 pb-2 border-b border-slate-200">
                    <span style={{ color: RISK_COLOR[selectedRisk.risk] }}>
                      {RISK_LABEL[selectedRisk.risk]}
                    </span>
                    <button
                      className="border-none bg-transparent text-slate-500 cursor-pointer"
                      onClick={() => setSelectedRisk(null)}
                      aria-label="닫기"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  {selectedRisk.causes.map((c) => (
                    <div key={c.label} className="flex justify-between text-xs text-slate-500 py-[3px]">
                      <span>{c.label}</span>
                      <span className="text-slate-900 font-semibold">{c.value}</span>
                    </div>
                  ))}
                </div>
              </CustomOverlayMap>
            )}
          </Map>

          <button
            className="absolute right-4 bottom-[54px] z-10 w-10 h-10 rounded-full border-none bg-white text-slate-900 flex items-center justify-center shadow-[0_4px_16px_rgba(15,23,42,0.15)] cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_20px_rgba(15,23,42,0.2)]"
            onClick={handleLocate}
            aria-label="내 위치로 이동"
          >
            <LocateFixed size={16} />
          </button>

          {layer === "current" ? (
            <div className="absolute left-4 bottom-4 z-10 bg-white rounded-xl px-3.5 py-2 flex gap-3 text-xs font-semibold text-slate-500 shadow-[0_4px_16px_rgba(15,23,42,0.1)] border border-slate-200">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
                낮음
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
                보통
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-[11px] h-[11px] rounded-full" style={{ background: "#ef4444" }} />
                심각
              </span>
            </div>
          ) : (
            <div className="absolute left-4 bottom-4 z-10 bg-white rounded-xl px-3.5 py-2 flex gap-3 text-xs font-semibold text-slate-500 shadow-[0_4px_16px_rgba(15,23,42,0.1)] border border-slate-200">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3.5 h-1.5 rounded-sm" style={{ background: RISK_COLOR.low }} />
                LOW
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3.5 h-1.5 rounded-sm" style={{ background: RISK_COLOR.mid }} />
                MID
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3.5 h-1.5 rounded-sm" style={{ background: RISK_COLOR.high }} />
                HIGH
              </span>
            </div>
          )}
        </div>

        {/* 리스트 패널 (지도 옆에서 슬라이드로 열림/닫힘) */}
        <div
          className={`shrink-0 overflow-hidden bg-white border-l border-slate-200 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col *:w-[380px] max-[480px]:*:w-full max-[480px]:absolute max-[480px]:inset-0 max-[480px]:z-[15] ${
            listOpen ? "w-[380px]" : "w-0"
          }`}
        >
          <div className="flex gap-1.5 px-4 pt-4">
            <button
              className={`flex-1 border-none px-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                statusFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"
              }`}
              onClick={() => setStatusFilter("all")}
            >
              전체 신고 <b className="font-extrabold ml-1">{counts.all}</b>
            </button>
            <button
              className={`flex-1 border-none px-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                statusFilter === "open" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"
              }`}
              onClick={() => setStatusFilter("open")}
            >
              미처리 <b className="font-extrabold ml-1">{counts.open}</b>
            </button>
            <button
              className={`flex-1 border-none px-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                statusFilter === "done" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"
              }`}
              onClick={() => setStatusFilter("done")}
            >
              처리완료 <b className="font-extrabold ml-1">{counts.done}</b>
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto px-4 py-3 border-b border-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { value: "all", label: "전체 유형" },
              ...Object.entries(TYPE_LABEL).map(([value, label]) => ({ value, label })),
            ].map((opt) => (
              <button
                key={opt.value}
                className={`shrink-0 border px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${
                  typeFilter === opt.value
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-500"
                }`}
                onClick={() => setTypeFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 p-4 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded">
            {filteredPins.length === 0 && (
              <div className="py-[60px] px-2.5 text-center text-sm text-slate-500">해당하는 신고가 없어요.</div>
            )}

            {filteredPins.map((pin) => {
              const sev = SEVERITY_META[pin.severity];
              const st = STATUS_META[pin.status];
              return (
                <button
                  key={pin.id}
                  className="flex items-start gap-3 bg-slate-50 border border-transparent rounded-xl px-4 py-3.5 text-left cursor-pointer transition-all duration-200 hover:bg-white hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                  onClick={() => setSelected(pin)}
                >
                  <span className="w-2.5 h-2.5 rounded-full mt-[5px] shrink-0" style={{ background: sev.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-900">{TYPE_LABEL[pin.type]}</span>
                      <span style={{ color: sev.color, fontWeight: 700 }}>{sev.label}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{pin.address}</div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2.5 pt-2 border-t border-dashed border-slate-200">
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
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5 animate-[tvFadeIn_0.2s_ease] max-[480px]:p-0 max-[480px]:items-end"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-[420px] bg-white rounded-xl px-[22px] pt-6 pb-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-[tvScaleUp_0.25s_cubic-bezier(0.16,1,0.3,1)] max-[480px]:max-w-full max-[480px]:rounded-b-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 border-none bg-slate-50 w-[30px] h-[30px] rounded-full text-slate-500 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-slate-200 hover:text-slate-900"
              onClick={() => setSelected(null)}
              aria-label="닫기"
            >
              <X size={16} />
            </button>

            <div className="w-full h-40 rounded-xl bg-slate-50 mb-3.5 overflow-hidden flex items-center justify-center border border-slate-200">
              {selected.photoUrl ? (
                <img
                  className="w-full h-full object-cover"
                  src={selected.photoUrl}
                  alt={`${TYPE_LABEL[selected.type]} 현장 사진`}
                />
              ) : (
                <span className="text-xs text-slate-500">사진 없음</span>
              )}
            </div>

            <div className="text-lg font-semibold text-slate-900 mt-0.5">{TYPE_LABEL[selected.type]}</div>
            <div className="text-sm text-slate-500 mb-3.5">{selected.address}</div>

            <div className="flex justify-between py-[9px] border-b border-slate-200 text-sm text-slate-900">
              <span className="text-slate-500">심각도</span>
              <span style={{ color: SEVERITY_META[selected.severity].color, fontWeight: 700 }}>
                {SEVERITY_META[selected.severity].label}
              </span>
            </div>
            <div className="flex justify-between py-[9px] border-b border-slate-200 text-sm text-slate-900">
              <span className="text-slate-500">처리 상태</span>
              <span style={{ color: STATUS_META[selected.status].color, fontWeight: 700 }}>
                {STATUS_META[selected.status].label}
              </span>
            </div>
            <div className="flex justify-between py-[9px] border-b border-slate-200 text-sm text-slate-900">
              <span className="text-slate-500">신고일</span>
              <span>{selected.reportedAt}</span>
            </div>

            <button
              className="w-full mt-[18px] bg-blue-600 text-white border-none py-[13px] rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700"
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

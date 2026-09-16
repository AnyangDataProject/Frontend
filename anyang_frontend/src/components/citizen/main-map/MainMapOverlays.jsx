import React, { useMemo } from "react";
import { X } from "lucide-react";
import { CustomOverlayMap, Polyline } from "react-kakao-maps-sdk";
import { DAMAGE_TYPE_META, SEVERITY_META, ROAD_RISK_META } from "../../../mocks/citizen/constants";
import { RISK_SEGMENTS } from "../../../mocks/citizen/reportsData";

export default function MainMapOverlays({ pins, layer, selectedPin, onSelectPin, selectedRisk, onSelectRisk }) {
  const currentMarkers = useMemo(() => {
    if (layer !== "current") return null;
    return pins.map((pin) => {
      const sev = SEVERITY_META[pin.severity];
      return (
        <CustomOverlayMap key={pin.id} position={{ lat: pin.lat, lng: pin.lng }} xAnchor={0.5} yAnchor={0.5}>
          <button
            className={`p-0 rounded-full border-2 border-white shadow-[0_0_0_1px_#e2e8f0,0_3px_8px_rgba(0,0,0,0.25)] cursor-pointer transition-transform duration-150 hover:scale-[1.2] ${
              pin.severity === "high" ? "w-[26px] h-[26px] border-[3px]" : "w-[18px] h-[18px]"
            } ${selectedPin?.id === pin.id ? "outline outline-[3px] outline-slate-900 outline-offset-2" : ""}`}
            style={{ background: sev.dotColor }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPin(pin);
            }}
            aria-label={`${DAMAGE_TYPE_META[pin.type].label} - ${sev.label} - ${pin.address}`}
          />
        </CustomOverlayMap>
      );
    });
  }, [pins, layer, selectedPin, onSelectPin]);

  const predictionOverlays = useMemo(() => {
    if (layer !== "prediction") return null;
    return RISK_SEGMENTS.map((seg) => (
      <React.Fragment key={seg.id}>
        <Polyline
          path={seg.path}
          strokeWeight={6}
          strokeColor={ROAD_RISK_META[seg.risk].color}
          strokeOpacity={0.85}
          strokeStyle="solid"
          onClick={() => onSelectRisk(seg)}
        />
        <CustomOverlayMap position={seg.mid} xAnchor={0.5} yAnchor={1.4}>
          <button
            className="border-none text-white text-[10.5px] font-extrabold px-[9px] py-1 rounded-xl cursor-pointer shadow-[0_3px_10px_rgba(0,0,0,0.2)] transition-transform duration-150 hover:scale-[1.08] bg-[var(--risk-color)]"
            style={{ "--risk-color": ROAD_RISK_META[seg.risk].color }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRisk(seg);
            }}
            aria-label={`위험도 ${ROAD_RISK_META[seg.risk].label} 구간 상세`}
          >
            {ROAD_RISK_META[seg.risk].label}
          </button>
        </CustomOverlayMap>
      </React.Fragment>
    ));
  }, [layer, onSelectRisk]);

  return (
    <>
      {currentMarkers}
      {predictionOverlays}

      {selectedRisk && (
        <CustomOverlayMap position={selectedRisk.mid} xAnchor={0.5} yAnchor={2.4}>
          <div
            className="bg-white rounded-xl px-3.5 py-3 min-w-[180px] shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-sm font-semibold mb-2 pb-2 border-b border-slate-200">
              <span style={{ color: ROAD_RISK_META[selectedRisk.risk].color }}>
                {ROAD_RISK_META[selectedRisk.risk].label}
              </span>
              <button
                className="border-none bg-transparent text-slate-500 cursor-pointer"
                onClick={() => onSelectRisk(null)}
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
    </>
  );
}

import { useMemo } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { DAMAGE_TYPE_META, SEVERITY_META } from "../../../mocks/citizen/constants";

export default function MainMapOverlays({ pins, selectedPin, onSelectPin }) {
  const currentMarkers = useMemo(() => {
    return pins.map((pin) => {
      const sev = SEVERITY_META[pin.severity];
      const damageType = DAMAGE_TYPE_META[pin.type] ?? { label: pin.type ?? '-' };
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
            aria-label={`${damageType.label} - ${sev.label} - ${pin.address}`}
          />
        </CustomOverlayMap>
      );
    });
  }, [pins, selectedPin, onSelectPin]);

  return <>{currentMarkers}</>;
}

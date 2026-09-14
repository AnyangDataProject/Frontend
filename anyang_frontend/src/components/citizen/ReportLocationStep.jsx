import { MapPin, Navigation } from "lucide-react";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import StepSection from "./StepSection";

export default function ReportLocationStep({
  address,
  onAddressChange,
  onCurrentLocation,
  mapCenter,
  markerPos,
  onMapClick,
}) {
  return (
    <StepSection number="03" title="파손 위치" description="정확한 위치를 입력하면 처리 속도가 빨라집니다.">
      <div className="flex items-center h-12 pr-[7px] pl-[14px] border border-slate-200 rounded-lg bg-white max-[430px]:h-auto max-[430px]:p-[10px] max-[430px]:flex-wrap">
        <MapPin size={18} className="shrink-0 text-blue-600" />
        <input
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="도로명 주소를 입력해주세요."
          className="flex-1 min-w-0 h-full px-2.5 border-0 outline-none text-slate-900 text-sm text-left placeholder:text-slate-400 max-[430px]:h-[35px]"
        />
        <button
          type="button"
          className="h-[34px] px-2.5 flex items-center gap-[5px] border-0 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold cursor-pointer shrink-0 transition-colors hover:bg-slate-200 max-[430px]:w-full max-[430px]:justify-center max-[430px]:mt-[5px]"
          onClick={onCurrentLocation}
        >
          <Navigation size={15} />
          현재 위치
        </button>
      </div>

      <div className="relative h-[220px] mt-3 overflow-hidden border border-slate-200 rounded-xl">
        <Map center={mapCenter} style={{ width: "100%", height: "100%" }} level={4} onClick={onMapClick}>
          {markerPos && (
            <CustomOverlayMap position={markerPos} xAnchor={0.5} yAnchor={1}>
              <div className="w-12 h-12 rounded-full bg-blue-600/15 text-blue-600 flex items-center justify-center">
                <MapPin size={26} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.12)]" />
              </div>
            </CustomOverlayMap>
          )}
        </Map>

        {!markerPos && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] pointer-events-none py-[5px] px-2 rounded-md bg-white/90 text-slate-500 text-xs font-medium">
            지도를 눌러 위치를 선택하세요
          </span>
        )}
      </div>

      <p className="mt-2 mb-0 text-slate-400 text-xs text-left">
        ※ 지도를 클릭하면 해당 위치의 주소가 자동으로 입력됩니다.
      </p>
    </StepSection>
  );
}

import { useMemo, useState } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { MapPin } from 'lucide-react';
import { ANYANG_BOUNDS } from '../../mocks/admin/constants';

const TONE_DOT = {
  danger: 'bg-red-500 ring-red-200',
  warning: 'bg-amber-500 ring-amber-200',
  success: 'bg-emerald-500 ring-emerald-200',
  info: 'bg-blue-500 ring-blue-200',
  neutral: 'bg-slate-400 ring-slate-200',
};

const TONE_TEXT = {
  danger: 'text-red-600',
  warning: 'text-amber-600',
  success: 'text-emerald-600',
  info: 'text-blue-600',
  neutral: 'text-slate-500',
};

const ANYANG_CENTER = {
  lat: (ANYANG_BOUNDS.minLat + ANYANG_BOUNDS.maxLat) / 2,
  lng: (ANYANG_BOUNDS.minLng + ANYANG_BOUNDS.maxLng) / 2,
};

/**
 * 관리자 화면 공용 카카오맵 컴포넌트.
 * 예전 MockMap과 동일한 props 인터페이스(points/selectedId/onSelectPoint/height/showLegend)를
 * 유지해서 페이지 쪽 코드는 그대로 둔 채 렌더링만 실제 지도 SDK로 교체했다.
 */
export default function KakaoMap({
  points = [],
  height = 360,
  level = 7,
  selectedId,
  onSelectPoint,
  showLegend = true,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  const center = useMemo(() => {
    if (points.length === 0) return ANYANG_CENTER;
    const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    return { lat, lng };
  }, [points]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-200" style={{ height }}>
      <Map center={center} level={level} style={{ width: '100%', height: '100%' }}>
        {points.map((point) => {
          const isActive = selectedId === point.id;
          const isHovered = hoveredId === point.id;
          return (
            <CustomOverlayMap key={point.id} position={{ lat: point.lat, lng: point.lng }} xAnchor={0.5} yAnchor={1}>
              <button
                type="button"
                className="group flex flex-col items-center border-none bg-transparent p-0 cursor-pointer"
                onClick={() => onSelectPoint?.(point)}
                onMouseEnter={() => setHoveredId(point.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {(isActive || isHovered) && point.label && (
                  <span className="pointer-events-none mb-1 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow">
                    {point.label}
                  </span>
                )}
                <MapPin
                  size={isActive ? 30 : 24}
                  className={`${TONE_TEXT[point.tone] ?? TONE_TEXT.neutral} drop-shadow-sm transition-transform group-hover:scale-110`}
                  fill="currentColor"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </button>
            </CustomOverlayMap>
          );
        })}
      </Map>

      {points.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-slate-400">
          표시할 위치 정보가 없습니다.
        </div>
      )}

      {showLegend && (
        <div className="absolute bottom-2 left-2 flex gap-3 rounded-md bg-white/90 px-3 py-1.5 text-[11px] text-slate-600 ring-1 ring-slate-200">
          <span className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${TONE_DOT.danger}`} /> 위험
          </span>
          <span className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${TONE_DOT.warning}`} /> 점검필요
          </span>
          <span className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${TONE_DOT.success}`} /> 안전
          </span>
        </div>
      )}
    </div>
  );
}

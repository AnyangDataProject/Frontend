import { useState } from 'react';
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

/**
 * 실제 지도 API(카카오맵 등) 연동 전까지 사용하는 더미 지도 컴포넌트.
 * 위경도(lat/lng)를 받아 지정된 bounds 안에서 상대 위치로 점을 찍어준다.
 * 나중에 실제 지도로 교체할 때는 이 컴포넌트의 props 인터페이스(points/selectedId/onSelectPoint)만
 * 유지한 채 내부 렌더링만 실제 지도 SDK 호출로 바꾸면 된다.
 */
export default function MockMap({
  points = [],
  bounds = ANYANG_BOUNDS,
  height = 360,
  selectedId,
  onSelectPoint,
  showLegend = true,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  const toPosition = (lat, lng) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { left: `${Math.min(97, Math.max(3, x))}%`, top: `${Math.min(94, Math.max(6, y))}%` };
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
      style={{
        height,
        backgroundImage:
          'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <span className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-slate-400 ring-1 ring-slate-200">
        MOCK MAP · 지도 API 연동 예정
      </span>

      {points.map((point) => {
        const pos = toPosition(point.lat, point.lng);
        const isActive = selectedId === point.id;
        const isHovered = hoveredId === point.id;
        return (
          <button
            key={point.id}
            type="button"
            className="group absolute -translate-x-1/2 -translate-y-full cursor-pointer"
            style={pos}
            onClick={() => onSelectPoint?.(point)}
            onMouseEnter={() => setHoveredId(point.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <MapPin
              size={isActive ? 30 : 24}
              className={`${TONE_TEXT[point.tone] ?? TONE_TEXT.neutral} drop-shadow-sm transition-transform group-hover:scale-110`}
              fill="currentColor"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            {(isActive || isHovered) && point.label && (
              <span className="pointer-events-none absolute left-1/2 top-[-6px] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow">
                {point.label}
              </span>
            )}
          </button>
        );
      })}

      {points.length === 0 && (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
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

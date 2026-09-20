import { useEffect, useMemo, useState } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { ANYANG_BOUNDS } from '../../mocks/admin/constants';
import { TONE_DOT_CLASSES } from './toneClasses';

// 범례 점 전용 링 강조색. 채우기 색 자체는 toneClasses의 TONE_DOT_CLASSES를
// 그대로 재사용해서 Badge/StatCard와 같은 tone 색 체계를 유지한다.
const TONE_RING_ACCENT = {
  danger: 'ring-red-200',
  warning: 'ring-amber-200',
  success: 'ring-emerald-200',
  info: 'ring-blue-200',
  neutral: 'ring-slate-200',
};

const TONE_LABEL = {
  danger: '위험',
  warning: '점검필요',
  success: '안전',
  info: '정보',
  neutral: '기타',
};

const ANYANG_CENTER = {
  lat: (ANYANG_BOUNDS.minLat + ANYANG_BOUNDS.maxLat) / 2,
  lng: (ANYANG_BOUNDS.minLng + ANYANG_BOUNDS.maxLng) / 2,
};

function hasValidCoordinate(point) {
  return Number.isFinite(point.lat) && Number.isFinite(point.lng);
}

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
  // ref는 SDK가 지도를 만들기 전(첫 effect 실행 시점)에는 비어 있어서, onCreate로 받아 상태로 들고 있는다
  const [map, setMap] = useState(null);

  // 좌표가 없거나 숫자가 아닌 포인트가 하나 섞여 있어도 전체 지도가 깨지지 않도록 걸러낸다
  // (좌표가 아직 지오코딩되지 않은 실제 API 데이터가 들어올 가능성을 대비).
  const validPoints = useMemo(() => points.filter(hasValidCoordinate), [points]);

  const center = useMemo(() => {
    if (validPoints.length === 0) return ANYANG_CENTER;
    const lat = validPoints.reduce((sum, p) => sum + p.lat, 0) / validPoints.length;
    const lng = validPoints.reduce((sum, p) => sum + p.lng, 0) / validPoints.length;
    return { lat, lng };
  }, [validPoints]);

  // 포인트가 여러 개면 지정된 level 대신 모든 마커가 화면 안에 들어오도록 자동으로 맞춘다.
  // (포인트가 1개뿐인 도로 상세 페이지 등에서는 호출부가 지정한 level을 그대로 존중한다.)
  useEffect(() => {
    if (!map || validPoints.length < 2 || !window.kakao?.maps) return;
    const bounds = new window.kakao.maps.LatLngBounds();
    validPoints.forEach((p) => bounds.extend(new window.kakao.maps.LatLng(p.lat, p.lng)));
    map.setBounds(bounds);
  }, [map, validPoints]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-200" style={{ height }}>
      <Map onCreate={setMap} center={center} level={level} style={{ width: '100%', height: '100%' }}>
        {validPoints.map((point) => {
          const isActive = selectedId === point.id;
          const isHovered = hoveredId === point.id;
          return (
            <CustomOverlayMap key={point.id} position={{ lat: point.lat, lng: point.lng }} xAnchor={0.5} yAnchor={0.5}>
              <button
                type="button"
                aria-label={`${point.label ?? '구간'} - 위험도 ${TONE_LABEL[point.tone] ?? TONE_LABEL.neutral}`}
                className="group relative flex cursor-pointer items-center justify-center border-none bg-transparent p-0"
                onClick={() => onSelectPoint?.(point)}
                onMouseEnter={() => setHoveredId(point.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <span
                  className={`block rounded-full border-2 border-white shadow-[0_0_0_1px_#e2e8f0,0_3px_8px_rgba(0,0,0,0.25)] transition-transform duration-150 group-hover:scale-[1.2] ${
                    TONE_DOT_CLASSES[point.tone] ?? TONE_DOT_CLASSES.neutral
                  } ${point.tone === 'danger' ? 'h-[26px] w-[26px] border-[3px]' : 'h-[18px] w-[18px]'} ${
                    isActive ? 'outline outline-[3px] outline-slate-900 outline-offset-2' : ''
                  }`}
                />
                {(isActive || isHovered) && point.label && (
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow">
                    {point.label}
                  </span>
                )}
              </button>
            </CustomOverlayMap>
          );
        })}
      </Map>

      {validPoints.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-slate-400">
          표시할 위치 정보가 없습니다.
        </div>
      )}

      {showLegend && (
        <div className="absolute bottom-2 left-2 flex gap-3 rounded-md bg-white/90 px-3 py-1.5 text-[11px] text-slate-600 ring-1 ring-slate-200">
          <span className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${TONE_DOT_CLASSES.danger} ${TONE_RING_ACCENT.danger}`} /> 위험
          </span>
          <span className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${TONE_DOT_CLASSES.warning} ${TONE_RING_ACCENT.warning}`} /> 점검필요
          </span>
          <span className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${TONE_DOT_CLASSES.success} ${TONE_RING_ACCENT.success}`} /> 안전
          </span>
        </div>
      )}
    </div>
  );
}

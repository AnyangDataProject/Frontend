import { PRIORITY_GRADE_META } from '../mocks/admin/constants';

// 전 구간이 "경기도 안양시"라 반복돼서, 좁은 지도/목록에서는 구/도로명만 보여준다.
export function shortenRoadAddress(address) {
  return address?.replace(/^경기도\s*안양시\s*/, '') ?? '';
}

// 점검 우선순위 구간(cluster) 데이터를 KakaoMap 마커 포인트로 변환.
// 대시보드(목록)와 도로 상세(단건) 페이지가 각자 구현하며 드리프트하던 걸 하나로 모음.
export function clusterToMapPoint(cluster) {
  return {
    id: cluster.cluster,
    lat: cluster.latitude,
    lng: cluster.longitude,
    label: shortenRoadAddress(cluster.roadAddress),
    tone: (PRIORITY_GRADE_META[cluster.priorityGrade] ?? PRIORITY_GRADE_META.일반).tone,
  };
}

import { SEVERITY_TO_UI, STATUS_TO_UI } from '../api/enumMapping';

// 신고 상세 DTO(api/report.js에서 casing이 이미 정규화된 값)를 화면에서 쓰는
// 공통 뷰모델로 변환. MainMap(지도 핀)과 MyReports(내 신고현황)가 각자
// 거의 동일한 변환을 중복 구현하다 드리프트(aiConfidence 반올림 누락 등)가
// 생겼던 걸 막기 위해 한 곳으로 모음.
export function toReportViewModel(dto) {
  return {
    id: dto.id,
    type: dto.type,
    severity: SEVERITY_TO_UI[dto.severity] ?? 'low',
    status: STATUS_TO_UI[dto.status] ?? 'received',
    address: dto.address,
    description: dto.description,
    reportedAt: dto.reportedAt ? dto.reportedAt.slice(0, 10) : '',
    aiConfidence: dto.aiConfidence != null ? Math.round(dto.aiConfidence) : null,
    lat: Number(dto.latitude),
    lng: Number(dto.longitude),
    reporter: dto.userName,
    imageUrl: dto.images?.[0]?.imageUrl ?? '',
    resultImageUrl: dto.images?.[0]?.resultImageUrl ?? null,
  };
}

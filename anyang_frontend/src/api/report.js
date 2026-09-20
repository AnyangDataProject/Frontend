import { apiRequest, apiRequestMultipart } from './client';

// 백엔드가 type/severity/status 값을 대소문자 혼재로 내려줘서(POTHOLE/pothole, HIGH/high 등)
// 프론트의 매핑 테이블(DAMAGE_TYPE_META, SEVERITY_TO_UI, STATUS_TO_UI)이 전부 소문자 키를 쓰는 것에 맞춰 정규화.
// aiConfidence는 YOLO 관례대로 0~1 사이 소수로 내려와서, 화면에서 쓰는 0~100 퍼센트로 환산
function normalizeReport(dto) {
  return {
    ...dto,
    type: String(dto.type ?? '').toLowerCase(),
    severity: String(dto.severity ?? '').toLowerCase(),
    status: String(dto.status ?? '').toLowerCase(),
    aiConfidence: dto.aiConfidence != null ? dto.aiConfidence * 100 : null,
  };
}

export async function getMyReports() {
  const reports = await apiRequest('/api/report/my');
  return (reports ?? []).map(normalizeReport);
}

export function submitReport({ detail, latitude, longitude, address, damageType, severity, images }) {
  const formData = new FormData();

  const reportBlob = new Blob(
    [JSON.stringify({ detail, latitude, longitude, address, damageType, severity })],
    { type: 'application/json' }
  );
  formData.append('report', reportBlob);

  images.forEach((item) => {
    formData.append('images', item.file);
  });

  return apiRequestMultipart('/api/report', { formData });
}

// ---------- 관리자 ----------

export async function fetchAllReports() {
  const reports = await apiRequest('/api/admin/report');
  return (reports ?? []).map(normalizeReport);
}

export async function fetchUnclassifiedReports() {
  const reports = await apiRequest('/api/admin/report/unclassified');
  return (reports ?? []).map(normalizeReport);
}

export async function fetchReportById(id) {
  const reports = await fetchAllReports();
  return reports.find((r) => String(r.id) === String(id)) ?? null;
}

export function updateReportStatusAdmin(reportId, status) {
  return apiRequest(`/api/admin/report/${reportId}/status?status=${status}`, {
    method: 'PATCH',
  });
}
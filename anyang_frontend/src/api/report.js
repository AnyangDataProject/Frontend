import { apiRequest, apiRequestMultipart } from './client';

// 백엔드가 파손 유형(type) 값을 대소문자 혼재로 내려줘서(POTHOLE / pothole) 소문자로 정규화
function normalizeReport(dto) {
  return { ...dto, type: String(dto.type ?? '').toLowerCase() };
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
import { apiRequest, apiRequestMultipart } from './client';

export function getMyReports() {
  return apiRequest('/api/report/my');
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

export function fetchAllReports() {
  return apiRequest('/api/admin/report');
}

export function fetchUnclassifiedReports() {
  return apiRequest('/api/admin/report/unclassified');
}

export async function fetchReportById(id) {
  const reports = await apiRequest('/api/admin/report');
  return reports.find((r) => String(r.id) === String(id)) ?? null;
}

export function updateReportStatusAdmin(reportId, status) {
  return apiRequest(`/api/admin/report/${reportId}/status?status=${status}`, {
    method: 'PATCH',
  });
}
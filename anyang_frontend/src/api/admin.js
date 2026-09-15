import { apiRequest } from './client';

export function fetchClusterDetail(cluster) {
  return apiRequest(`/api/admin/inspection-clusters/${cluster}`);
}

export function fetchMonthlyDamage(cluster, year) {
  return apiRequest(`/api/admin/inspection-clusters/${cluster}/monthly-damage?year=${year}`);
}

export async function fetchPriorityClusters() {
  const data = await apiRequest('/api/admin/inspection-clusters');
  return [...data].sort((a, b) => a.priorityRank - b.priorityRank);
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

export function fetchAllReports() {
  return apiRequest('/api/admin/report');
}
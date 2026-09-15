import { apiRequest } from './client';
import { getStoredToken } from '../context/AuthContext.jsx';

export function fetchClusterDetail(cluster) {
  const token = getStoredToken();
  return apiRequest(`/api/admin/inspection-clusters/${cluster}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function fetchMonthlyDamage(cluster, year) {
  const token = getStoredToken();
  return apiRequest(`/api/admin/inspection-clusters/${cluster}/monthly-damage?year=${year}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function fetchPriorityClusters() {
  const token = getStoredToken();
  const data = await apiRequest('/api/admin/inspection-clusters', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return [...data].sort((a, b) => a.priorityRank - b.priorityRank);
}

export function fetchUnclassifiedReports() {
  const token = getStoredToken();
  return apiRequest('/api/admin/report/unclassified', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function fetchReportById(id) {
  const token = getStoredToken();
  const reports = await apiRequest('/api/admin/report', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const report = reports.find((r) => String(r.id) === String(id));
  if (!report) throw new Error('신고를 찾을 수 없습니다.');
  return report;
}

export function updateReportStatusAdmin(reportId, status) {
  const token = getStoredToken();
  return apiRequest(`/api/admin/report/${reportId}/status?status=${status}`, {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function fetchAllReports() {
  const token = getStoredToken();
  return apiRequest('/api/admin/report', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
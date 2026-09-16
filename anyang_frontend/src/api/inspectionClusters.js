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

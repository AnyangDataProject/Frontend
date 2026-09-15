import { apiRequest } from './client';
import { getStoredToken } from '../context/AuthContext.jsx';

export function getAiAnalysis(reportId) {
  const token = getStoredToken();
  return apiRequest(`/api/report/${reportId}/ai-analysis`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
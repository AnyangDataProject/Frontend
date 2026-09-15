import { apiRequest } from './client';

export function getAiAnalysis(reportId) {
  return apiRequest(`/api/report/${reportId}/ai-analysis`);
}
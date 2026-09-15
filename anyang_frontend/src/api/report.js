import { apiRequest, apiRequestMultipart } from './client';
import { getStoredToken } from '../context/AuthContext.jsx';

export function getMyReports() {
  const token = getStoredToken();
  return apiRequest('/api/report/my', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
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

  const token = getStoredToken();

  return apiRequestMultipart('/api/report', {
    formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
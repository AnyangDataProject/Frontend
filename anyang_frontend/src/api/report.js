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
import { apiRequest, apiRequestMultipart } from './client';
import { getStoredToken } from '../context/AuthContext.jsx';

export async function submitInquiry({ inquiryType, title, content, email, files }) {
  const token = getStoredToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const id = await apiRequest('/inquiries', {
    method: 'POST',
    body: { inquiryType, title, content, email },
    headers,
  });

  if (files && files.length > 0) {
    const formData = new FormData();
    files.forEach((item) => {
      formData.append('files', item.file);
    });

    await apiRequestMultipart(`/inquiries/${id}/files`, {
      formData,
      headers,
    });
  }

  return id;
}
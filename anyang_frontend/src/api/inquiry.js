import { apiRequest, apiRequestMultipart } from './client';
import { getStoredToken } from '../utils/authStorage';

export async function submitInquiry({ inquiryType, title, content, email, files }) {
  const token = getStoredToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const id = await apiRequest('/inquiries', {
    method: 'POST',
    body: { inquiryType, title, content, email },
    headers,
  });

  if (id == null) {
    throw new Error('문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

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

export function getMyInquiries(page = 0, size = 20) {
  const token = getStoredToken();
  return apiRequest(`/inquiries?page=${page}&size=${size}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function getInquiryDetail(id) {
  const token = getStoredToken();
  return apiRequest(`/inquiries/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
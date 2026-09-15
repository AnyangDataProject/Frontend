import { apiRequest, apiRequestMultipart } from './client';

export async function submitInquiry({ inquiryType, title, content, email, files }) {
  const id = await apiRequest('/inquiries', {
    method: 'POST',
    body: { inquiryType, title, content, email },
  });

  if (files && files.length > 0) {
    const formData = new FormData();
    files.forEach((item) => {
      formData.append('files', item.file);
    });

    await apiRequestMultipart(`/inquiries/${id}/files`, {
      formData,
    });
  }

  return id;
}
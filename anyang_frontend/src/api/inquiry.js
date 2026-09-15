import { apiRequest, apiRequestMultipart } from './client';

export async function submitInquiry({ inquiryType, title, content, email, files }) {
  const id = await apiRequest('/inquiries', {
    method: 'POST',
    body: { inquiryType, title, content, email },
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
    });
  }

  return id;
}
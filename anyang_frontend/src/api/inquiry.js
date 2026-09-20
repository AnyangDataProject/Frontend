import { apiRequest, apiRequestMultipart } from './client';

export async function submitInquiry({ inquiryType, title, content, email, files }) {
  const id = await apiRequest('/inquiries', {
    method: 'POST',
    body: { inquiryType, title, content, email },
  });

  if (id == null) {
    throw new Error('문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  // 문의 생성과 파일 업로드가 서버에서 별도 API라서, 업로드만 실패해도 문의 자체는 이미 접수된 상태다.
  // 여기서 throw하면 사용자가 재제출해 중복 문의가 생기므로, 실패는 결과로 돌려줘서 호출부가 안내한다.
  let attachmentError = null;

  if (files && files.length > 0) {
    const formData = new FormData();
    files.forEach((item) => {
      formData.append('files', item.file);
    });

    try {
      await apiRequestMultipart(`/inquiries/${id}/files`, {
        formData,
      });
    } catch (err) {
      attachmentError = err;
    }
  }

  return { id, attachmentError };
}
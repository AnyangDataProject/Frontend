import { apiRequest, apiRequestMultipart } from './client';
import { INQUIRY_TYPE_FROM_BACKEND } from './enumMapping';

const LIST_PAGE_SIZE = 100;
const MAX_LIST_PAGES = 50;

// '2026-09-09T09:32:11' -> '2026-09-09 09:32'
function formatDateTime(value) {
  return value ? value.replace('T', ' ').slice(0, 16) : '';
}

function mapInquiry(dto) {
  return {
    id: dto.id,
    type: INQUIRY_TYPE_FROM_BACKEND[dto.inquiryType] ?? 'other',
    title: dto.title ?? '',
    status: String(dto.status ?? 'WAITING').toLowerCase(),
    createdAt: formatDateTime(dto.createdAt),
  };
}

function mapInquiryDetail(dto) {
  return {
    ...mapInquiry(dto),
    content: dto.content ?? '',
    email: dto.email ?? '',
    answer: dto.answer ?? '',
    answeredByName: dto.answeredByName ?? '',
    answeredAt: formatDateTime(dto.answeredAt),
    fileUrls: dto.fileUrls ?? [],
  };
}

// 문의 목록. 관리자/시민 화면이 같이 쓰며, 어떤 문의를 내려줄지는 서버가 로그인 사용자 기준으로 결정한다
// (시민 계정은 본인이 작성한 문의만 내려옴). 페이지 단위로만 내려주므로 마지막 페이지까지 모아서 반환한다.
// (목록 응답에는 내용/이메일/답변이 없어서 필요할 때 fetchInquiryDetail로 따로 조회)
export async function fetchInquiries() {
  const all = [];

  for (let page = 0; page < MAX_LIST_PAGES; page += 1) {
    const result = await apiRequest(`/inquiries?page=${page}&size=${LIST_PAGE_SIZE}`);
    all.push(...(result?.content ?? []));
    if (!result || result.last !== false) break;
  }

  return all.map(mapInquiry).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function fetchInquiryDetail(id) {
  const dto = await apiRequest(`/inquiries/${id}`);
  return dto ? mapInquiryDetail(dto) : null;
}

export async function updateInquiry(id, { title, content }) {
  await apiRequest(`/inquiries/${id}`, {
    method: 'PUT',
    body: { title: title.trim(), content: content.trim() },
  });
  return fetchInquiryDetail(id);
}

export async function deleteInquiry(id) {
  await apiRequest(`/inquiries/${id}`, { method: 'DELETE' });
}

export async function submitInquiryAnswer(id, answerText) {
  await apiRequest(`/inquiries/${id}/answer`, {
    method: 'PUT',
    body: { answer: answerText.trim() },
  });
  return fetchInquiryDetail(id);
}

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
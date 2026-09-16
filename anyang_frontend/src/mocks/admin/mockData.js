// 문의 관리 목데이터. fetch/apiRequest 없이 로컬 배열만 흉내 낸 가짜 응답이라
// src/api/*.js(실제 백엔드 호출)가 아니라 여기 있다. 실제 엔드포인트가 생기면
// 이 함수 두 개만 src/api/inquiry.js 같은 실제 파일로 교체하면 되도록
// fetchInquiries/submitInquiryAnswer 시그니처를 실제 API 함수와 동일하게 맞춰뒀다.
// 신고/회원/점검 우선순위 관리는 실제 백엔드(src/api/*.js)로 이관 완료.

import { INQUIRIES } from './inquiriesData';

const NETWORK_DELAY = 300;

function delay(value, ms = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchInquiries() {
  return delay([...INQUIRIES]);
}

export async function submitInquiryAnswer(id, answerText) {
  const inquiry = INQUIRIES.find((i) => i.id === id);
  if (!inquiry) return delay(null);
  inquiry.status = 'answered';
  inquiry.answer = answerText.trim();
  return delay({ ...inquiry });
}

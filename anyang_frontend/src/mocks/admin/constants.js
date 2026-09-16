// 관리자 화면 전역에서 재사용하는 상태값 정의
// tone은 공용 Badge 컴포넌트가 색상을 결정할 때 사용합니다.

import { CircleDot, Construction, TrendingDown, CircleAlert, Signpost, Minus } from 'lucide-react';

export const ANYANG_BOUNDS = {
  minLat: 37.352,
  maxLat: 37.452,
  minLng: 126.895,
  maxLng: 127.008,
};

export const REPORT_STATUS_STEPS = [
  { key: 'received', label: '신고접수' },
  { key: 'assigned', label: '담당부서확인' },
  { key: 'inspecting', label: '현장점검' },
  { key: 'done', label: '처리완료' },
];

export const REPORT_STATUS_META = {
  received: { label: '신고접수', tone: 'info' },
  assigned: { label: '담당부서확인', tone: 'warning' },
  inspecting: { label: '현장점검', tone: 'warning' },
  done: { label: '처리완료', tone: 'success' },
};

export const DAMAGE_TYPE_META = {
  pothole: { label: '포트홀', icon: CircleDot },
  crack: { label: '노면 균열', icon: Construction },
  subsidence: { label: '도로 침하', icon: TrendingDown },
  manhole: { label: '맨홀 파손', icon: CircleAlert },
  sign: { label: '표지판 파손', icon: Signpost },
  lane: { label: '차선 마모', icon: Minus },
};

export const SEVERITY_META = {
  minor: { label: '경미', tone: 'success' },
  moderate: { label: '보통', tone: 'warning' },
  severe: { label: '심각', tone: 'danger' },
};

export const TRAFFIC_LEVEL_META = {
  high: { label: '높음' },
  mid: { label: '보통' },
  low: { label: '낮음' },
};

export const CONGESTION_META = {
  smooth: { label: '원활', tone: 'success' },
  slow: { label: '서행', tone: 'warning' },
  delay: { label: '지체', tone: 'warning' },
  jam: { label: '정체', tone: 'danger' },
};

// 아래 세 개는 실제 백엔드 연동(클러스터 기반 점검 우선순위, 신고 UI 3단계) 이후
// 여러 관리자 페이지에서 반복 정의되던 것을 여기로 모았다. 위의 SEVERITY_META,
// REPORT_STATUS_META(4단계)는 목데이터 시절 값이라 스케일이 달라 이름을 분리했다.

export const PRIORITY_GRADE_META = {
  최우선: { label: '최우선', tone: 'danger' },
  우선: { label: '우선', tone: 'warning' },
  관심: { label: '관심', tone: 'info' },
  일반: { label: '일반', tone: 'success' },
};

export const SEVERITY_UI_META = {
  low: { label: '낮음', tone: 'success' },
  mid: { label: '보통', tone: 'warning' },
  high: { label: '높음', tone: 'danger' },
};

export const REPORT_STATUS_UI_META = {
  received: { label: '접수됨', tone: 'info' },
  progress: { label: '처리중', tone: 'warning' },
  done: { label: '처리완료', tone: 'success' },
};

export const MEMBER_STATUS_META = {
  active: { label: '정상', tone: 'success' },
  restricted: { label: '이용 제한', tone: 'danger' },
};

export const INQUIRY_STATUS_META = {
  waiting: { label: '답변 대기', tone: 'warning' },
  answered: { label: '답변 완료', tone: 'success' },
};

export const INQUIRY_TYPE_META = {
  report: { label: '신고 관련 문의' },
  result: { label: '처리 결과 문의' },
  service: { label: '서비스 이용 문의' },
  other: { label: '기타 민원' },
};

export const CAUSE_FACTOR_LABEL = {
  traffic: '교통량',
  rainfall: '강수량',
  temperature: '기온변화',
  accidents: '사고이력',
  other: '기타',
};

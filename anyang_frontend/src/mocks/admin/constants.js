// 관리자 화면 전역에서 재사용하는 상태값 정의
// tone은 공용 Badge 컴포넌트가 색상을 결정할 때 사용합니다.

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
  pothole: { label: '포트홀' },
  crack: { label: '노면 균열' },
  subsidence: { label: '도로 침하' },
  manhole: { label: '맨홀 파손' },
  sign: { label: '표지판 파손' },
  lane: { label: '차선 마모' },
};

export const SEVERITY_META = {
  minor: { label: '경미', tone: 'success' },
  moderate: { label: '보통', tone: 'warning' },
  severe: { label: '심각', tone: 'danger' },
};

export const RISK_LEVEL_META = {
  high: { label: 'HIGH', tone: 'danger' },
  mid: { label: 'MID', tone: 'warning' },
  low: { label: 'LOW', tone: 'success' },
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

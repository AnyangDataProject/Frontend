// 프론트 내부 표기(mock 시절부터 쓰던 소문자 키) ↔ 백엔드 enum 간 변환

// 신고 등록 시: 프론트 UI 값 → 백엔드로 보낼 enum(대문자)
export const SEVERITY_TO_BACKEND = {
  low: "LOW",
  mid: "MEDIUM",
  high: "HIGH",
};

// 조회 시: 백엔드 severity → 프론트 UI 값
// 백엔드가 내려주는 casing이 종종 바뀌어서(low/high ↔ LOW/HIGH), 이 맵은 항상 소문자
// 입력만 받는다고 가정한다. api/report.js의 normalizeReport()가 조회 응답을 전부
// 소문자로 정규화해서 넘겨주므로, 이 파일은 casing을 신경 쓸 필요가 없다.
export const SEVERITY_TO_UI = {
  low: "low",
  medium: "mid",
  high: "high",
};

// 조회 시: 백엔드 6단계 상태 → 프론트 UI 3단계로 축약 (역시 소문자 입력 전제)
export const STATUS_TO_UI = {
  received: "received",
  ai_analyzed: "received",
  confirmed: "progress",
  in_progress: "progress",
  completed: "done",
  rejected: "done",
};

export const INQUIRY_TYPE_TO_BACKEND = {
  report: "REPORT",
  result: "RESULT",
  service: "SERVICE",
  other: "ETC",
};
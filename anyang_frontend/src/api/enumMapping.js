// 프론트 내부 표기(mock 시절부터 쓰던 소문자 키) ↔ 백엔드 enum 간 변환

// 신고 등록 시: 프론트 UI 값 → 백엔드로 보낼 enum(대문자)
export const SEVERITY_TO_BACKEND = {
  low: "LOW",
  mid: "MEDIUM",
  high: "HIGH",
};

// 조회 시: 백엔드가 내려주는 값(소문자) → 프론트 UI 값
export const SEVERITY_TO_UI = {
  low: "low",
  medium: "mid",
  high: "high",
};

// 조회 시: 백엔드 6단계 상태(소문자) → 프론트 UI 3단계로 축약
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

export const INQUIRY_TYPE_TO_UI = {
  REPORT: "report",
  RESULT: "result",
  SERVICE: "service",
  ETC: "other",
};

export const INQUIRY_STATUS_TO_UI = {
  WAITING: "waiting",
  ANSWERED: "answered",
};
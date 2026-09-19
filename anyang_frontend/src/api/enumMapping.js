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

// 관리자 화면의 상태 라벨/배지용 키. 필터 탭·집계는 반려를 처리완료(done)로 묶지만
// 라벨은 "처리완료"가 아니라 "반려"로 보여줘야 해서 별도 키를 씀.
export const toStatusLabelKey = (status) =>
  status === "rejected" ? "rejected" : (STATUS_TO_UI[status] ?? "received");

export const INQUIRY_TYPE_TO_BACKEND = {
  report: "REPORT",
  result: "RESULT",
  service: "SERVICE",
  other: "ETC",
};

// 관리자가 신고 처리 상태를 다음 단계로 진행시킬 때 쓰는 표.
// 각 배열의 [0]은 현재 상태(표시용), [1]은 다음으로 보낼 수 있는 상태.
// AdminReportsTable(드롭다운)과 AdminReportDetail(다음 단계로 진행 버튼)이
// 각자 이 표를 따로 들고 있다가 어긋났던 적이 있어 한 곳으로 모음.
export const NEXT_STATUS_OPTIONS = {
  RECEIVED: [
    { value: "RECEIVED", label: "접수됨" },
    { value: "CONFIRMED", label: "확인됨" },
  ],
  AI_ANALYZED: [
    { value: "AI_ANALYZED", label: "AI 분석 완료" },
    { value: "CONFIRMED", label: "확인됨" },
  ],
  CONFIRMED: [
    { value: "CONFIRMED", label: "확인됨" },
    { value: "IN_PROGRESS", label: "처리중" },
  ],
  IN_PROGRESS: [
    { value: "IN_PROGRESS", label: "처리중" },
    { value: "COMPLETED", label: "처리완료" },
  ],
  COMPLETED: [{ value: "COMPLETED", label: "처리완료" }],
  REJECTED: [{ value: "REJECTED", label: "반려" }],
};

export const REJECT_OPTION = { value: "REJECTED", label: "반려" };

// 처리완료/반려는 최종 상태라 반려로 보낼 수 없음
export const canReject = (rawStatus) => rawStatus !== "COMPLETED" && rawStatus !== "REJECTED";
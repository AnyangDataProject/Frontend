// 직접 URL로 들어왔을 때(지도에서 신고를 선택하지 않고 접근했을 때) 사용할 임시 데이터
export const fallbackReport = {
  id: 1,
  type: "pothole",
  severity: "high",
  status: "received",
  address: "동안구 평촌대로 123",
  reportedAt: "2026-09-08",
  reporter: "김민준",
};

// 실제 AI 모델 연동 전 사용할 Mock 분석 결과
const MOCK_ANALYSIS_RESULTS = {
  pothole: {
    confidence: 96,
    size: "중형",
    cause: "노면 침하 및 반복 하중",
    summary:
      "도로 표면에서 포트홀 형태의 파손 영역이 확인되었습니다. 차량의 반복적인 통행과 노면 침하로 인해 파손이 발생했을 가능성이 높으며, 현재 위험도는 높은 수준으로 판단됩니다. 차량 및 이륜차 통행 시 주의가 필요하며 신속한 현장 확인과 보수가 권장됩니다.",
  },

  crack: {
    confidence: 91,
    size: "중형",
    cause: "노면 노후화 및 온도 변화",
    summary:
      "도로 표면에서 선형 균열이 확인되었습니다. 노면의 노후화 또는 온도 변화에 따른 반복적인 수축·팽창이 주요 원인으로 추정됩니다. 균열이 확대될 가능성이 있으므로 지속적인 관찰과 보수가 필요합니다.",
  },

  sign: {
    confidence: 94,
    size: "소형",
    cause: "외부 충격 또는 시설물 노후화",
    summary:
      "도로 안전시설물에서 파손 또는 변형이 확인되었습니다. 외부 충격이나 시설물 노후화에 의한 파손으로 추정되며, 도로 이용자의 안전을 위해 현장 확인이 필요합니다.",
  },

  manhole: {
    confidence: 89,
    size: "중형",
    cause: "시설물 노후화 및 주변 노면 침하",
    summary:
      "맨홀 및 주변 도로시설물에서 이상 징후가 확인되었습니다. 시설물 노후화 또는 주변 노면 침하가 원인일 가능성이 있으며, 차량 통행 시 충격이 발생할 수 있어 현장 점검이 권장됩니다.",
  },
};

export function getMockAnalysis(report) {
  return MOCK_ANALYSIS_RESULTS[report.type] || MOCK_ANALYSIS_RESULTS.pothole;
}

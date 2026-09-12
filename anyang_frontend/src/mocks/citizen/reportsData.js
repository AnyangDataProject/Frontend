// 지도(MainMap)에 표시되는 신고 핀 목록
export const MAP_PINS = [
  { id: 1, lat: 37.3928, lng: 126.9516, type: "pothole", severity: "high", status: "received", address: "동안구 평촌대로 123", reportedAt: "2026-09-08", photoUrl: null },
  { id: 2, lat: 37.4014, lng: 126.9527, type: "crack", severity: "mid", status: "progress", address: "동안구 시민대로 45", reportedAt: "2026-09-07", photoUrl: null },
  { id: 3, lat: 37.3945, lng: 126.9226, type: "sign", severity: "low", status: "done", address: "만안구 안양로 210", reportedAt: "2026-09-05", photoUrl: null },
  { id: 4, lat: 37.3902, lng: 126.9241, type: "pothole", severity: "mid", status: "received", address: "만안구 삼덕로 8", reportedAt: "2026-09-08", photoUrl: null },
  { id: 5, lat: 37.3843, lng: 126.9556, type: "manhole", severity: "high", status: "progress", address: "동안구 관악대로 77", reportedAt: "2026-09-06", photoUrl: null },
  { id: 6, lat: 37.3798, lng: 126.9298, type: "crack", severity: "low", status: "done", address: "만안구 병목안로 19", reportedAt: "2026-09-03", photoUrl: null },
  { id: 7, lat: 37.3861, lng: 126.9613, type: "pothole", severity: "low", status: "received", address: "동안구 흥안대로 33", reportedAt: "2026-09-08", photoUrl: null },
  { id: 8, lat: 37.3971, lng: 126.9605, type: "sign", severity: "mid", status: "received", address: "동안구 평촌대로 301", reportedAt: "2026-09-07", photoUrl: null },
];

// 내 신고현황(MyReports)에 표시되는 신고 목록 (MAP_PINS와는 별개의 뷰용 목데이터)
export const MY_REPORTS = [
  {
    id: 1,
    type: "pothole",
    severity: "high",
    status: "received",
    address: "안양시 동안구 평촌대로 123",
    reportedAt: "2026-09-08",
    description: "차량 통행이 많은 도로에 큰 포트홀이 발생해 차량 주행 시 위험해 보입니다.",
    aiConfidence: 94.2,
    aiRisk: "높음",
    image: "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    type: "crack",
    severity: "mid",
    status: "progress",
    address: "안양시 동안구 시민대로 45",
    reportedAt: "2026-09-06",
    description: "도로 중앙 부분에 길게 균열이 발생했습니다. 균열이 점점 넓어지는 것 같습니다.",
    aiConfidence: 91.8,
    aiRisk: "보통",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    type: "sign",
    severity: "low",
    status: "done",
    address: "안양시 만안구 안양로 210",
    reportedAt: "2026-09-03",
    description: "도로 옆 안내 표지판이 기울어져 있어 정비가 필요해 보입니다.",
    aiConfidence: 88.5,
    aiRisk: "낮음",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    type: "manhole",
    severity: "high",
    status: "progress",
    address: "안양시 동안구 관악대로 77",
    reportedAt: "2026-09-01",
    description: "맨홀 주변 도로가 내려앉아 차량이 지나갈 때 충격이 발생합니다.",
    aiConfidence: 96.1,
    aiRisk: "높음",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    type: "pothole",
    severity: "mid",
    status: "done",
    address: "안양시 만안구 삼덕로 8",
    reportedAt: "2026-08-27",
    description: "도로 우측에 작은 포트홀이 발생했습니다.",
    aiConfidence: 90.4,
    aiRisk: "보통",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80",
  },
];

// 위험 예측 레이어용 임시 구간 데이터 (실제로는 백엔드 위험도 예측 API 값으로 교체)
export const RISK_SEGMENTS = [
  {
    id: "seg1",
    risk: "high",
    path: [{ lat: 37.3960, lng: 126.9480 }, { lat: 37.3958, lng: 126.9560 }],
    mid: { lat: 37.3959, lng: 126.9520 },
    causes: [
      { label: "교통량", value: "높음" },
      { label: "최근 강수량", value: "많음" },
      { label: "사고 이력", value: "3건" },
    ],
  },
  {
    id: "seg2",
    risk: "mid",
    path: [{ lat: 37.3900, lng: 126.9500 }, { lat: 37.3862, lng: 126.9520 }],
    mid: { lat: 37.3881, lng: 126.9510 },
    causes: [
      { label: "교통량", value: "보통" },
      { label: "노후 도로", value: "8년 경과" },
      { label: "사고 이력", value: "1건" },
    ],
  },
  {
    id: "seg3",
    risk: "low",
    path: [{ lat: 37.3820, lng: 126.9350 }, { lat: 37.3822, lng: 126.9450 }],
    mid: { lat: 37.3821, lng: 126.9400 },
    causes: [
      { label: "교통량", value: "낮음" },
      { label: "사고 이력", value: "0건" },
    ],
  },
];

import { CircleDot, Construction, Signpost, AlertTriangle, Clock, Wrench, CheckCircle2 } from "lucide-react";

// 파손 유형 (Report/MainMap/MyReports/AiAnalysis 공통)
export const DAMAGE_TYPE_META = {
  pothole: { label: "포트홀", icon: CircleDot, description: "도로가 움푹 파인 상태" },
  crack: { label: "노면 균열", icon: Construction, description: "도로 표면에 균열이 발생한 상태" },
  sign: { label: "표지판 파손", icon: Signpost, description: "표지판이나 안전시설물이 파손된 상태" },
  manhole: { label: "맨홀/시설물", icon: AlertTriangle, description: "맨홀 및 도로시설물 이상" },
};

// 신고 건별 심각도 (도로 구간 위험도 예측인 ROAD_RISK_META와는 별개의 값)
export const SEVERITY_META = {
  low: {
    label: "낮음",
    color: "#059669", // emerald-600 (텍스트/뱃지용)
    dotColor: "#10b981", // emerald-500 (지도 마커 등 solid dot용)
    textClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-500",
  },
  mid: {
    label: "보통",
    color: "#d97706",
    dotColor: "#f59e0b",
    textClass: "text-amber-600",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-500",
  },
  high: {
    label: "높음",
    color: "#dc2626",
    dotColor: "#ef4444",
    textClass: "text-red-600",
    bgClass: "bg-red-50",
    borderClass: "border-red-500",
  },
};

// 신고 처리 상태
export const REPORT_STATUS_META = {
  received: { label: "접수됨", icon: Clock, color: "#2563eb", textClass: "text-blue-600" },
  progress: { label: "처리중", icon: Wrench, color: "#d97706", textClass: "text-amber-600" },
  done: { label: "처리완료", icon: CheckCircle2, color: "#059669", textClass: "text-emerald-600" },
};

// 도로 구간 위험도 예측 (MainMap 예측 레이어 전용, 신고 심각도 SEVERITY_META와는 별개)
export const ROAD_RISK_META = {
  low: { label: "LOW", color: "#10b981" },
  mid: { label: "MID", color: "#f59e0b" },
  high: { label: "HIGH", color: "#ef4444" },
};

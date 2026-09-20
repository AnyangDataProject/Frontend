import { CircleDot, Construction, Signpost, AlertTriangle, Clock, Wrench, CheckCircle2, XCircle } from "lucide-react";

// 파손 유형 (Report/MainMap/MyReports 공통)
// AI가 실제로 지원하는 4종(longitudinal_crack/transverse_crack/alligator_crack/pothole) 외에
// crack/sign/manhole은 과거에 신고된 데이터를 화면에 표시하기 위해 남겨둔 값
export const DAMAGE_TYPE_META = {
  longitudinal_crack: {
    label: "종방향 균열",
    icon: Construction,
    description: "도로 진행 방향과 나란한 균열",
    analysisDescription: "도로 진행 방향과 나란하게 균열이 발생한 상태입니다.",
  },
  transverse_crack: {
    label: "횡방향 균열",
    icon: Construction,
    description: "도로 진행 방향과 수직인 균열",
    analysisDescription: "도로 진행 방향과 수직으로 균열이 발생한 상태입니다.",
  },
  alligator_crack: {
    label: "거북등 균열",
    icon: Construction,
    description: "거북이 등딱지 모양의 균열",
    analysisDescription: "노면이 여러 갈래로 갈라져 거북등 형태를 띠는 파손입니다.",
  },
  pothole: {
    label: "포트홀",
    icon: CircleDot,
    description: "도로가 움푹 파인 상태",
    analysisDescription: "도로 표면이 국부적으로 파여 있는 형태의 파손입니다.",
  },
  crack: {
    label: "노면 균열",
    icon: Construction,
    description: "도로 표면에 균열이 발생한 상태",
    analysisDescription: "도로 표면에 균열이 발생한 상태입니다.",
  },
  sign: {
    label: "표지판 파손",
    icon: Signpost,
    description: "표지판이나 안전시설물이 파손된 상태",
    analysisDescription: "도로 안전시설물 또는 표지판이 파손된 상태입니다.",
  },
  manhole: {
    label: "맨홀/시설물",
    icon: AlertTriangle,
    description: "맨홀 및 도로시설물 이상",
    analysisDescription: "맨홀 및 도로 주변 시설물에 이상이 발생한 상태입니다.",
  },
};

// 파손 신고하기 폼에서 선택 가능한 유형 (AI가 실제로 인식하는 4종으로 한정)
export const REPORTABLE_DAMAGE_TYPES = ["longitudinal_crack", "transverse_crack", "alligator_crack", "pothole"];

// 신고 건별 위험도
export const SEVERITY_META = {
  low: {
    label: "낮음",
    description: "경미한 파손",
    analysisDescription: "현재 즉각적인 사고 위험은 낮은 상태입니다.",
    color: "#059669", // emerald-600 (텍스트/뱃지용)
    dotColor: "#10b981", // emerald-500 (지도 마커 등 solid dot용)
    textClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-500",
  },
  mid: {
    label: "보통",
    description: "통행에 불편이 있는 파손",
    analysisDescription: "통행 시 주의가 필요하며 정비가 권장됩니다.",
    color: "#d97706",
    dotColor: "#f59e0b",
    textClass: "text-amber-600",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-500",
  },
  high: {
    label: "높음",
    description: "사고 위험이 높은 파손",
    analysisDescription: "사고 위험이 높아 신속한 정비가 필요한 상태입니다.",
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
  rejected: { label: "반려", icon: XCircle, color: "#dc2626", textClass: "text-red-600" },
};

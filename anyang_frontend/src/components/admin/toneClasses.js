// 관리자 화면 전반에서 같은 tone(위험도/상태 등급)이 항상 같은 색으로
// 보이도록 하는 공용 매핑. Badge/StatCard 등 tone을 쓰는 컴포넌트는
// 각자 색을 정의하지 말고 이 파일을 참조한다.

export const TONE_CLASSES = {
  danger: 'bg-red-50 text-red-700',
  warning: 'bg-amber-50 text-amber-700',
  success: 'bg-emerald-50 text-emerald-700',
  info: 'bg-blue-50 text-blue-700',
  neutral: 'bg-slate-100 text-slate-600',
};

export const TONE_RING_CLASSES = {
  danger: 'ring-red-600/20',
  warning: 'ring-amber-600/20',
  success: 'ring-emerald-600/20',
  info: 'ring-blue-600/20',
  neutral: 'ring-slate-500/20',
};

export const TONE_DOT_CLASSES = {
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
};

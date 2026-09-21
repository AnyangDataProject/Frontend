import { Camera } from 'lucide-react';

/**
 * 시민이 업로드한 신고 사진 자리에 쓰는 목업 컴포넌트.
 * 실제 사진 업로드/스토리지 연동 전까지 사용하며, seed로 톤을 살짝 다르게 해 각기 다른 느낌을 준다.
 */
export default function PhotoPlaceholder({ seed = 0, label = '시민 제보 사진', className = '' }) {
  const hue = 210 + ((seed * 37) % 40);
  return (
    <div
      className={`flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg text-white ${className}`}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 45% 38%), hsl(${hue + 20} 40% 22%))` }}
    >
      <Camera size={28} strokeWidth={1.5} className="opacity-80" />
      <span className="text-xs font-medium opacity-80">{label} (mock)</span>
    </div>
  );
}

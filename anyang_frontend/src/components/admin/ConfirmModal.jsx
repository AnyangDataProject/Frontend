import { AlertTriangle, Info, X } from 'lucide-react';

const VARIANTS = {
  danger: {
    icon: AlertTriangle,
    iconClass: 'bg-red-50 text-red-600',
    buttonClass: 'bg-red-600 hover:bg-red-700',
  },
  default: {
    icon: Info,
    iconClass: 'bg-blue-50 text-blue-600',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
  },
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  tone = 'default',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const { icon: Icon, iconClass, buttonClass } = VARIANTS[tone];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-5 backdrop-blur-sm animate-[citizenModalFadeIn_0.2s_ease]"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-[420px] rounded-xl bg-white px-6 pb-6 pt-9 text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-[citizenModalScaleUp_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          aria-label="닫기"
          className="absolute right-4 top-4 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border-none bg-slate-50 text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-50"
        >
          <X size={16} />
        </button>

        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${iconClass}`}>
          <Icon size={26} />
        </div>

        {title && <h2 className="m-0 mb-2 break-keep text-base font-semibold text-slate-900">{title}</h2>}
        {description && (
          <p className="m-0 whitespace-pre-line break-keep text-sm leading-relaxed text-slate-500">{description}</p>
        )}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-11 flex-1 rounded-lg border-0 bg-slate-100 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`h-11 flex-1 rounded-lg border-0 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${buttonClass}`}
          >
            {loading ? '처리 중...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

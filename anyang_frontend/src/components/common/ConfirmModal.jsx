import { AlertTriangle, Info } from 'lucide-react';
import Modal from './Modal';

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
    <Modal open={open} onClose={onCancel} closeDisabled={loading} className="px-6 pt-9 pb-6 text-center">
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
    </Modal>
  );
}

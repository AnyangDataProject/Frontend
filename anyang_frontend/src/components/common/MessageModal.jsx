import { AlertTriangle, Info } from "lucide-react";
import Modal from "./Modal";

const VARIANTS = {
  error: {
    icon: AlertTriangle,
    iconClass: "bg-red-50 text-red-600",
    buttonClass: "bg-red-600 hover:bg-red-700",
  },
  info: {
    icon: Info,
    iconClass: "bg-blue-50 text-blue-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
  },
};

export default function MessageModal({
  open,
  onClose,
  variant = "info",
  title,
  message,
  confirmLabel = "확인",
  zIndexClass,
}) {
  const { icon: Icon, iconClass, buttonClass } = VARIANTS[variant];

  return (
    <Modal open={open} onClose={onClose} zIndexClass={zIndexClass} className="px-6 pt-9 pb-6 text-center">
      <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${iconClass}`}>
        <Icon size={26} />
      </div>

      {title && <h2 className="m-0 mb-2 text-base font-semibold text-slate-900">{title}</h2>}

      <p className="m-0 text-sm leading-relaxed text-slate-500 whitespace-pre-line">{message}</p>

      <button
        type="button"
        onClick={onClose}
        className={`w-full h-11 mt-6 rounded-lg border-0 text-sm font-semibold text-white cursor-pointer transition-colors ${buttonClass}`}
      >
        {confirmLabel}
      </button>
    </Modal>
  );
}

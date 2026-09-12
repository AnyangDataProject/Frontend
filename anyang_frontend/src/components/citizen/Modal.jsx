import { X } from "lucide-react";

export default function Modal({ open, onClose, children, className = "" }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5 animate-[citizenModalFadeIn_0.2s_ease] max-[480px]:p-0 max-[480px]:items-end"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[420px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-[citizenModalScaleUp_0.25s_cubic-bezier(0.16,1,0.3,1)] max-[480px]:max-w-full max-[480px]:rounded-b-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 border-none bg-slate-50 w-[30px] h-[30px] rounded-full text-slate-500 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-slate-200 hover:text-slate-900"
          onClick={onClose}
          aria-label="닫기"
        >
          <X size={16} />
        </button>

        {children}
      </div>
    </div>
  );
}

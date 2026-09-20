import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// 열려 있는 모달들을 연 순서대로 쌓아 둔다. 상세 모달 위에 확인/오류 모달이 겹쳐 뜨는 경우
// Esc 한 번에 둘 다 닫히지 않도록, 맨 위(가장 나중에 열린) 모달만 Esc에 반응한다.
const openModalStack = [];

function useEscapeToClose(open, onClose, closeDisabled) {
  const latest = useRef({ onClose, closeDisabled });

  useEffect(() => {
    latest.current = { onClose, closeDisabled };
  });

  useEffect(() => {
    if (!open) return undefined;

    const token = {};
    openModalStack.push(token);

    const handleKeyDown = (event) => {
      // 한글 조합 중 Esc(조합 취소)나 다른 모달 위에 가려진 경우는 무시
      if (event.key !== "Escape" || event.isComposing) return;
      if (openModalStack[openModalStack.length - 1] !== token) return;
      // 편집/저장 중이라 닫기가 막힌 모달은 Esc로도 닫히지 않고, 아래 모달로 이벤트가 넘어가지도 않는다
      if (!latest.current.closeDisabled) latest.current.onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      openModalStack.splice(openModalStack.indexOf(token), 1);
    };
  }, [open]);
}

export default function Modal({ open, onClose, children, className = "", closeDisabled = false, zIndexClass = "z-50", widthClass = "max-w-[420px]" }) {
  useEscapeToClose(open, onClose, closeDisabled);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (!closeDisabled) onClose();
  };

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5 animate-[modalFadeIn_0.2s_ease] max-[480px]:p-0 max-[480px]:items-end`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full ${widthClass} bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-[modalScaleUp_0.25s_cubic-bezier(0.16,1,0.3,1)] max-[480px]:max-w-full max-[480px]:rounded-b-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 border-none bg-slate-50 w-[30px] h-[30px] rounded-full text-slate-500 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-50"
          onClick={onClose}
          disabled={closeDisabled}
          aria-label="닫기"
        >
          <X size={16} />
        </button>

        {children}
      </div>
    </div>
  );
}

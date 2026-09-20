import { useCallback, useRef, useState } from "react";

export function useMessageModal() {
  const [modal, setModal] = useState(null);
  // onConfirm 같은 부수효과를 setState 업데이트 함수 안에서 실행하면 StrictMode 등에서
  // 두 번 호출될 수 있어서, 현재 모달을 ref로 들고 있다가 업데이트 함수 밖에서 한 번만 실행한다.
  const modalRef = useRef(null);

  const open = useCallback((next) => {
    modalRef.current = next;
    setModal(next);
  }, []);

  const showError = useCallback((message) => open({ variant: "error", message }), [open]);
  const showInfo = useCallback(
    (message, options) => open({ variant: "info", message, ...options }),
    [open]
  );

  const close = useCallback(() => {
    const current = modalRef.current;
    modalRef.current = null;
    setModal(null);
    current?.onConfirm?.();
  }, []);

  return { modal, showError, showInfo, close };
}

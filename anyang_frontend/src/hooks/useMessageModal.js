import { useCallback, useState } from "react";

export function useMessageModal() {
  const [modal, setModal] = useState(null);

  const showError = useCallback((message) => setModal({ variant: "error", message }), []);
  const showInfo = useCallback(
    (message, options) => setModal({ variant: "info", message, ...options }),
    []
  );

  const close = useCallback(() => {
    setModal((current) => {
      current?.onConfirm?.();
      return null;
    });
  }, []);

  return { modal, showError, showInfo, close };
}

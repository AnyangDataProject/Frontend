import { useEffect, useRef, useState } from "react";

export function useFileAttachments({ max, createPreview = false } = {}) {
  const [items, setItems] = useState([]);
  const itemsRef = useRef(items);

  const addFiles = (fileList, { onLimitExceeded } = {}) => {
    const files = Array.from(fileList || []);
    const remaining = max != null ? max - itemsRef.current.length : files.length;
    const accepted = files.slice(0, remaining);

    const newItems = accepted.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: createPreview ? URL.createObjectURL(file) : undefined,
    }));

    setItems((prev) => [...prev, ...newItems]);

    if (max != null && files.length > remaining) {
      onLimitExceeded?.();
    }
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clear = () => {
    itemsRef.current.forEach((item) => item.preview && URL.revokeObjectURL(item.preview));
    setItems([]);
  };

  // 최신 items를 렌더 이후에 ref로 동기화 (언마운트 시 정리 콜백에서 참조)
  useEffect(() => {
    itemsRef.current = items;
  });

  // 언마운트 시 남아있는 미리보기 URL을 정리
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => item.preview && URL.revokeObjectURL(item.preview));
    };
  }, []);

  return { items, addFiles, removeItem, clear };
}

import { useEffect, useRef, useState } from "react";

export function useFileAttachments({ max, createPreview = false } = {}) {
  const [items, setItems] = useState([]);
  // 남은 슬롯 계산이 렌더를 기다리지 않도록 ref를 최신 목록의 기준으로 두고, 바꿀 때마다 즉시 갱신한다
  // (렌더 뒤에 동기화하면 연속으로 들어온 onChange가 낡은 길이를 읽어 최대 개수를 넘길 수 있음)
  const itemsRef = useRef(items);

  const commit = (next) => {
    itemsRef.current = next;
    setItems(next);
  };

  const addFiles = (fileList, { onLimitExceeded } = {}) => {
    const files = Array.from(fileList || []);
    const remaining = max != null ? max - itemsRef.current.length : files.length;
    const accepted = files.slice(0, remaining);

    const newItems = accepted.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: createPreview ? URL.createObjectURL(file) : undefined,
    }));

    commit([...itemsRef.current, ...newItems]);

    if (max != null && files.length > remaining) {
      onLimitExceeded?.();
    }
  };

  const removeItem = (id) => {
    const target = itemsRef.current.find((item) => item.id === id);
    if (target?.preview) URL.revokeObjectURL(target.preview);
    commit(itemsRef.current.filter((item) => item.id !== id));
  };

  const clear = () => {
    itemsRef.current.forEach((item) => item.preview && URL.revokeObjectURL(item.preview));
    commit([]);
  };

  // 언마운트 시 남아있는 미리보기 URL을 정리
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => item.preview && URL.revokeObjectURL(item.preview));
    };
  }, []);

  return { items, addFiles, removeItem, clear };
}

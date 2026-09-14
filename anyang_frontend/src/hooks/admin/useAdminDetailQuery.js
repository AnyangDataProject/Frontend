import { useEffect, useState } from "react";

// 관리자 상세 페이지 공통 fetch-on-mount 패턴 (id 기준 단건 조회 + notFound 처리).
// 경합 상태(응답이 늦게 도착해 이후 상태를 덮어쓰는 문제) 방지를 위해
// active 플래그로 가드한다.
export function useAdminDetailQuery(fetchFn, id, { onLoaded } = {}) {
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    fetchFn(id).then((result) => {
      if (!active) return;
      if (!result) {
        setNotFound(true);
        return;
      }
      setNotFound(false);
      setData(result);
      onLoaded?.(result);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { data, setData, notFound };
}

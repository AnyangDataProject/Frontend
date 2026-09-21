import { useEffect, useState } from "react";

// 관리자 상세 페이지 공통 fetch-on-mount 패턴 (id 기준 단건 조회 + notFound 처리).
// 경합 상태(응답이 늦게 도착해 이후 상태를 덮어쓰는 문제) 방지를 위해
// active 플래그로 가드한다.
export function useAdminDetailQuery(fetchFn, id, { onLoaded } = {}) {
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchFn(id)
      .then((result) => {
        if (!active) return;
        if (!result) {
          setNotFound(true);
          return;
        }
        setNotFound(false);
        setError(null);
        setData(result);
        onLoaded?.(result);
      })
      .catch((err) => {
        // 응답이 없어서(진짜 존재하지 않는 리소스) 아니라 네트워크/서버 오류로 실패한
        // 경우를 notFound와 구분해서 "존재하지 않음"으로 오표시하지 않도록 한다.
        if (active) setError(err);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { data, setData, notFound, error };
}

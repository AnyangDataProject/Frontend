import { useEffect, useState } from "react";

// 관리자 목록 페이지 공통 fetch-on-mount 패턴.
// 컴포넌트 언마운트/재요청 이후 도착하는 응답이 최신 상태를 덮어쓰지 않도록
// active 플래그로 경합 상태를 방지한다.
export function useAdminListQuery(fetchFn) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    fetchFn().then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, setData, loading: data === null };
}

// 목록을 검색어/상태 등 여러 조건으로 필터링하는 공통 패턴.
// 관리자 목데이터는 규모가 작아 매 렌더마다 다시 필터링해도 비용이 크지 않으므로
// 메모이제이션 없이 단순하게 유지한다.
export function useListFilter(items, predicate) {
  if (!items) return [];
  return items.filter(predicate);
}

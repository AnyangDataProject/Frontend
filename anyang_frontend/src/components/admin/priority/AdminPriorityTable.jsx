import { ChevronRight } from 'lucide-react';
import Badge from '../Badge';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import { TONE_DOT_CLASSES } from '../toneClasses';

const PRIORITY_GRADE_META = {
  최우선: { label: '최우선', tone: 'danger' },
  우선: { label: '우선', tone: 'warning' },
  관심: { label: '관심', tone: 'info' },
  일반: { label: '일반', tone: 'success' },
};

function formatNumber(value) {
  return value == null ? '-' : Number(value).toFixed(2);
}

export default function AdminPriorityTable({ loading, roads, onRowClick }) {
  if (loading) return <LoadingState />;
  if (roads.length === 0) return <EmptyState title="조건에 맞는 구간이 없습니다" />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
            <th className="w-14 py-3 pl-5 font-medium">순위</th>
            <th className="py-3 font-medium">도로명</th>
            <th className="w-40 py-3 font-medium">우선순위 점수</th>
            <th className="w-24 py-3 font-medium">등급</th>
            <th className="w-24 py-3 font-medium">파손 건수</th>
            <th className="w-28 py-3 font-medium">포트홀 비율</th>
            <th className="w-28 py-3 pr-5 font-medium">평균 속도</th>
          </tr>
        </thead>
        <tbody>
          {roads.map((road) => {
            const grade = PRIORITY_GRADE_META[road.priorityGrade] ?? PRIORITY_GRADE_META.일반;
            return (
              <tr
                key={road.cluster}
                onClick={() => onRowClick(road.cluster)}
                className="cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50"
              >
                <td className="py-3 pl-5 font-semibold text-slate-400">{road.priorityRank}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1 font-medium text-slate-900">
                    {road.roadAddress || '도로명 정보 없음'}
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                      <div
                        className={`h-1.5 rounded-full ${TONE_DOT_CLASSES[grade.tone]}`}
                        style={{ width: `${Math.min(road.currentPriorityScore, 100)}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-sm font-semibold text-slate-700">
                      {formatNumber(road.currentPriorityScore)}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <Badge tone={grade.tone} dot>
                    {grade.label}
                  </Badge>
                </td>
                <td className="py-3 text-slate-600">{road.damageCount ?? '-'}건</td>
                <td className="py-3 text-slate-600">{formatNumber(road.potholeRatio)}%</td>
                <td className="py-3 pr-5 text-slate-600">{formatNumber(road.avgSpeed)} km/h</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
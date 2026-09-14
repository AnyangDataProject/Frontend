import { ChevronRight } from 'lucide-react';
import Badge from '../Badge';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import { TONE_DOT_CLASSES } from '../toneClasses';
import { RISK_LEVEL_META, SEVERITY_META, TRAFFIC_LEVEL_META } from '../../../mocks/admin/constants';

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
            <th className="w-40 py-3 font-medium">종합 위험도</th>
            <th className="w-24 py-3 font-medium">상태</th>
            <th className="w-24 py-3 font-medium">현재 파손</th>
            <th className="w-28 py-3 font-medium">발생 예측</th>
            <th className="w-28 py-3 font-medium">평균 교통량</th>
            <th className="w-20 py-3 font-medium">사고이력</th>
            <th className="w-20 py-3 pr-5 font-medium">시민신고</th>
          </tr>
        </thead>
        <tbody>
          {roads.map((road, i) => (
            <tr
              key={road.id}
              onClick={() => onRowClick(road.id)}
              className="cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50"
            >
              <td className="py-3 pl-5 font-semibold text-slate-400">{i + 1}</td>
              <td className="py-3">
                <div className="flex items-center gap-1 font-medium text-slate-900">
                  {road.name}
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
                <div className="text-xs text-slate-400">{road.district}</div>
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 rounded-full ${TONE_DOT_CLASSES[RISK_LEVEL_META[road.riskLevel].tone]}`}
                      style={{ width: `${road.riskScore}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-sm font-semibold text-slate-700">
                    {road.riskScore}
                  </span>
                </div>
              </td>
              <td className="py-3">
                <Badge tone={RISK_LEVEL_META[road.riskLevel].tone} dot>
                  {RISK_LEVEL_META[road.riskLevel].label}
                </Badge>
              </td>
              <td className="py-3">
                <Badge tone={SEVERITY_META[road.currentDamageLevel].tone}>
                  {SEVERITY_META[road.currentDamageLevel].label}
                </Badge>
              </td>
              <td className="py-3 font-medium text-slate-700">{road.damageForecastProb}%</td>
              <td className="py-3 text-slate-600">
                {TRAFFIC_LEVEL_META[road.trafficLevel].label}
                <span className="ml-1 text-xs text-slate-400">
                  ({road.avgTrafficVolume.toLocaleString()})
                </span>
              </td>
              <td className="py-3 text-slate-600">{road.accidentCount}건</td>
              <td className="py-3 pr-5 text-slate-600">{road.citizenReportCount}건</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

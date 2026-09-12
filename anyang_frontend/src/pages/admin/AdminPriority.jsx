import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import Badge from '../../components/admin/Badge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import { fetchPriorityRoads } from '../../mocks/admin/api';
import { RISK_LEVEL_META, SEVERITY_META, TRAFFIC_LEVEL_META } from '../../mocks/admin/constants';

const RISK_TABS = [
  { key: 'all', label: '전체' },
  { key: 'high', label: 'HIGH' },
  { key: 'mid', label: 'MID' },
  { key: 'low', label: 'LOW' },
];

export default function AdminPriority() {
  const navigate = useNavigate();
  const [roads, setRoads] = useState(null);
  const [riskFilter, setRiskFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    let active = true;
    fetchPriorityRoads().then((data) => {
      if (active) setRoads(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!roads) return [];
    const kw = keyword.trim().toLowerCase();
    return roads.filter((road) => {
      const matchesRisk = riskFilter === 'all' || road.riskLevel === riskFilter;
      const matchesKeyword = !kw || road.name.toLowerCase().includes(kw) || road.district.includes(kw);
      return matchesRisk && matchesKeyword;
    });
  }, [roads, riskFilter, keyword]);

  return (
    <AdminLayout
      title="점검 우선순위"
      description="종합 위험도 점수가 높은 구간부터 우선적으로 점검하세요."
    >
      <Card
        bodyClassName="p-0"
        title={roads ? `총 ${roads.length}개 구간` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
              <Search size={14} className="text-slate-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="도로명, 구 검색"
                className="w-40 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex overflow-hidden rounded-lg border border-slate-200">
              {RISK_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setRiskFilter(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    riskFilter === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {!roads ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState title="조건에 맞는 구간이 없습니다" />
        ) : (
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
                {filtered.map((road, i) => (
                  <tr
                    key={road.id}
                    onClick={() => navigate(`/admin/roads/${road.id}`)}
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
                            className={`h-1.5 rounded-full ${
                              road.riskLevel === 'high'
                                ? 'bg-red-500'
                                : road.riskLevel === 'mid'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                            }`}
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
        )}
      </Card>
    </AdminLayout>
  );
}

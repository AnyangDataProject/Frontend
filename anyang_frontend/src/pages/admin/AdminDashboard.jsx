import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileWarning, Clock3, TriangleAlert, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import StatCard from '../../components/admin/StatCard';
import KakaoMap from '../../components/admin/KakaoMap';
import Badge from '../../components/admin/Badge';
import LoadingState from '../../components/admin/LoadingState';
import { fetchDashboardSummary } from '../../mocks/admin/api';
import { RISK_LEVEL_META } from '../../mocks/admin/constants';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [selectedRoadId, setSelectedRoadId] = useState(null);

  useEffect(() => {
    let active = true;
    fetchDashboardSummary().then((data) => {
      if (active) setSummary(data);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!summary) {
    return (
      <AdminLayout title="대시보드" description="안양시 도로파손 신고 및 위험도 현황을 확인하세요.">
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="대시보드" description="안양시 도로파손 신고 및 위험도 현황을 확인하세요.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileWarning} label="전체 신고 건수" value={summary.totalReports} suffix="건" tone="info" />
        <StatCard
          icon={Clock3}
          label="미처리 건수"
          value={summary.unresolvedReports}
          suffix="건"
          tone="warning"
          hint="접수 · 담당부서확인 · 현장점검"
        />
        <StatCard
          icon={TriangleAlert}
          label="고위험 구간 수"
          value={summary.highRiskRoadCount}
          suffix="곳"
          tone="danger"
        />
        <StatCard icon={CheckCircle2} label="처리율" value={summary.resolutionRate} suffix="%" tone="success" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="위험 구간 지도"
          description="파손 위험도에 따라 구간을 빨강(위험)·주황(점검필요)·초록(안전)으로 표시합니다."
        >
          <KakaoMap
            points={summary.mapPoints}
            selectedId={selectedRoadId}
            onSelectPoint={(p) => navigate(`/admin/roads/${p.id}`)}
            height={380}
            level={8}
          />
        </Card>

        <Card
          title="오늘의 우선 점검"
          description="종합 위험도 점수가 높은 구간부터 확인하세요."
          actions={
            <button
              onClick={() => navigate('/admin/priority')}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              전체 보기 <ChevronRight size={14} />
            </button>
          }
        >
          <ul className="flex flex-col divide-y divide-slate-100">
            {summary.topPriorityRoads.map((road, i) => (
              <li key={road.id}>
                <button
                  onClick={() => navigate(`/admin/roads/${road.id}`)}
                  onMouseEnter={() => setSelectedRoadId(road.id)}
                  className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-slate-50"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {i === 0 ? <Trophy size={14} /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">{road.name}</span>
                    <span className="block text-xs text-slate-400">{road.district}</span>
                  </span>
                  <Badge tone={RISK_LEVEL_META[road.riskLevel].tone} dot>
                    {RISK_LEVEL_META[road.riskLevel].label}
                  </Badge>
                  <span className="w-9 shrink-0 text-right text-sm font-semibold text-slate-700">
                    {road.riskScore}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AdminLayout>
  );
}

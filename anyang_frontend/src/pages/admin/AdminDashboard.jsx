import { useNavigate } from 'react-router-dom';
import { FileWarning, Clock3, TriangleAlert, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import StatCard from '../../components/admin/StatCard';
import KakaoMap from '../../components/admin/KakaoMap';
import Badge from '../../components/admin/Badge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import { useAdminListQuery } from '../../hooks/admin/useAdminListQuery';
import { fetchDashboardSummary } from '../../mocks/admin/api';
import { fetchPriorityClusters } from '../../api/inspectionClusters';

const PRIORITY_GRADE_META = {
  최우선: { label: '최우선', tone: 'danger' },
  우선: { label: '우선', tone: 'warning' },
  관심: { label: '관심', tone: 'info' },
  일반: { label: '일반', tone: 'success' },
};

function formatScore(value) {
  return value == null ? '-' : Number(value).toFixed(2);
}

// 전 구간이 "경기도 안양시"라 반복돼서, 좁은 목록에서는 구/도로명만 보여준다.
function shortenRoadAddress(address) {
  return address?.replace(/^경기도\s*안양시\s*/, '') ?? '';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: summary } = useAdminListQuery(fetchDashboardSummary);
  const { data: priorityClusters, error: priorityError } = useAdminListQuery(fetchPriorityClusters);
  const topPriorityClusters = priorityClusters?.slice(0, 5) ?? [];

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
          {priorityError ? (
            <p className="py-6 text-center text-sm text-red-500">
              점검 우선순위를 불러오지 못했습니다. ({priorityError.message})
            </p>
          ) : !priorityClusters ? (
            <LoadingState />
          ) : topPriorityClusters.length === 0 ? (
            <EmptyState title="점검할 구간이 없습니다" />
          ) : (
            <ul className="flex flex-col divide-y divide-slate-100">
              {topPriorityClusters.map((cluster, i) => {
                const grade = PRIORITY_GRADE_META[cluster.priorityGrade] ?? PRIORITY_GRADE_META.일반;
                return (
                  <li key={cluster.cluster}>
                    <button
                      onClick={() => navigate(`/admin/roads/${cluster.cluster}`)}
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
                        <span className="block truncate text-sm font-medium text-slate-900">
                          {cluster.roadAddress ? shortenRoadAddress(cluster.roadAddress) : '도로명 정보 없음'}
                        </span>
                      </span>
                      <Badge tone={grade.tone} dot>
                        {grade.label}
                      </Badge>
                      <span className="w-9 shrink-0 text-right text-sm font-semibold text-slate-700">
                        {formatScore(cluster.currentPriorityScore)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}

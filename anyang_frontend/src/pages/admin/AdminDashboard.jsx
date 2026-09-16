import { useMemo, useState } from 'react';
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
import { fetchAllReports } from '../../api/report';
import { fetchPriorityClusters } from '../../api/inspectionClusters';
import { PRIORITY_GRADE_META } from '../../mocks/admin/constants';
import { STATUS_TO_UI } from '../../api/enumMapping';

function formatScore(value) {
  return value == null ? '-' : Number(value).toFixed(2);
}

// 전 구간이 "경기도 안양시"라 반복돼서, 좁은 목록에서는 구/도로명만 보여준다.
function shortenRoadAddress(address) {
  return address?.replace(/^경기도\s*안양시\s*/, '') ?? '';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: reports, error: reportsError } = useAdminListQuery(fetchAllReports);
  const { data: priorityClusters, error: priorityError } = useAdminListQuery(fetchPriorityClusters);
  const topPriorityClusters = priorityClusters?.slice(0, 5) ?? [];
  const [selectedClusterId, setSelectedClusterId] = useState(null);

  const reportStats = useMemo(() => {
    if (!reports) return null;
    const doneCount = reports.filter((r) => STATUS_TO_UI[r.status] === 'done').length;
    return {
      total: reports.length,
      unresolved: reports.length - doneCount,
      resolutionRate: reports.length === 0 ? 0 : Math.round((doneCount / reports.length) * 100),
    };
  }, [reports]);

  const highRiskRoadCount = priorityClusters?.filter((c) => c.priorityGrade === '최우선').length;

  const mapPoints = useMemo(() => {
    if (!priorityClusters) return [];
    return priorityClusters.map((c) => ({
      id: c.cluster,
      lat: c.latitude,
      lng: c.longitude,
      label: shortenRoadAddress(c.roadAddress),
      tone: (PRIORITY_GRADE_META[c.priorityGrade] ?? PRIORITY_GRADE_META.일반).tone,
    }));
  }, [priorityClusters]);

  return (
    <AdminLayout title="대시보드" description="안양시 도로파손 신고 및 위험도 현황을 확인하세요.">
      {(reportsError || priorityError) && (
        <p className="mb-4 text-sm text-red-500">
          {reportsError && `신고 데이터를 불러오지 못했습니다. (${reportsError.message}) `}
          {priorityError && `점검 우선순위 데이터를 불러오지 못했습니다. (${priorityError.message})`}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FileWarning}
          label="전체 신고 건수"
          value={reportStats ? reportStats.total : '-'}
          suffix="건"
          tone="info"
        />
        <StatCard
          icon={Clock3}
          label="미처리 건수"
          value={reportStats ? reportStats.unresolved : '-'}
          suffix="건"
          tone="warning"
          hint="접수 · 처리중"
        />
        <StatCard
          icon={TriangleAlert}
          label="고위험 구간 수"
          value={highRiskRoadCount ?? '-'}
          suffix="곳"
          tone="danger"
          hint="최우선 등급 구간"
        />
        <StatCard
          icon={CheckCircle2}
          label="처리율"
          value={reportStats ? reportStats.resolutionRate : '-'}
          suffix="%"
          tone="success"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="위험 구간 지도"
          description="점검 우선순위 등급이 높은 구간부터 지도에 표시합니다."
        >
          {priorityError ? (
            <p className="py-6 text-center text-sm text-red-500">
              지도 데이터를 불러오지 못했습니다. ({priorityError.message})
            </p>
          ) : priorityClusters ? (
            <KakaoMap
              points={mapPoints}
              selectedId={selectedClusterId}
              onSelectPoint={(p) => navigate(`/admin/roads/${p.id}`)}
              height={380}
              level={8}
            />
          ) : (
            <LoadingState />
          )}
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
                      onMouseEnter={() => setSelectedClusterId(cluster.cluster)}
                      onMouseLeave={() => setSelectedClusterId(null)}
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

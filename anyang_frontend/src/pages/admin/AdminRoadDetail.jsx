import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Gauge, TrafficCone, FileWarning, Route, Wrench } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import Badge from '../../components/admin/Badge';
import StatRow from '../../components/admin/StatRow';
import ProgressBarRow from '../../components/admin/ProgressBarRow';
import KakaoMap from '../../components/admin/KakaoMap';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import { fetchClusterDetail, fetchMonthlyDamage } from '../../api/inspectionClusters';
import { PRIORITY_GRADE_META } from '../../mocks/admin/constants';
import { formatDecimal } from '../../utils/number';
import { clusterToMapPoint } from '../../utils/clusterMapPoint';

function formatInteger(value) {
  return value == null ? '-' : Number(value).toLocaleString();
}

export default function AdminRoadDetail() {
  const { id: cluster } = useParams();
  const navigate = useNavigate();

  const [road, setRoad] = useState(null);
  const [monthlyDamage, setMonthlyDamage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!cluster) return;
    let active = true;

    fetchClusterDetail(cluster)
      .then((data) => {
        if (active) setRoad(data);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    fetchMonthlyDamage(cluster, new Date().getFullYear())
      .then((data) => {
        if (active) setMonthlyDamage(data);
      })
      .catch(() => {
        if (active) setMonthlyDamage([]);
      });

    return () => {
      active = false;
    };
  }, [cluster]);

  const mapPoints = useMemo(() => {
    if (!road) return [];
    return [clusterToMapPoint(road)];
  }, [road]);

  if (notFound) {
    return (
      <AdminLayout title="도로 상세 분석">
        <Card>
          <EmptyState title="존재하지 않는 구간입니다" />
        </Card>
      </AdminLayout>
    );
  }

  if (loading || !road) {
    return (
      <AdminLayout title="도로 상세 분석">
        <LoadingState />
      </AdminLayout>
    );
  }

  const grade = PRIORITY_GRADE_META[road.priorityGrade] ?? PRIORITY_GRADE_META.일반;
  const maxMonthlyCount = monthlyDamage?.length
    ? Math.max(...monthlyDamage.map((m) => m.count), 1)
    : 1;

  return (
    <AdminLayout>
      <button
        onClick={() => navigate('/admin/priority')}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} /> 점검 우선순위로 돌아가기
      </button>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">{road.roadAddress || '도로명 정보 없음'}</h1>
          <Badge tone={grade.tone} dot>
            {grade.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          점검 우선순위 점수
          <span className="text-2xl font-bold text-slate-900">{formatDecimal(road.currentPriorityScore)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="구간 위치">
          <KakaoMap points={mapPoints} selectedId={road.cluster} height={320} level={4} />
        </Card>

        <Card title="현재 상태 요약">
          <dl className="flex h-full flex-col justify-between gap-4">
            <StatRow icon={Route} label="분석 구간 수">
              {formatInteger(road.linkCount)}개
            </StatRow>
            <StatRow icon={FileWarning} label="시민 신고 건수">
              {formatInteger(road.reportCount)}건
            </StatRow>
            <StatRow icon={Wrench} label="확인된 도로 파손">
              {formatInteger(road.damageCount)}건
            </StatRow>
            <StatRow label="포트홀 비율">{formatDecimal(road.potholeRatio)}%</StatRow>
            <StatRow label="전체 순위">{road.priorityRank}위</StatRow>
          </dl>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="평균 속도">
          <p className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <Gauge size={18} className="text-blue-500" />
            {formatDecimal(road.avgSpeed)}
            <span className="text-sm font-normal text-slate-400">km/h</span>
          </p>
        </Card>

        <Card title="평균 통행 시간">
          <p className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            {formatDecimal(road.avgTravelTime)}
            <span className="text-sm font-normal text-slate-400">초</span>
          </p>
        </Card>

        <Card title="혼잡도">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <TrafficCone size={18} className="text-blue-500" />
            정체 구간 비율 {formatDecimal(road.congestionRatio)}%
          </div>
          <p className="mt-1 text-xs text-slate-400">
            지체·정체 구간 비율 {formatDecimal(road.delayCongestionRatio)}% · 교통정보 확보율{' '}
            {formatDecimal(road.trafficDataCoverage)}%
          </p>
        </Card>
      </div>

      <Card className="mt-4" title="점검 우선순위 산정 근거" description="파손 상태와 교통 부담을 종합하여 산정했습니다.">
        <div className="flex flex-col gap-3">
          <ProgressBarRow
            label="파손 심각도"
            percent={Math.min(Math.max(road.damageScore || 0, 0), 50) * 2}
            barColorClass="bg-red-500"
          >
            {formatDecimal(road.damageScore)}
          </ProgressBarRow>

          <ProgressBarRow label="교통 부담도" percent={(Math.min(Math.max(road.trafficScore || 0, 0), 30) / 30) * 100}>
            {formatDecimal(road.trafficScore)}
          </ProgressBarRow>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="text-slate-500">최종 점검 우선순위 점수</span>
          <strong className="text-lg text-slate-900">
            {formatDecimal(road.currentPriorityScore)} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </strong>
        </div>
      </Card>

      <Card
        className="mt-4"
        title="월별 도로 파손 현황"
        description="해당 분석 구간 반경 150m 이내 시민 신고 기준"
      >
        {!monthlyDamage ? (
          <LoadingState />
        ) : monthlyDamage.length === 0 ? (
          <EmptyState title="월별 파손 이력이 없습니다" />
        ) : (
          <div className="flex flex-col gap-2">
            {monthlyDamage.map((item) => (
              <ProgressBarRow
                key={item.month}
                label={`${item.month}월`}
                percent={(item.count / maxMonthlyCount) * 100}
                labelWidthClass="w-10"
                valueWidthClass="w-10"
              >
                {item.count}건
              </ProgressBarRow>
            ))}
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
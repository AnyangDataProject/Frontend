import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Car, Gauge, TrafficCone, FileWarning, Wrench, TrendingUp } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import Badge from '../../components/admin/Badge';
import MockMap from '../../components/admin/MockMap';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import { fetchRoadById } from '../../mocks/admin/api';
import {
  CAUSE_FACTOR_LABEL,
  CONGESTION_META,
  RISK_LEVEL_META,
  SEVERITY_META,
  TRAFFIC_LEVEL_META,
} from '../../mocks/admin/constants';

const CAUSE_BAR_COLOR = {
  traffic: 'bg-blue-500',
  rainfall: 'bg-sky-500',
  temperature: 'bg-orange-500',
  accidents: 'bg-red-500',
  other: 'bg-slate-400',
};

export default function AdminRoadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [road, setRoad] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    fetchRoadById(id).then((data) => {
      if (!active) return;
      if (!data) setNotFound(true);
      else setRoad(data);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (notFound) {
    return (
      <AdminLayout title="도로 상세 분석">
        <Card>
          <EmptyState title="존재하지 않는 구간입니다" />
        </Card>
      </AdminLayout>
    );
  }

  if (!road || road.id !== id) {
    return (
      <AdminLayout title="도로 상세 분석">
        <LoadingState />
      </AdminLayout>
    );
  }

  const maxYearlyCount = Math.max(...road.yearlyDamage.map((y) => y.count), 1);

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
          <h1 className="text-xl font-semibold text-slate-900">{road.name}</h1>
          <span className="text-sm text-slate-400">{road.district}</span>
          <Badge tone={RISK_LEVEL_META[road.riskLevel].tone} dot>
            {RISK_LEVEL_META[road.riskLevel].label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          종합 위험도 점수
          <span className="text-2xl font-bold text-slate-900">{road.riskScore}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="구간 위치">
          <MockMap
            points={[
              {
                id: road.id,
                lat: road.coordinate.lat,
                lng: road.coordinate.lng,
                label: road.name,
                tone: RISK_LEVEL_META[road.riskLevel].tone,
              },
            ]}
            selectedId={road.id}
            height={320}
          />
        </Card>

        <Card title="현재 상태 요약">
          <dl className="flex h-full flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1.5 text-sm text-slate-500">
                <FileWarning size={15} /> 최근 신고 건수
              </dt>
              <dd className="text-sm font-semibold text-slate-900">{road.recentReportCount}건</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1.5 text-sm text-slate-500">
                <Wrench size={15} /> 현재 파손 건수
              </dt>
              <dd className="text-sm font-semibold text-slate-900">{road.currentDamageCount}건</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-slate-500">파손 심각도</dt>
              <dd>
                <Badge tone={SEVERITY_META[road.currentDamageLevel].tone}>
                  {SEVERITY_META[road.currentDamageLevel].label}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1.5 text-sm text-slate-500">
                <TrendingUp size={15} /> 파손 발생 예측 확률
              </dt>
              <dd className="text-sm font-semibold text-slate-900">{road.damageForecastProb}%</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="평균 교통량">
          <p className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <Car size={18} className="text-blue-500" />
            {road.avgTrafficVolume.toLocaleString()}
            <span className="text-sm font-normal text-slate-400">대/일</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">교통량 수준: {TRAFFIC_LEVEL_META[road.trafficLevel].label}</p>
        </Card>
        <Card title="평균 속도">
          <p className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <Gauge size={18} className="text-blue-500" />
            {road.avgSpeed}
            <span className="text-sm font-normal text-slate-400">km/h</span>
          </p>
        </Card>
        <Card title="혼잡도">
          <div className="flex items-center gap-2">
            <TrafficCone size={18} className="text-blue-500" />
            <Badge tone={CONGESTION_META[road.congestion].tone}>{CONGESTION_META[road.congestion].label}</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">사고 이력 {road.accidentCount}건 · 시민신고 {road.citizenReportCount}건</p>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="연도별 파손 이력">
          <div className="flex h-48 gap-6 px-2">
            {road.yearlyDamage.map((y) => (
              <div key={y.year} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">{y.count}건</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-blue-500"
                    style={{ height: `${(y.count / maxYearlyCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{y.year}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="파손 발생 원인 분석" description="요인별 기여도 추정치">
          <div className="flex flex-col gap-3">
            {road.causeAnalysis.map((c) => (
              <div key={c.factor} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs font-medium text-slate-500">
                  {CAUSE_FACTOR_LABEL[c.factor]}
                </span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${CAUSE_BAR_COLOR[c.factor]}`}
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right text-xs font-semibold text-slate-700">{c.percent}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {road.relatedReports?.length > 0 && (
        <Card className="mt-4" title="이 구간의 최근 신고" description={`총 ${road.relatedReports.length}건`}>
          <ul className="flex flex-col divide-y divide-slate-100">
            {road.relatedReports.slice(0, 5).map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => navigate(`/admin/reports/${r.id}`)}
                  className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-700">#{r.id}</span>
                  <span className="flex-1 truncate text-slate-500">{r.address}</span>
                  <span className="text-xs text-slate-400">{r.createdAt}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </AdminLayout>
  );
}

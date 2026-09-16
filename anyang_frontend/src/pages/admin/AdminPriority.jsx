import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, ChevronRight, Clock3, Eye, CheckCircle2 } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/admin/Badge';
import { TONE_CLASSES } from '../../components/admin/toneClasses';
import AdminPriorityFilters from '../../components/admin/priority/AdminPriorityFilters';
import AdminPriorityTable from '../../components/admin/priority/AdminPriorityTable';
import { useListQuery } from '../../hooks/useListQuery';
import { useListFilter } from '../../hooks/admin/useListFilter';
import { fetchPriorityClusters } from '../../api/inspectionClusters';
import { fetchUnclassifiedReports } from '../../api/report';
import { DAMAGE_TYPE_META, SEVERITY_UI_META, REPORT_STATUS_UI_META, PRIORITY_GRADE_META } from '../../mocks/admin/constants';
import { SEVERITY_TO_UI, STATUS_TO_UI } from '../../api/enumMapping';

// PRIORITY_GRADE_META에는 아이콘/카드 문구 같은 페이지 전용 표시 정보가 없어서
// 여기서만 보강한다. 등급 종류·label·tone 자체는 PRIORITY_GRADE_META가 기준.
const GRADE_STAT_ICON = {
  최우선: AlertOctagon,
  우선: Clock3,
  관심: Eye,
  일반: CheckCircle2,
};

const GRADE_STAT_LABEL_SUFFIX = {
  최우선: '점검',
  우선: '점검',
  관심: '구간',
  일반: '구간',
};

const GRADE_STAT_META = Object.entries(PRIORITY_GRADE_META).map(([key, meta]) => ({
  key,
  label: `${meta.label} ${GRADE_STAT_LABEL_SUFFIX[key]}`,
  icon: GRADE_STAT_ICON[key],
  tone: meta.tone,
}));

export default function AdminPriority() {
  const navigate = useNavigate();
  const { data: roads, error: roadsError } = useListQuery(fetchPriorityClusters);
  const { data: unclassifiedReports, error: unclassifiedError } = useListQuery(fetchUnclassifiedReports);
  const [riskFilter, setRiskFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  const gradeCounts = useMemo(() => {
    const counts = Object.fromEntries(Object.keys(PRIORITY_GRADE_META).map((key) => [key, 0]));
    (roads ?? []).forEach((road) => {
      if (counts[road.priorityGrade] != null) counts[road.priorityGrade] += 1;
    });
    return counts;
  }, [roads]);

  const filtered = useListFilter(roads, (road) => {
    const kw = keyword.trim().toLowerCase();
    const matchesRisk = riskFilter === 'all' || road.priorityGrade === riskFilter;
    const matchesKeyword = !kw || (road.roadAddress ?? '').toLowerCase().includes(kw);
    return matchesRisk && matchesKeyword;
  });

  return (
    <AdminLayout
      title="점검 우선순위"
      description="종합 위험도 점수가 높은 구간부터 우선적으로 점검하세요."
    >
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {GRADE_STAT_META.map((meta) => (
          <StatCard
            key={meta.key}
            icon={meta.icon}
            label={meta.label}
            value={roads ? gradeCounts[meta.key] : '-'}
            suffix="개 구간"
            tone={meta.tone}
          />
        ))}
      </div>

      <Card
        bodyClassName="p-0"
        title={roads ? `총 ${roads.length}개 구간` : undefined}
        actions={
          <AdminPriorityFilters
            keyword={keyword}
            onKeywordChange={setKeyword}
            riskFilter={riskFilter}
            onRiskFilterChange={setRiskFilter}
          />
        }
      >
        <AdminPriorityTable
          loading={!roads}
          error={roadsError}
          roads={filtered}
          onRowClick={(id) => navigate(`/admin/roads/${id}`)}
        />
      </Card>

      <Card
        className="mt-4"
        title={
          unclassifiedReports
            ? `미분류 신고 (${unclassifiedReports.length}건)`
            : '미분류 신고'
        }
        description="기존 분석 구간에 매칭되지 않은 시민 신고입니다."
      >
        {unclassifiedError ? (
          <p className="py-6 text-center text-sm text-red-500">
            미분류 신고를 불러오지 못했습니다. ({unclassifiedError.message})
          </p>
        ) : !unclassifiedReports ? (
          <p className="py-6 text-center text-sm text-slate-400">불러오는 중...</p>
        ) : unclassifiedReports.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">미분류 신고가 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {unclassifiedReports.map((report) => {
              const damageType = DAMAGE_TYPE_META[report.type] ?? { label: report.type ?? '-' };
              const DamageIcon = damageType.icon;
              const uiSeverity = SEVERITY_TO_UI[report.severity] ?? 'low';
              const uiStatus = STATUS_TO_UI[report.status] ?? 'received';

              return (
                <li key={report.id}>
                  <button
                    onClick={() => navigate(`/admin/reports/${report.id}`)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg text-[11px] font-medium ${TONE_CLASSES.neutral}`}
                    >
                      {DamageIcon && <DamageIcon size={16} />}
                      <span className="mt-0.5 leading-none">{damageType.label}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-slate-800">
                          {report.address || '주소 정보 없음'}
                        </span>
                        <Badge tone={SEVERITY_UI_META[uiSeverity].tone}>{SEVERITY_UI_META[uiSeverity].label}</Badge>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        신고 유형: {damageType.label} · 신고자: {report.userName ?? '알 수 없음'} · 상태:{' '}
                        {REPORT_STATUS_UI_META[uiStatus].label}
                      </p>
                    </div>

                    <ChevronRight size={16} className="shrink-0 text-slate-300" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </AdminLayout>
  );
}
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  User,
  Brain,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import Badge from '../../components/admin/Badge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import PhotoPlaceholder from '../../components/admin/PhotoPlaceholder';
import { useAdminDetailQuery } from '../../hooks/admin/useAdminDetailQuery';
import { fetchReportById, updateReportStatusAdmin } from '../../api/report';
import { DAMAGE_TYPE_META, SEVERITY_UI_META, REPORT_STATUS_UI_META } from '../../mocks/admin/constants';
import { SEVERITY_TO_UI, STATUS_TO_UI } from '../../api/enumMapping';

const NEXT_STATUS = {
  received: { key: 'CONFIRMED', label: '처리중' },
  progress: { key: 'COMPLETED', label: '처리완료' },
};

export default function AdminReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: report, setData: setReport, notFound } = useAdminDetailQuery(fetchReportById, id);
  const [advancing, setAdvancing] = useState(false);

  if (notFound) {
    return (
      <AdminLayout title="신고 상세">
        <Card>
          <EmptyState title="존재하지 않는 신고입니다" description={`신고번호 #${id}를 찾을 수 없습니다.`} />
        </Card>
      </AdminLayout>
    );
  }

  if (!report || String(report.id) !== String(id)) {
    return (
      <AdminLayout title="신고 상세">
        <LoadingState />
      </AdminLayout>
    );
  }

  const uiSeverity = SEVERITY_TO_UI[report.severity] ?? 'low';
  const uiStatus = STATUS_TO_UI[report.status] ?? 'received';
  const damageType = DAMAGE_TYPE_META[report.type] ?? { label: report.type ?? '-' };
  const nextStep = NEXT_STATUS[uiStatus];

  const handleAdvance = async () => {
    if (!nextStep) return;
    setAdvancing(true);
    try {
      await updateReportStatusAdmin(report.id, nextStep.key);
      setReport({ ...report, status: nextStep.key.toLowerCase() });
    } catch (err) {
      alert(err.message || '신고 상태 변경에 실패했습니다.');
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <AdminLayout>
      <button
        onClick={() => navigate('/admin/reports')}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} /> 신고 관리로 돌아가기
      </button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900">신고 #{report.id}</h1>
            <Badge tone={REPORT_STATUS_UI_META[uiStatus].tone}>{REPORT_STATUS_UI_META[uiStatus].label}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{damageType.label} 신고 상세 및 AI 검수</p>
        </div>
        {nextStep && (
          <button
            onClick={handleAdvance}
            disabled={advancing}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {advancing ? '처리 중...' : `${nextStep.label}(으)로 진행`}
            <ChevronRight size={15} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 lg:row-span-2">
          <Card title="신고 사진" className="h-full">
            {report.images?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {report.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.resultImageUrl || img.imageUrl}
                    alt="신고 사진"
                    className="w-full rounded-lg border border-slate-200 object-cover"
                  />
                ))}
              </div>
            ) : (
              <PhotoPlaceholder seed={Number(report.id)} />
            )}
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card title="신고 정보">
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-400">신고 위치</dt>
                  <dd className="font-medium text-slate-800">{report.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarDays size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-400">등록일</dt>
                  <dd className="font-medium text-slate-800">
                    {report.reportedAt ? report.reportedAt.slice(0, 10) : '-'}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-400">신고자</dt>
                  <dd className="font-medium text-slate-800">{report.userName ?? '알 수 없음'}</dd>
                </div>
              </div>
              {report.inspectionClusterId && (
                <button
                  onClick={() => navigate(`/admin/roads/${report.inspectionClusterId}`)}
                  className="mt-1 flex items-center gap-1 self-start text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  해당 구간 도로 상세 분석 보기 <ExternalLink size={12} />
                </button>
              )}
            </dl>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card
            title="AI 분석 결과"
            description="AI 기반 자동 판정 결과입니다."
            actions={
              report.aiConfidence != null && (
                <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
                  <Brain size={13} /> 탐지 신뢰도 {Math.round(report.aiConfidence)}%
                </span>
              )
            }
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">파손 유형 (AI)</p>
                <p className="mt-1 font-medium text-slate-900">{damageType.label}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">파손 정도 (AI)</p>
                <Badge tone={SEVERITY_UI_META[uiSeverity].tone} className="mt-1">
                  {SEVERITY_UI_META[uiSeverity].label}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-400">탐지 신뢰도</p>
                <p className="mt-1 font-medium text-slate-900">
                  {report.aiConfidence != null ? `${Math.round(report.aiConfidence)}%` : '-'}
                </p>
              </div>
            </div>

            {report.description && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                {report.description}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
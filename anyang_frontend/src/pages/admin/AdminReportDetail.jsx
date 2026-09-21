import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  User,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  Gauge,
  FileText,
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import Badge from '../../components/admin/Badge';
import InfoRow from '../../components/admin/InfoRow';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import PhotoPlaceholder from '../../components/admin/PhotoPlaceholder';
import { useAdminDetailQuery } from '../../hooks/admin/useAdminDetailQuery';
import { fetchReportById, updateReportStatusAdmin } from '../../api/report';
import { DAMAGE_TYPE_META, SEVERITY_UI_META, REPORT_STATUS_UI_META } from '../../mocks/admin/constants';
import ConfirmModal from '../../components/common/ConfirmModal';
import { SEVERITY_TO_UI, toStatusLabelKey, NEXT_STATUS_OPTIONS, REJECT_OPTION, canReject } from '../../api/enumMapping';

export default function AdminReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: report, setData: setReport, notFound, error } = useAdminDetailQuery(fetchReportById, id);
  const [advancing, setAdvancing] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (notFound) {
    return (
      <AdminLayout title="신고 상세">
        <Card>
          <EmptyState title="존재하지 않는 신고입니다" description={`신고번호 #${id}를 찾을 수 없습니다.`} />
        </Card>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="신고 상세">
        <Card>
          <EmptyState title="신고 정보를 불러오지 못했습니다" description={error.message} />
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
  const uiStatus = toStatusLabelKey(report.status);
  const damageType = DAMAGE_TYPE_META[report.type] ?? { label: report.type ?? '-' };
  const rawStatus = (report.status ?? 'received').toUpperCase();
  const statusOptions = NEXT_STATUS_OPTIONS[rawStatus] ?? NEXT_STATUS_OPTIONS.RECEIVED;
  const nextStep = statusOptions[1];

  const changeStatus = async (value) => {
    setAdvancing(true);
    try {
      await updateReportStatusAdmin(report.id, value);
      setReport({ ...report, status: value.toLowerCase() });
    } catch (err) {
      alert(err.message || '신고 상태 변경에 실패했습니다.');
    } finally {
      setAdvancing(false);
      setRejectOpen(false);
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
        <div className="flex items-center gap-2">
          {canReject(rawStatus) && (
            <button
              onClick={() => setRejectOpen(true)}
              disabled={advancing}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {REJECT_OPTION.label}
            </button>
          )}
          {nextStep && (
            <button
              onClick={() => changeStatus(nextStep.value)}
              disabled={advancing}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {advancing ? '처리 중...' : `${nextStep.label}(으)로 진행`}
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card title="신고 사진">
            {report.images?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {report.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt="신고 사진"
                    className="w-full rounded-lg border border-slate-200 object-cover"
                  />
                ))}
              </div>
            ) : (
              <PhotoPlaceholder seed={Number(report.id)} />
            )}
          </Card>

          <Card title="신고 정보">
            <dl className="flex flex-col gap-3 text-sm">
              <InfoRow icon={MapPin} label="신고 위치">
                {report.address}
              </InfoRow>
              <InfoRow icon={CalendarDays} label="등록일">
                {report.reportedAt ? report.reportedAt.slice(0, 10) : '-'}
              </InfoRow>
              <InfoRow icon={User} label="신고자">
                {report.userName ?? '알 수 없음'}
              </InfoRow>
              <InfoRow icon={AlertTriangle} label="파손 유형">
                {damageType.label}
              </InfoRow>
              <InfoRow icon={Gauge} label="위험도">
                <Badge tone={SEVERITY_UI_META[uiSeverity].tone}>{SEVERITY_UI_META[uiSeverity].label}</Badge>
              </InfoRow>
              {report.description && (
                <InfoRow icon={FileText} label="신고 내용">
                  {report.description}
                </InfoRow>
              )}
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
          <Card title="AI 분석 결과" description="AI 기반 자동 판정 결과입니다." className="h-full">
            {report.images?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {report.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.resultImageUrl || img.imageUrl}
                    alt="AI 분석 결과 이미지"
                    className="w-full rounded-lg border border-slate-200 object-cover"
                  />
                ))}
              </div>
            ) : (
              <PhotoPlaceholder seed={Number(report.id)} />
            )}

            <div className="mt-4">
              <p className="text-xs text-slate-400">탐지 신뢰도</p>
              {report.aiConfidence != null ? (
                <p className="mt-1 font-medium text-slate-900">{Math.round(report.aiConfidence)}%</p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">
                  AI가 파손을 탐지하지 못했습니다. (미지원 파손 유형이거나 탐지된 파손 없음)
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={rejectOpen}
        title={`신고 #${report.id}을(를) 반려하시겠습니까?`}
        description="반려한 신고는 화면에서 다시 다른 상태로 변경할 수 없습니다."
        confirmLabel="반려"
        tone="danger"
        loading={advancing}
        onConfirm={() => changeStatus(REJECT_OPTION.value)}
        onCancel={() => setRejectOpen(false)}
      />
    </AdminLayout>
  );
}
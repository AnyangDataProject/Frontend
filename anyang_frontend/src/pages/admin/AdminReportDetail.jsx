import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  User,
  Building2,
  Brain,
  PencilLine,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/admin/Card';
import Badge from '../../components/admin/Badge';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import PhotoPlaceholder from '../../components/admin/PhotoPlaceholder';
import StatusTimeline from '../../components/admin/StatusTimeline';
import { fetchReportById, fetchRoadById, updateReportClassification, updateReportStatus } from '../../mocks/admin/api';
import { DAMAGE_TYPE_META, REPORT_STATUS_STEPS, SEVERITY_META, REPORT_STATUS_META } from '../../mocks/admin/constants';
import { getMemberById } from '../../mocks/admin/membersData';

export default function AdminReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [road, setRoad] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ type: '', severity: '', note: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetchReportById(id).then((data) => {
      if (!data) {
        setNotFound(true);
        return;
      }
      setReport(data);
      setForm({
        type: data.manualOverride?.type ?? data.type,
        severity: data.manualOverride?.severity ?? data.severity,
        note: data.manualOverride?.note ?? '',
      });
      fetchRoadById(data.roadId).then(setRoad);
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (notFound) {
    return (
      <AdminLayout title="신고 상세">
        <Card>
          <EmptyState title="존재하지 않는 신고입니다" description={`신고번호 #${id}를 찾을 수 없습니다.`} />
        </Card>
      </AdminLayout>
    );
  }

  if (!report || report.id !== id) {
    return (
      <AdminLayout title="신고 상세">
        <LoadingState />
      </AdminLayout>
    );
  }

  const reporter = getMemberById(report.reporterId);
  const currentIndex = REPORT_STATUS_STEPS.findIndex((s) => s.key === report.status);
  const nextStep = REPORT_STATUS_STEPS[currentIndex + 1];
  const displayType = report.manualOverride?.type ?? report.type;
  const displaySeverity = report.manualOverride?.severity ?? report.severity;

  const handleAdvance = async () => {
    if (!nextStep) return;
    setAdvancing(true);
    const updated = await updateReportStatus(report.id, nextStep.key);
    setReport(updated);
    setAdvancing(false);
  };

  const handleSaveOverride = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updated = await updateReportClassification(report.id, form);
    setReport(updated);
    setSaving(false);
    setEditing(false);
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
            <Badge tone={REPORT_STATUS_META[report.status].tone}>{REPORT_STATUS_META[report.status].label}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{DAMAGE_TYPE_META[displayType].label} 신고 상세 및 AI 검수</p>
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

      <Card className="mb-4" title="처리 진행 상태">
        <StatusTimeline steps={report.timeline} currentKey={report.status} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card title="신고 사진">
            <PhotoPlaceholder seed={Number(report.id)} />
          </Card>

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
                  <dd className="font-medium text-slate-800">{report.createdAt}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-400">신고자</dt>
                  <dd className="font-medium text-slate-800">{reporter?.name ?? '알 수 없음'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-400">담당 부서</dt>
                  <dd className="font-medium text-slate-800">{report.department ?? '미배정'}</dd>
                </div>
              </div>
              {road && (
                <button
                  onClick={() => navigate(`/admin/roads/${road.id}`)}
                  className="mt-1 flex items-center gap-1 self-start text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  {road.name} 도로 상세 분석 보기 <ExternalLink size={12} />
                </button>
              )}
            </dl>
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-3">
          <Card
            title="AI 분석 결과"
            description="YOLO 기반 자동 판정 결과입니다."
            actions={
              <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
                <Brain size={13} /> 탐지 신뢰도 {report.aiConfidence}%
              </span>
            }
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">파손 유형 (AI)</p>
                <p className="mt-1 font-medium text-slate-900">{DAMAGE_TYPE_META[report.type].label}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">파손 정도 (AI)</p>
                <Badge tone={SEVERITY_META[report.severity].tone} className="mt-1">
                  {SEVERITY_META[report.severity].label}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-400">탐지 신뢰도</p>
                <p className="mt-1 font-medium text-slate-900">{report.aiConfidence}%</p>
              </div>
            </div>

            {report.manualOverride && (
              <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm">
                <p className="flex items-center gap-1 font-medium text-blue-700">
                  <PencilLine size={13} /> 관리자 수정 결과 ({report.manualOverride.at})
                </p>
                <p className="mt-1 text-slate-700">
                  {DAMAGE_TYPE_META[report.manualOverride.type].label} ·{' '}
                  {SEVERITY_META[report.manualOverride.severity].label}
                  {report.manualOverride.note && ` — ${report.manualOverride.note}`}
                </p>
              </div>
            )}
          </Card>

          <Card
            title="AI 판정 수정"
            description="AI 판단이 실제와 다를 경우 관리자가 직접 수정할 수 있습니다."
            actions={
              !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  <PencilLine size={13} /> 수정하기
                </button>
              )
            }
          >
            {!editing ? (
              <p className="text-sm text-slate-400">
                현재 확정된 판정: {DAMAGE_TYPE_META[displayType].label} · {SEVERITY_META[displaySeverity].label}
              </p>
            ) : (
              <form onSubmit={handleSaveOverride} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-500">파손 유형</span>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                      {Object.entries(DAMAGE_TYPE_META).map(([key, meta]) => (
                        <option key={key} value={key}>
                          {meta.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-500">파손 정도</span>
                    <select
                      value={form.severity}
                      onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                      {Object.entries(SEVERITY_META).map(([key, meta]) => (
                        <option key={key} value={key}>
                          {meta.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-500">수정 사유 (선택)</span>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    rows={2}
                    placeholder="예: 현장 확인 결과 AI가 균열을 포트홀로 오탐지"
                    className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                  />
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving ? '저장 중...' : '수정 저장'}
                  </button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

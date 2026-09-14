import { useState } from 'react';
import { PencilLine } from 'lucide-react';
import Card from './Card';
import { updateReportClassification } from '../../mocks/admin/api';
import { DAMAGE_TYPE_META, SEVERITY_META } from '../../mocks/admin/constants';

export default function ReportClassificationEditor({ report, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    type: report.manualOverride?.type ?? report.type,
    severity: report.manualOverride?.severity ?? report.severity,
    note: report.manualOverride?.note ?? '',
  });
  const [saving, setSaving] = useState(false);

  const displayType = report.manualOverride?.type ?? report.type;
  const displaySeverity = report.manualOverride?.severity ?? report.severity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updated = await updateReportClassification(report.id, form);
    onSaved(updated);
    setSaving(false);
    setEditing(false);
  };

  return (
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
  );
}

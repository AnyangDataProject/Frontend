import { X, MapPin, FileText, Sparkles } from "lucide-react";
import { DAMAGE_TYPE_META, SEVERITY_META } from "../../../mocks/citizen/constants";
import ReportStatusSteps from "./ReportStatusSteps";

export default function ReportDetailModal({ report, onClose }) {
  const typeLabel = DAMAGE_TYPE_META[report.type]?.label ?? report.type ?? "-";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(15,23,42,0.55)] p-6 backdrop-blur-[6px] max-[520px]:p-0"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(840px,calc(100vh-48px))] w-[min(640px,100%)] flex-col overflow-hidden rounded-xl border border-white/20 bg-white text-left shadow-[0_24px_48px_-12px_rgba(15,23,42,0.25)] max-[520px]:h-full max-[520px]:max-h-full max-[520px]:w-full max-[520px]:rounded-none"
        style={{ animation: "mrModalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-white p-5">
          <div>
            <p className="mb-0.5 text-xs font-semibold tracking-[0.05em] text-blue-600">신고 상세</p>
            <h2 className="text-base font-semibold text-slate-900">
              도로 파손 신고 #{report.id}
            </h2>
          </div>
          <button
            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border-0 bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* 이미지를 컨텐츠 안쪽에 배치해 하단 요소들과 좌우 여백을 일치시킴 */}
        <div className="flex-1 overflow-y-auto p-6 text-left max-[520px]:p-4">
          <div className="mb-5 h-[220px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 max-[520px]:mb-4 max-[520px]:h-[200px] max-[520px]:rounded-none">
            <img src={report.image} alt="신고 사진" className="block h-full w-full object-cover" />
          </div>

          <ReportStatusSteps status={report.status} />

          <div className="mb-5 grid grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white max-[800px]:grid-cols-2">
            <div className="flex flex-col gap-1.5 border-r border-slate-200 p-4 text-left max-[800px]:border-b">
              <span className="text-xs font-medium text-slate-500">파손 유형</span>
              <strong className="text-sm font-medium text-slate-900">{typeLabel}</strong>
            </div>
            <div className="flex flex-col gap-1.5 border-r border-slate-200 p-4 text-left max-[800px]:border-r-0 max-[800px]:border-b">
              <span className="text-xs font-medium text-slate-500">위험도</span>
              <strong
                className="text-sm font-medium"
                style={{ color: SEVERITY_META[report.severity].color }}
              >
                {SEVERITY_META[report.severity].label}
              </strong>
            </div>
            <div className="flex flex-col gap-1.5 border-r border-slate-200 p-4 text-left">
              <span className="text-xs font-medium text-slate-500">신고일</span>
              <strong className="text-sm font-medium text-slate-900">{report.reportedAt}</strong>
            </div>
            <div className="flex flex-col gap-1.5 p-4 text-left">
              <span className="text-xs font-medium text-slate-500">AI 분석 신뢰도</span>
              <strong className="text-sm font-medium text-slate-900">
                {report.aiConfidence != null ? `${report.aiConfidence}%` : '-'}
              </strong>
            </div>
          </div>

          <div className="mb-3.5 rounded-xl border border-slate-200 bg-white p-[18px] text-left">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
              <MapPin size={16} className="text-blue-600" />
              신고 위치
            </div>
            <p className="text-sm leading-[1.6] text-slate-500">{report.address}</p>
          </div>

          <div className="mb-3.5 rounded-xl border border-slate-200 bg-white p-[18px] text-left">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
              <FileText size={16} className="text-blue-600" />
              신고 내용
            </div>
            <p className="text-sm leading-[1.6] text-slate-500">{report.description}</p>
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-[18px] text-left">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
              <Sparkles size={17} />
              AI 분석 결과
            </div>

            {report.resultImageUrl && (
              <div className="mb-3 h-[180px] w-full overflow-hidden rounded-lg border border-blue-100 bg-white">
                <img
                  src={report.resultImageUrl}
                  alt="AI 분석 결과 이미지"
                  className="block h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mb-3 rounded-lg border border-blue-100 bg-white p-3 text-left">
              <span className="text-xs font-medium text-slate-500">분석 신뢰도</span>
              <strong className="block text-sm font-semibold text-slate-900">
                {report.aiConfidence != null ? `${report.aiConfidence}%` : '-'}
              </strong>
            </div>

            <p className="text-xs leading-[1.6] text-slate-400">
              AI 분석 결과는 도로 파손 여부와 위험도를 판단하기 위한 참고 정보이며, 최종
              처리 여부는 담당 부서의 확인 후 결정됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

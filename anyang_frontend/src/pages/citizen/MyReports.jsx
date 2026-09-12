import { useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  Wrench,
  MapPin,
  ChevronRight,
  X,
  Sparkles,
  CalendarDays,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/citizen/BackButton";
import PageHeader from "../../components/citizen/PageHeader";
import { DAMAGE_TYPE_META, SEVERITY_META, REPORT_STATUS_META } from "../../mocks/citizen/constants";
import { MY_REPORTS } from "../../mocks/citizen/reportsData";

function MyReports() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  const counts = useMemo(() => {
    return {
      all: MY_REPORTS.length,
      received: MY_REPORTS.filter((r) => r.status === "received").length,
      progress: MY_REPORTS.filter((r) => r.status === "progress").length,
      done: MY_REPORTS.filter((r) => r.status === "done").length,
    };
  }, []);

  const filteredReports = useMemo(() => {
    if (statusFilter === "all") return MY_REPORTS;
    return MY_REPORTS.filter((r) => r.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-[72px] text-left max-[768px]:pt-16">
      <style>{`
        @keyframes mrModalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10 max-[800px]:w-[calc(100%-32px)] max-[800px]:px-0 max-[800px]:pt-6 max-[800px]:pb-[60px]">
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        <PageHeader
          eyebrow="MY REPORTS"
          title="내 신고현황"
          description="내가 접수한 도로 파손 신고의 처리 현황을 확인할 수 있습니다."
          action={
            <button
              className="flex shrink-0 items-center gap-2 rounded-lg border-0 bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 max-[800px]:w-full max-[800px]:justify-center"
              onClick={() => navigate("/report")}
            >
              <Camera size={18} />
              파손 신고하기
            </button>
          }
        />

        <section className="mb-9 grid grid-cols-4 gap-3 max-[800px]:grid-cols-2">
          <button
            className={`flex min-h-[96px] items-center gap-[13px] rounded-xl border p-[18px] text-left shadow-sm transition-colors max-[520px]:min-h-[82px] max-[520px]:p-[13px] ${
              statusFilter === "all"
                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 max-[520px]:h-9 max-[520px]:w-9">
              <FileText size={20} />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <span className="text-left text-xs font-medium text-slate-500">전체 신고</span>
              <strong className="text-left text-2xl font-semibold leading-none text-slate-900 max-[520px]:text-xl">
                {counts.all}
              </strong>
            </div>
          </button>

          <button
            className={`flex min-h-[96px] items-center gap-[13px] rounded-xl border p-[18px] text-left shadow-sm transition-colors max-[520px]:min-h-[82px] max-[520px]:p-[13px] ${
              statusFilter === "received"
                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
            onClick={() => setStatusFilter("received")}
          >
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 max-[520px]:h-9 max-[520px]:w-9">
              <Clock size={20} />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <span className="text-left text-xs font-medium text-slate-500">접수됨</span>
              <strong className="text-left text-2xl font-semibold leading-none text-slate-900 max-[520px]:text-xl">
                {counts.received}
              </strong>
            </div>
          </button>

          <button
            className={`flex min-h-[96px] items-center gap-[13px] rounded-xl border p-[18px] text-left shadow-sm transition-colors max-[520px]:min-h-[82px] max-[520px]:p-[13px] ${
              statusFilter === "progress"
                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
            onClick={() => setStatusFilter("progress")}
          >
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 max-[520px]:h-9 max-[520px]:w-9">
              <Wrench size={20} />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <span className="text-left text-xs font-medium text-slate-500">처리중</span>
              <strong className="text-left text-2xl font-semibold leading-none text-slate-900 max-[520px]:text-xl">
                {counts.progress}
              </strong>
            </div>
          </button>

          <button
            className={`flex min-h-[96px] items-center gap-[13px] rounded-xl border p-[18px] text-left shadow-sm transition-colors max-[520px]:min-h-[82px] max-[520px]:p-[13px] ${
              statusFilter === "done"
                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
            onClick={() => setStatusFilter("done")}
          >
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 max-[520px]:h-9 max-[520px]:w-9">
              <CheckCircle2 size={20} />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <span className="text-left text-xs font-medium text-slate-500">처리완료</span>
              <strong className="text-left text-2xl font-semibold leading-none text-slate-900 max-[520px]:text-xl">
                {counts.done}
              </strong>
            </div>
          </button>
        </section>

        <section className="mt-2 text-left">
          <div className="mb-4 flex items-center justify-between max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                신고 내역
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                  {filteredReports.length}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-[3px] rounded-lg bg-slate-100 p-[3px] max-[800px]:w-full">
              <button
                className={`rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition-all max-[800px]:flex-1 ${
                  statusFilter === "all" ? "bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""
                }`}
                onClick={() => setStatusFilter("all")}
              >
                전체
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition-all max-[800px]:flex-1 ${
                  statusFilter === "received" ? "bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""
                }`}
                onClick={() => setStatusFilter("received")}
              >
                접수됨
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition-all max-[800px]:flex-1 ${
                  statusFilter === "progress" ? "bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""
                }`}
                onClick={() => setStatusFilter("progress")}
              >
                처리중
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition-all max-[800px]:flex-1 ${
                  statusFilter === "done" ? "bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""
                }`}
                onClick={() => setStatusFilter("done")}
              >
                완료
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredReports.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-center text-slate-400 shadow-sm">
                <FileText size={42} />
                <h3 className="mt-[14px] mb-[5px] text-sm font-medium text-slate-600">신고 내역이 없습니다.</h3>
                <p className="text-xs">아직 해당 상태의 신고가 없습니다.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const type = DAMAGE_TYPE_META[report.type];
                const severity = SEVERITY_META[report.severity];
                const status = REPORT_STATUS_META[report.status];
                const TypeIcon = type.icon;
                const StatusIcon = status.icon;

                return (
                  <article
                    className="grid min-h-[174px] cursor-pointer grid-cols-[190px_1fr] overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-colors hover:border-blue-300 max-[800px]:grid-cols-[135px_1fr] max-[520px]:grid-cols-[105px_1fr]"
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="relative min-h-[174px] overflow-hidden bg-slate-100 max-[800px]:min-h-[180px] max-[520px]:min-h-[170px]">
                      <img src={report.image} alt={type.label} className="block h-full w-full object-cover" />
                      <span
                        className="absolute left-[10px] top-[10px] flex items-center gap-[5px] rounded-md px-[9px] py-[5px] text-xs font-semibold text-slate-900 backdrop-blur-sm"
                        style={{
                          color: severity.color,
                          backgroundColor: "rgba(255, 255, 255, 0.92)",
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: severity.color }}
                        />
                        위험도 {severity.label}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-col py-5 px-[22px] text-left max-[800px]:p-[15px] max-[520px]:p-3">
                      <div className="mb-3 flex items-center justify-between gap-2.5 max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-2">
                        <div className="flex items-center gap-[9px]">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <TypeIcon size={16} />
                          </span>
                          <strong className="text-sm font-semibold text-slate-900">
                            {type.label}
                          </strong>
                        </div>

                        <div
                          className="inline-flex items-center gap-[5px] whitespace-nowrap rounded-md px-2.5 py-[5px] text-xs font-medium max-[800px]:self-start"
                          style={{
                            color: status.color,
                            backgroundColor: `${status.color}1F`,
                          }}
                        >
                          <StatusIcon size={15} />
                          {status.label}
                        </div>
                      </div>

                      <div className="mb-1.5 flex items-center gap-[5px] text-left text-sm font-medium text-slate-900 max-[520px]:items-start max-[520px]:leading-[1.4]">
                        <MapPin size={15} className="shrink-0 text-blue-600" />
                        {report.address}
                      </div>

                      <div className="flex items-center gap-[5px] text-left text-xs text-slate-400">
                        <CalendarDays size={14} />
                        신고일 {report.reportedAt}
                      </div>

                      <p className="my-[10px] mb-[14px] line-clamp-2 text-left text-xs leading-[1.6] text-slate-500 max-[800px]:hidden">
                        {report.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between max-[800px]:mt-3 max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-2">
                        <div className="flex items-center gap-[5px] text-xs text-slate-400">
                          <Sparkles size={14} className="shrink-0 text-blue-600" />
                          AI 분석 신뢰도 <strong className="text-slate-900">{report.aiConfidence}%</strong>
                        </div>

                        <span className="flex items-center gap-0.5 text-xs font-medium text-blue-600">
                          상세보기
                          <ChevronRight size={16} />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>

      {selectedReport && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(15,23,42,0.55)] p-6 backdrop-blur-[6px] max-[520px]:p-0"
          onClick={() => setSelectedReport(null)}
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
                  도로 파손 신고 #{selectedReport.id}
                </h2>
              </div>
              <button
                className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border-0 bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900"
                onClick={() => setSelectedReport(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* 이미지를 컨텐츠 안쪽에 배치해 하단 요소들과 좌우 여백을 일치시킴 */}
            <div className="flex-1 overflow-y-auto p-6 text-left max-[520px]:p-4">
              <div className="mb-5 h-[220px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 max-[520px]:mb-4 max-[520px]:h-[200px] max-[520px]:rounded-none">
                <img src={selectedReport.image} alt="신고 사진" className="block h-full w-full object-cover" />
              </div>

              <div className="mb-7 flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4 max-[520px]:p-3">
                <div
                  className={`flex flex-col items-center gap-2 text-xs font-medium transition-opacity ${
                    ["received", "progress", "done"].includes(selectedReport.status)
                      ? "text-blue-600 opacity-100"
                      : "text-slate-500 opacity-50"
                  }`}
                >
                  <div
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border text-xs font-medium max-[520px]:h-7 max-[520px]:w-7 ${
                      ["received", "progress", "done"].includes(selectedReport.status)
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    <Clock size={15} />
                  </div>
                  <span>접수</span>
                </div>

                <div
                  className={`mx-3 mb-[22px] h-0.5 flex-1 ${
                    ["progress", "done"].includes(selectedReport.status) ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />

                <div
                  className={`flex flex-col items-center gap-2 text-xs font-medium transition-opacity ${
                    ["progress", "done"].includes(selectedReport.status)
                      ? "text-blue-600 opacity-100"
                      : "text-slate-500 opacity-50"
                  }`}
                >
                  <div
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border text-xs font-medium max-[520px]:h-7 max-[520px]:w-7 ${
                      ["progress", "done"].includes(selectedReport.status)
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    <Wrench size={15} />
                  </div>
                  <span>처리중</span>
                </div>

                <div
                  className={`mx-3 mb-[22px] h-0.5 flex-1 ${
                    selectedReport.status === "done" ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />

                <div
                  className={`flex flex-col items-center gap-2 text-xs font-medium transition-opacity ${
                    selectedReport.status === "done" ? "text-blue-600 opacity-100" : "text-slate-500 opacity-50"
                  }`}
                >
                  <div
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border text-xs font-medium max-[520px]:h-7 max-[520px]:w-7 ${
                      selectedReport.status === "done"
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    <CheckCircle2 size={15} />
                  </div>
                  <span>처리완료</span>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white max-[800px]:grid-cols-2">
                <div className="flex flex-col gap-1.5 border-r border-slate-200 p-4 text-left max-[800px]:border-b">
                  <span className="text-xs font-medium text-slate-500">파손 유형</span>
                  <strong className="text-sm font-medium text-slate-900">
                    {DAMAGE_TYPE_META[selectedReport.type].label}
                  </strong>
                </div>
                <div className="flex flex-col gap-1.5 border-r border-slate-200 p-4 text-left max-[800px]:border-r-0 max-[800px]:border-b">
                  <span className="text-xs font-medium text-slate-500">위험도</span>
                  <strong
                    className="text-sm font-medium"
                    style={{ color: SEVERITY_META[selectedReport.severity].color }}
                  >
                    {SEVERITY_META[selectedReport.severity].label}
                  </strong>
                </div>
                <div className="flex flex-col gap-1.5 border-r border-slate-200 p-4 text-left">
                  <span className="text-xs font-medium text-slate-500">신고일</span>
                  <strong className="text-sm font-medium text-slate-900">{selectedReport.reportedAt}</strong>
                </div>
                <div className="flex flex-col gap-1.5 p-4 text-left">
                  <span className="text-xs font-medium text-slate-500">AI 분석 신뢰도</span>
                  <strong className="text-sm font-medium text-slate-900">{selectedReport.aiConfidence}%</strong>
                </div>
              </div>

              <div className="mb-3.5 rounded-xl border border-slate-200 bg-white p-[18px] text-left">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <MapPin size={16} className="text-blue-600" />
                  신고 위치
                </div>
                <p className="text-sm leading-[1.6] text-slate-500">{selectedReport.address}</p>
              </div>

              <div className="mb-3.5 rounded-xl border border-slate-200 bg-white p-[18px] text-left">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <FileText size={16} className="text-blue-600" />
                  신고 내용
                </div>
                <p className="text-sm leading-[1.6] text-slate-500">{selectedReport.description}</p>
              </div>

              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-[18px] text-left">
                <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                  <Sparkles size={17} />
                  AI 분석 결과
                </div>

                <div className="mb-3 grid grid-cols-3 gap-2.5 max-[800px]:grid-cols-1">
                  <div className="flex flex-col gap-1 rounded-lg border border-blue-100 bg-white p-3 text-left">
                    <span className="text-xs font-medium text-slate-500">파손 유형</span>
                    <strong className="text-sm font-semibold text-slate-900">
                      {DAMAGE_TYPE_META[selectedReport.type].label}
                    </strong>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border border-blue-100 bg-white p-3 text-left">
                    <span className="text-xs font-medium text-slate-500">위험도</span>
                    <strong className="text-sm font-semibold text-slate-900">{selectedReport.aiRisk}</strong>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border border-blue-100 bg-white p-3 text-left">
                    <span className="text-xs font-medium text-slate-500">분석 신뢰도</span>
                    <strong className="text-sm font-semibold text-slate-900">
                      {selectedReport.aiConfidence}%
                    </strong>
                  </div>
                </div>

                <p className="text-xs leading-[1.6] text-slate-400">
                  AI 분석 결과는 도로 파손 여부와 위험도를 판단하기 위한 참고 정보이며, 최종
                  처리 여부는 담당 부서의 확인 후 결정됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReports;

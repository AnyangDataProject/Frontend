import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  Wrench,
  MapPin,
  ChevronRight,
  Sparkles,
  CalendarDays,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/citizen/BackButton";
import PageHeader from "../../components/citizen/PageHeader";
import StatFilterCard from "../../components/citizen/my-reports/StatFilterCard";
import ReportDetailModal from "../../components/citizen/my-reports/ReportDetailModal";
import { DAMAGE_TYPE_META, SEVERITY_META, REPORT_STATUS_META } from "../../mocks/citizen/constants";
import { getMyReports } from "../../api/report";
import { SEVERITY_TO_UI, STATUS_TO_UI } from "../../api/enumMapping";

function normalizeReport(dto) {
  return {
    id: dto.id,
    type: dto.type,
    severity: SEVERITY_TO_UI[dto.severity] ?? "low",
    status: STATUS_TO_UI[dto.status] ?? "received",
    address: dto.address,
    reportedAt: dto.reportedAt ? dto.reportedAt.slice(0, 10) : "",
    description: dto.description,
    aiConfidence: dto.aiConfidence != null ? Math.round(dto.aiConfidence * 100) : null,
    aiDetections: dto.aiDetections,
    image: dto.images?.[0]?.resultImageUrl || dto.images?.[0]?.imageUrl || "",
  };
}

function MyReports() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyReports()
      .then((data) => setReports(data.map(normalizeReport)))
      .catch((err) => setError(err.message || "신고 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    return {
      all: reports.length,
      received: reports.filter((r) => r.status === "received").length,
      progress: reports.filter((r) => r.status === "progress").length,
      done: reports.filter((r) => r.status === "done").length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (statusFilter === "all") return reports;
    return reports.filter((r) => r.status === statusFilter);
  }, [statusFilter, reports]);

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
          <StatFilterCard
            icon={FileText}
            iconClass="bg-slate-100 text-slate-600"
            label="전체 신고"
            count={counts.all}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />

          <StatFilterCard
            icon={Clock}
            iconClass="bg-blue-50 text-blue-600"
            label="접수됨"
            count={counts.received}
            active={statusFilter === "received"}
            onClick={() => setStatusFilter("received")}
          />

          <StatFilterCard
            icon={Wrench}
            iconClass="bg-amber-50 text-amber-600"
            label="처리중"
            count={counts.progress}
            active={statusFilter === "progress"}
            onClick={() => setStatusFilter("progress")}
          />

          <StatFilterCard
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
            label="처리완료"
            count={counts.done}
            active={statusFilter === "done"}
            onClick={() => setStatusFilter("done")}
          />
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
            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center text-slate-400 text-sm">
                불러오는 중...
              </div>
            ) : error ? (
              <div className="flex min-h-[280px] items-center justify-center text-red-500 text-sm">
                {error}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-center text-slate-400 shadow-sm">
                <FileText size={42} />
                <h3 className="mt-[14px] mb-[5px] text-sm font-medium text-slate-600">신고 내역이 없습니다.</h3>
                <p className="text-xs">아직 해당 상태의 신고가 없습니다.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const type = DAMAGE_TYPE_META[report.type] ?? { label: report.type ?? "-", icon: FileText };
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
        <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}

export default MyReports;
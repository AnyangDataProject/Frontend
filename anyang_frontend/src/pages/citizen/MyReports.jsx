import { useMemo, useState } from "react";
import { Camera, CheckCircle2, Clock, Wrench, FileText, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/citizen/BackButton";
import PageHeader from "../../components/citizen/PageHeader";
import StatFilterCard from "../../components/citizen/my-reports/StatFilterCard";
import ReportCard from "../../components/citizen/my-reports/ReportCard";
import ReportDetailModal from "../../components/citizen/my-reports/ReportDetailModal";
import { getMyReports } from "../../api/report";
import { toReportViewModel } from "../../utils/reportViewModel";
import { useListQuery } from "../../hooks/useListQuery";

const STATUS_FILTER_TABS = [
  { value: "all", label: "전체" },
  { value: "received", label: "접수됨" },
  { value: "progress", label: "처리중" },
  { value: "done", label: "완료" },
  { value: "rejected", label: "반려" },
];

function MyReports() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const { data: rawReports, loading, error } = useListQuery(getMyReports);
  const reports = useMemo(() => (rawReports ?? []).map(toReportViewModel), [rawReports]);

  const counts = useMemo(() => {
    return {
      all: reports.length,
      received: reports.filter((r) => r.status === "received").length,
      progress: reports.filter((r) => r.status === "progress").length,
      done: reports.filter((r) => r.status === "done").length,
      rejected: reports.filter((r) => r.status === "rejected").length,
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

        <section className="mb-9 grid grid-cols-5 gap-3 max-[800px]:grid-cols-2">
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

          <StatFilterCard
            icon={XCircle}
            iconClass="bg-red-50 text-red-600"
            label="반려"
            count={counts.rejected}
            active={statusFilter === "rejected"}
            onClick={() => setStatusFilter("rejected")}
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
              {STATUS_FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition-all max-[800px]:flex-1 ${
                    statusFilter === tab.value ? "bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""
                  }`}
                  onClick={() => setStatusFilter(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center text-slate-400 text-sm">
                불러오는 중...
              </div>
            ) : error ? (
              <div className="flex min-h-[280px] items-center justify-center text-red-500 text-sm">
                {error.message || "신고 목록을 불러오지 못했습니다."}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-center text-slate-400 shadow-sm">
                <FileText size={42} />
                <h3 className="mt-[14px] mb-[5px] text-sm font-medium text-slate-600">신고 내역이 없습니다.</h3>
                <p className="text-xs">아직 해당 상태의 신고가 없습니다.</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} onClick={() => setSelectedReport(report)} />
              ))
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
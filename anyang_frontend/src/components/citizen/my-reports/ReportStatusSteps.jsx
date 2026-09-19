import { Fragment } from "react";
import { Clock, Wrench, CheckCircle2, XCircle } from "lucide-react";

const STEPS = [
  { key: "received", icon: Clock, label: "접수", isActive: (status) => ["received", "progress", "done"].includes(status) },
  { key: "progress", icon: Wrench, label: "처리중", isActive: (status) => ["progress", "done"].includes(status) },
  { key: "done", icon: CheckCircle2, label: "처리완료", isActive: (status) => status === "done" },
];

export default function ReportStatusSteps({ status }) {
  if (status === "rejected") {
    return (
      <div className="mb-7 flex items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600 max-[520px]:p-3">
        <XCircle size={16} />
        반려된 신고입니다
      </div>
    );
  }

  return (
    <div className="mb-7 flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4 max-[520px]:p-3">
      {STEPS.map((step, index) => {
        const active = step.isActive(status);
        const Icon = step.icon;

        return (
          <Fragment key={step.key}>
            <div
              className={`flex flex-col items-center gap-2 text-xs font-medium transition-opacity ${
                active ? "text-blue-600 opacity-100" : "text-slate-500 opacity-50"
              }`}
            >
              <div
                className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border text-xs font-medium max-[520px]:h-7 max-[520px]:w-7 ${
                  active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                <Icon size={15} />
              </div>
              <span>{step.label}</span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`mx-3 mb-[22px] h-0.5 flex-1 ${
                  STEPS[index + 1].isActive(status) ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

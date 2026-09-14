import { BrainCircuit } from "lucide-react";
import { SECTION_LABEL_CLASS } from "./AnalysisCard";

export default function AiSummarySection({ summary }) {
  return (
    <section className="flex items-start gap-3.5 p-5 mb-[15px] bg-white border-l-4 border-blue-600 text-left max-[430px]:p-[17px]">
      <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
        <BrainCircuit size={25} />
      </div>

      <div>
        <span className={SECTION_LABEL_CLASS}>
          AI SUMMARY
        </span>

        <h2 className="mt-0.5 mb-1.5 text-sm font-semibold text-slate-900">AI 분석 요약</h2>

        <p className="text-slate-500 text-xs leading-[1.7]">
          {summary}
        </p>
      </div>
    </section>
  );
}

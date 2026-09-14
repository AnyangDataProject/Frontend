import { ArrowLeft, BrainCircuit } from "lucide-react";

export default function AiAnalysisTopBar({ onBack }) {
  return (
    <header className="h-[72px] bg-white/[0.94] border-b border-slate-200 fixed top-0 left-0 right-0 z-[100] backdrop-blur-[10px]">
      <div className="max-w-[1440px] h-full mx-auto px-6 lg:px-10 flex items-center">
        <button
          className="border-0 bg-transparent inline-flex items-center gap-1.5 p-0 text-slate-500 text-sm font-semibold cursor-pointer transition-colors hover:text-slate-900"
          onClick={onBack}
        >
          <ArrowLeft size={20} />
          <span>이전</span>
        </button>

        <div className="ml-4 pl-4 border-l border-slate-200 flex items-center gap-2.5 text-blue-600">
          <BrainCircuit size={20} />
          <div className="flex flex-col gap-px text-left">
            <strong className="text-slate-900 text-sm font-bold">AI 분석 결과</strong>
            <span className="text-slate-400 text-xs">알로드 도로파손 분석 시스템</span>
          </div>
        </div>
      </div>
    </header>
  );
}

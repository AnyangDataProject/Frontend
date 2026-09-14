import { ChevronRight } from "lucide-react";
import AnalysisCard from "./AnalysisCard";
import TimelineItem from "./TimelineItem";

export default function ProcessingStatusSection({ status, onViewMyReports }) {
  return (
    <AnalysisCard
      eyebrow="PROCESS STATUS"
      title="신고 처리 현황"
      action={
        <button
          className="border-0 bg-transparent flex items-center gap-1 text-slate-500 text-xs font-semibold cursor-pointer p-0 transition-colors hover:text-blue-600"
          onClick={onViewMyReports}
        >
          내 신고에서 보기
          <ChevronRight size={16} />
        </button>
      }
    >
      <div className="flex flex-col gap-[14px]">
        <TimelineItem
          title="신고 접수"
          description="시민 신고가 접수되었습니다."
          active={true}
          done={true}
        />

        <TimelineItem
          title="AI 분석"
          description="신고 사진에 대한 AI 분석이 완료되었습니다."
          active={true}
          done={true}
        />

        <TimelineItem
          title="담당 부서 확인"
          description="담당 부서에서 현장 상태를 확인합니다."
          active={status !== "received"}
          done={status === "done"}
        />

        <TimelineItem
          title="보수 및 처리 완료"
          description="도로파손 보수 작업이 완료됩니다."
          active={status === "done"}
          done={status === "done"}
          last
        />
      </div>
    </AnalysisCard>
  );
}

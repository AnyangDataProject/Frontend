import { MessageSquareText, Info } from "lucide-react";
import InfoNotice from "./InfoNotice";

const PROCESS_STEPS = [
  { step: 1, title: "문의 접수", description: "문의 내용을 등록합니다." },
  { step: 2, title: "담당자 확인", description: "담당 부서에서 내용을 확인합니다." },
  { step: 3, title: "답변 전달", description: "입력하신 이메일로 답변드립니다." },
];

export default function InquirySidebar({ onGoToReport }) {
  return (
    <aside className="sticky top-[90px] max-[850px]:static flex flex-col max-[850px]:grid max-[850px]:grid-cols-2 max-[650px]:!grid-cols-1 gap-[15px]">
      <InfoNotice variant="panel" icon={<Info size={20} />}>
        <h3 className="text-sm font-semibold text-slate-900">
          민원 · 문의 접수 안내
        </h3>
        <p className="mt-2 text-sm text-slate-500 break-keep">
          도로 파손 신고와 관련된 문의나 서비스 이용 중 발생한 불편사항을 접수할 수 있습니다.
        </p>

        <div className="my-[18px] h-px w-full bg-slate-200" />

        <div className="w-full text-left">
          <strong className="text-sm font-semibold text-slate-900">도로 파손을 발견했다면?</strong>
          <p className="mb-3.5 mt-1.5 text-xs leading-[1.6] text-slate-500 break-keep">
            일반 문의보다 <b className="font-semibold text-blue-600">파손 신고</b>를 이용해주세요. 사진과
            위치를 등록하면 AI 분석을 통해 신고가 접수됩니다.
          </p>
          <button
            type="button"
            onClick={onGoToReport}
            className="h-9 w-full rounded-lg border border-blue-200 bg-blue-50 font-[inherit] text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            파손 신고하기
          </button>
        </div>
      </InfoNotice>

      <div className="rounded-xl border border-slate-200 bg-white p-[22px] text-left shadow-sm">
        <div className="mb-[18px] flex items-center gap-2 text-left text-sm font-semibold text-slate-900">
          <MessageSquareText size={17} className="text-blue-600" />
          문의 처리 절차
        </div>

        <div className="flex flex-col gap-4 text-left">
          {PROCESS_STEPS.map(({ step, title, description }) => (
            <div className="flex items-start gap-2.5 text-left" key={step}>
              <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                {step}
              </span>
              <div className="min-w-0 flex-1 text-left">
                <strong className="block text-sm font-medium text-slate-900">{title}</strong>
                <small className="mt-[3px] block text-xs leading-[1.4] text-slate-500">
                  {description}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

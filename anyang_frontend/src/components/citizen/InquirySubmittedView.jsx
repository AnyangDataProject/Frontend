import { Mail, Clock3 } from "lucide-react";
import BackButton from "./BackButton";
import SuccessScreen from "./SuccessScreen";

export default function InquirySubmittedView({ email, onGoToMap, onReset }) {
  return (
    <div className="min-h-screen bg-slate-50 pt-[72px]">
      <main className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5 pb-20">
        <div className="relative w-[min(580px,100%)] rounded-xl border border-slate-200 bg-white p-9 max-[650px]:px-5 max-[650px]:py-[38px] text-center shadow-sm">
          <div className="absolute left-[22px] top-[22px]">
            <BackButton to="/" />
          </div>

          <SuccessScreen
            eyebrow="SUBMISSION COMPLETE"
            title={
              <>
                민원·문의가
                <br />
                접수되었습니다.
              </>
            }
            description={
              <>
                보내주신 내용을 담당자가 확인한 후 답변드리겠습니다.
                <br />
                답변은 입력하신 이메일로 전달됩니다.
              </>
            }
            summary={
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                <div className="flex min-h-[32px] items-center gap-2">
                  <Mail size={17} className="text-blue-600" />
                  <span className="w-20 text-xs text-slate-400">답변 이메일</span>
                  <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-900">
                    {email}
                  </strong>
                </div>

                <div className="flex min-h-[32px] items-center gap-2">
                  <Clock3 size={17} className="text-blue-600" />
                  <span className="w-20 text-xs text-slate-400">답변 안내</span>
                  <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-900">
                    담당자 확인 후 순차적으로 답변
                  </strong>
                </div>
              </div>
            }
            secondaryAction={
              <button
                className="h-[45px] flex-1 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
                onClick={onGoToMap}
              >
                지도 돌아가기
              </button>
            }
            primaryAction={
              <button
                className="h-[45px] flex-1 rounded-lg border-0 bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                onClick={onReset}
              >
                문의 하나 더 접수
              </button>
            }
          />
        </div>
      </main>
    </div>
  );
}

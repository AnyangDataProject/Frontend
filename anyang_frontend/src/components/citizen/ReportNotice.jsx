import { AlertTriangle } from "lucide-react";
import Checkbox from "./Checkbox";

export default function ReportNotice({ agree, onAgreeChange }) {
  return (
    <section className="flex items-start gap-[13px] p-5 mb-[18px] border border-slate-200 rounded-xl shadow-sm bg-white text-left">
      <div className="w-[35px] h-[35px] shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
        <AlertTriangle size={19} />
      </div>
      <div>
        <strong className="block mb-2 text-xs text-slate-900 text-left">신고 전 안내사항</strong>
        <ul className="m-0 pl-4 text-slate-500 text-xs leading-[1.8] text-left">
          <li>허위 또는 장난성 신고는 서비스 이용에 제한이 있을 수 있습니다.</li>
          <li>신고 사진 및 위치정보는 도로파손 확인과 행정처리를 위해 사용됩니다.</li>
          <li>AI 분석 결과는 참고용이며 최종 처리는 담당 부서의 현장 확인을 기준으로 합니다.</li>
        </ul>

        <div className="mt-[13px]">
          <Checkbox
            checked={agree}
            onChange={(e) => onAgreeChange(e.target.checked)}
            label="신고 안내사항을 확인했으며 신고 내용 제공에 동의합니다."
            emphasized
          />
        </div>
      </div>
    </section>
  );
}

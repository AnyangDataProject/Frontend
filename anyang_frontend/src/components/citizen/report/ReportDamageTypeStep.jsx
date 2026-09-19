import { AlertTriangle } from "lucide-react";
import StepSection from "../StepSection";
import SelectableCard from "../SelectableCard";
import { DAMAGE_TYPE_META, REPORTABLE_DAMAGE_TYPES } from "../../../mocks/citizen/constants";

const DAMAGE_TYPES = REPORTABLE_DAMAGE_TYPES.map((value) => ({ value, ...DAMAGE_TYPE_META[value] }));

export default function ReportDamageTypeStep({ value, onChange }) {
  return (
    <StepSection number="02" title="파손 유형" description="가장 가까운 파손 유형을 선택해주세요.">
      <div className="grid grid-cols-2 gap-[9px] max-[700px]:grid-cols-1">
        {DAMAGE_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = value === type.value;
          return (
            <SelectableCard
              key={type.value}
              selected={isSelected}
              onClick={() => onChange(type.value)}
              icon={
                <div
                  className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon size={21} />
                </div>
              }
              label={type.label}
              description={type.description}
            />
          );
        })}
      </div>

      <div className="flex items-start gap-2 mt-[13px] py-[11px] px-3 rounded-lg bg-slate-50 text-left">
        <div className="text-blue-600 shrink-0">
          <AlertTriangle size={16} />
        </div>
        <p className="m-0 text-slate-500 text-xs leading-[1.6] text-left">
          선택한 유형은 참고용입니다. 신고 사진은 AI가 별도로 분석하여 파손 유형을 판별합니다.
          <br />
          현재 AI는 위 4가지 도로 노면 파손 유형만 인식할 수 있어, 그 외 시설물 파손은 아직 자동 분석 결과가 제공되지 않을 수 있습니다.
        </p>
      </div>
    </StepSection>
  );
}

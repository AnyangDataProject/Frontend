import StepSection from "./StepSection";
import SelectableCard from "./SelectableCard";
import { SEVERITY_META } from "../../mocks/citizen/constants";

const SEVERITY_OPTIONS = Object.entries(SEVERITY_META).map(([value, meta]) => ({ value, ...meta }));

export default function ReportSeverityStep({ value, onChange }) {
  return (
    <StepSection number="04" title="파손 심각도" description="현재 도로 이용에 미치는 영향을 선택해주세요.">
      <div className="grid grid-cols-3 gap-[9px] max-[700px]:grid-cols-1">
        {SEVERITY_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
            icon={<span className="w-2.5 h-2.5 shrink-0 rounded-full" style={{ backgroundColor: option.dotColor }} />}
            label={option.label}
            description={option.description}
            radio={false}
            activeColor={option.color}
          />
        ))}
      </div>
    </StepSection>
  );
}

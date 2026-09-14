import StepSection from "./StepSection";
import SelectableCard from "./SelectableCard";
import { INQUIRY_TYPES } from "../../mocks/citizen/inquiryData";

export default function InquiryTypeStep({ value, onChange }) {
  return (
    <StepSection number="01" title="문의 유형" description="문의하실 내용을 선택해주세요." card={false}>
      <div className="grid grid-cols-2 max-[650px]:grid-cols-1 gap-[9px]">
        {INQUIRY_TYPES.map((type) => (
          <SelectableCard
            key={type.value}
            selected={value === type.value}
            onClick={() => onChange(type.value)}
            radioPosition="left"
            align="start"
            label={type.label}
            description={type.description}
          />
        ))}
      </div>
    </StepSection>
  );
}

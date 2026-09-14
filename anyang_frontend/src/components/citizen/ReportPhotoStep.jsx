import { Camera, Upload, X } from "lucide-react";
import StepSection from "./StepSection";

export default function ReportPhotoStep({ images, onChange, onRemove }) {
  return (
    <StepSection number="01" title="파손 현장 사진" description="AI 분석을 위해 파손 부위가 잘 보이도록 촬영해주세요.">
      <div className="flex items-center gap-2 py-[11px] px-[13px] mb-[13px] rounded-lg bg-slate-50 text-slate-500 text-xs text-left">
        <Camera size={18} className="text-blue-600 shrink-0" />
        <span>
          최대 3장까지 등록할 수 있습니다.
          <strong className="text-blue-600"> JPG, PNG</strong> 파일을 권장합니다.
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 max-[430px]:gap-[7px]">
        {images.map((image) => (
          <div
            className="relative bg-slate-100 rounded-lg overflow-hidden aspect-[1.4/1] max-[430px]:aspect-[1.15/1]"
            key={image.id}
          >
            <img
              src={image.preview}
              alt="도로파손 신고 이미지"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              className="absolute top-[7px] right-[7px] w-[26px] h-[26px] border-0 rounded-full bg-[rgba(20,24,22,0.72)] text-white flex items-center justify-center cursor-pointer"
              onClick={() => onRemove(image.id)}
            >
              <X size={15} />
            </button>
          </div>
        ))}

        {images.length < 3 && (
          <label className="aspect-[1.4/1] max-[430px]:aspect-[1.15/1] rounded-lg overflow-hidden border-[1.5px] border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer text-center transition-colors hover:border-blue-600 hover:bg-blue-50">
            <input type="file" accept="image/*" multiple onChange={onChange} className="hidden" />
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Upload size={22} />
            </div>
            <strong className="text-xs text-slate-900">사진 추가</strong>
            <span className="mt-[3px] text-slate-400 text-xs">{images.length}/3</span>
          </label>
        )}
      </div>
    </StepSection>
  );
}

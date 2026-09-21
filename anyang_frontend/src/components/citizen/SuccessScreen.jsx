import { CheckCircle2 } from "lucide-react";

export default function SuccessScreen({ eyebrow, title, description, summary, primaryAction, secondaryAction }) {
  return (
    <div className="text-center">
      <div className="w-[82px] h-[82px] mx-auto mb-[23px] rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
        <CheckCircle2 size={42} />
      </div>

      {eyebrow && (
        <span className="text-blue-600 text-xs font-semibold tracking-[0.13em]">{eyebrow}</span>
      )}

      <h1 className="mt-2.5 mb-3 text-xl font-semibold text-slate-900">{title}</h1>

      {description && (
        <p className="m-0 text-slate-500 text-sm leading-[1.8]">{description}</p>
      )}

      {summary && <div className="my-[30px]">{summary}</div>}

      {(primaryAction || secondaryAction) && (
        <div className="flex justify-center gap-2 max-[430px]:flex-col">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
}

import { CARD_SURFACE_CLASS } from "../StepSection";

export const SECTION_LABEL_CLASS = "text-blue-600 text-xs font-bold tracking-[0.13em] text-left";

export default function AnalysisCard({ eyebrow, title, action, className = "", children }) {
  return (
    <section className={`${CARD_SURFACE_CLASS} ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-[23px] text-left">
        <div className="flex-1 min-w-0 text-left">
          <span className={SECTION_LABEL_CLASS}>{eyebrow}</span>
          <h2 className="mt-1 text-sm font-semibold tracking-[-0.03em] text-left text-slate-900">{title}</h2>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

export default function StepSection({ number, title, description, children, card = true }) {
  const wrapperClass = card
    ? "p-7 mb-[15px] bg-white border border-slate-200 rounded-xl shadow-sm text-left max-[700px]:p-5 max-[430px]:p-[17px]"
    : "mb-[30px] border-b border-slate-200 pb-[30px] text-left";

  return (
    <section className={wrapperClass}>
      <div className="flex items-start gap-3 mb-[23px] text-left">
        <span className="w-8 h-8 min-w-8 max-w-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold mt-px">
          {number}
        </span>
        <div className="flex-1 min-w-0 text-left">
          <h2 className="m-0 mb-1 text-sm font-semibold text-slate-900 text-left">{title}</h2>
          {description && (
            <p className="m-0 text-slate-500 text-xs leading-[1.5] text-left">{description}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

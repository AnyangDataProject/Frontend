export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <section className="flex items-end justify-between mb-[30px] text-left max-[700px]:block">
      <div className="flex-1 min-w-0 text-left">
        {eyebrow && (
          <span className="text-blue-600 text-xs font-semibold tracking-[0.13em]">{eyebrow}</span>
        )}
        <h1 className="mt-2 mb-[9px] text-xl font-semibold text-slate-900 text-left">{title}</h1>
        {description && <p className="m-0 text-slate-500 text-sm text-left">{description}</p>}
      </div>

      {action && (
        <div className="flex items-center gap-2 max-[700px]:mt-4">{action}</div>
      )}
    </section>
  );
}

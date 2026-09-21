export default function InfoNotice({ icon, children, variant = "inline" }) {
  if (variant === "panel") {
    return (
      <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-[22px] text-center shadow-sm">
        <div className="mx-auto mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 mt-5 p-[14px] text-left bg-slate-50 border border-slate-200 rounded-lg">
      <div className="shrink-0 w-[18px] h-[18px] mt-px flex items-center justify-center border border-slate-300 rounded-full text-[10px] font-extrabold text-slate-400">
        {icon ?? "i"}
      </div>
      <p className="m-0 text-xs leading-relaxed text-slate-400">{children}</p>
    </div>
  );
}

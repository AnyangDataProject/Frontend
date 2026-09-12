export default function SelectableCard({
  selected,
  onClick,
  icon,
  label,
  description,
  radio = true,
  activeColor = "#2563eb",
}) {
  return (
    <button
      type="button"
      className={`relative flex min-h-[76px] items-center gap-3 rounded-lg border bg-white p-[13px] text-left cursor-pointer transition-colors ${
        selected ? "" : "border-slate-200 hover:border-blue-300"
      }`}
      style={selected ? { borderColor: activeColor, backgroundColor: `${activeColor}0D` } : undefined}
      onClick={onClick}
    >
      {icon}

      <div className="flex flex-col gap-[3px] text-left">
        <strong className="text-sm text-slate-900 text-left">{label}</strong>
        {description && <span className="text-slate-400 text-xs text-left">{description}</span>}
      </div>

      {radio && (
        <div
          className={`ml-auto flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
            selected ? "" : "border-slate-300"
          }`}
          style={selected ? { borderColor: activeColor } : undefined}
        >
          {selected && <span className="h-2 w-2 rounded-full" style={{ background: activeColor }} />}
        </div>
      )}
    </button>
  );
}

export default function SegmentedToggle({ options, value, onChange, size = "md" }) {
  const sizeClass = size === "sm" ? "px-4 py-[7px] text-xs" : "px-4 py-2 text-sm";

  return (
    <div className="flex gap-1 bg-white rounded-full p-1 shadow-[0_4px_16px_rgba(15,23,42,0.08),0_1px_3px_rgba(0,0,0,0.05)]">
      {options.map((option) => {
        const active = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            className={`flex items-center gap-1.5 border-none rounded-full font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 ${sizeClass} ${
              active ? "bg-slate-900 text-white" : "bg-transparent text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => onChange(option.value)}
          >
            {Icon && <Icon size={14} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

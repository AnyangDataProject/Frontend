export default function Checkbox({ checked, onChange, label, emphasized = false }) {
  return (
    <label
      className={`relative flex items-center cursor-pointer ${
        emphasized ? "gap-2.5 text-sm font-semibold text-slate-900" : "gap-2 text-xs text-slate-500"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="absolute opacity-0 pointer-events-none"
      />

      <span
        className={`relative w-[18px] h-[18px] shrink-0 box-border rounded border transition-colors ${
          checked ? "bg-blue-600 border-blue-600" : "bg-white border-slate-200"
        }`}
      >
        {checked && (
          <span className="absolute left-[5px] top-[2px] h-2 w-1 rotate-45 border-b-2 border-r-2 border-white" />
        )}
      </span>

      <span className="break-keep">{label}</span>
    </label>
  );
}

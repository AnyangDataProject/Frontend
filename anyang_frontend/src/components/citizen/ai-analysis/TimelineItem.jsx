import { CheckCircle2 } from "lucide-react";

export default function TimelineItem({ title, description, active, done, last }) {
  return (
    <div className={`relative flex items-start gap-3 ${active ? "opacity-100" : "opacity-50"}`}>
      <div
        className={`w-6 h-6 shrink-0 rounded-full border-[1.5px] bg-white flex items-center justify-center z-[2] ${
          done
            ? "bg-blue-600 border-blue-600 text-white"
            : active
              ? "border-blue-600 text-blue-600"
              : "border-slate-200"
        }`}
      >
        {done ? (
          <CheckCircle2 size={17} />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-600" : "bg-slate-200"}`} />
        )}
      </div>

      {!last && (
        <div className="absolute left-[11px] top-6 w-px h-[calc(100%+14px)] bg-slate-200" />
      )}

      <div>
        <strong className="block text-sm font-medium text-slate-900">{title}</strong>
        <p className="mt-0.5 text-slate-500 text-xs">{description}</p>
      </div>
    </div>
  );
}

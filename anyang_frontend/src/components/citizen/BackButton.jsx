import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ to, label = "지도 돌아가기", onClick }) {
  const navigate = useNavigate();

  const handleClick = onClick ?? (() => navigate(to ?? "/"));

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 p-0 border-0 bg-transparent text-slate-500 text-sm font-medium cursor-pointer transition-colors hover:text-slate-900"
      onClick={handleClick}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}

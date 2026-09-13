import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthLinksRow({ links }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center mt-6">
      {links.map((link, index) => (
        <Fragment key={link.to ?? link.label}>
          {index > 0 && <span className="w-px h-[10px] bg-slate-200" />}
          <button
            type="button"
            onClick={link.onClick ?? (() => navigate(link.to))}
            className="px-3 max-[480px]:px-2 border-none bg-transparent font-inherit text-xs max-[480px]:text-[11px] font-medium text-slate-500 cursor-pointer transition-colors hover:text-blue-600"
          >
            {link.label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

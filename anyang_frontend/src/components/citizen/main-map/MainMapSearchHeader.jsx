import { Camera, Search, Map as MapGlyph, List as ListIcon } from "lucide-react";
import SegmentedToggle from "../SegmentedToggle";

export default function MainMapSearchHeader({
  listOpen,
  onToggleListOpen,
  searchText,
  onSearchTextChange,
  onSearchSubmit,
  searchError,
  onReport,
}) {
  return (
    <>
      <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center gap-2.5 pointer-events-none">
        <div className="pointer-events-auto shrink-0">
          <SegmentedToggle
            options={[
              { value: "map", label: "지도", icon: MapGlyph },
              { value: "list", label: "신고 목록", icon: ListIcon },
            ]}
            value={listOpen ? "list" : "map"}
            onChange={(v) => onToggleListOpen(v === "list")}
          />
        </div>

        <form
          className="pointer-events-auto flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[0_4px_16px_rgba(15,23,42,0.08),0_1px_3px_rgba(0,0,0,0.05)] text-slate-500 flex-1 basis-[200px] max-w-[280px] min-w-0 border border-transparent transition-all duration-200 focus-within:border-slate-900 focus-within:shadow-[0_4px_20px_rgba(15,23,42,0.12)] max-[900px]:order-4 max-[900px]:basis-full max-[900px]:max-w-none"
          onSubmit={onSearchSubmit}
        >
          <Search size={13} />
          <input
            className="border-none outline-none bg-transparent text-sm text-slate-900 flex-1 min-w-0 placeholder:text-slate-500 placeholder:opacity-70"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            placeholder="도로명 주소 검색"
            aria-label="도로명 주소 검색"
          />
        </form>

        <button
          className="pointer-events-auto ml-auto flex items-center gap-1.5 bg-blue-600 text-white border-none px-[18px] py-[9px] rounded-full text-sm font-semibold cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.3)] shrink-0 whitespace-nowrap transition-all duration-200 hover:bg-blue-700 hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.38)]"
          onClick={onReport}
        >
          <Camera size={14} />
          신고하기
        </button>
      </header>

      {searchError && (
        <div className="absolute top-[66px] left-4 z-20 bg-red-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-[0_4px_12px_rgba(220,38,38,0.25)] animate-[tvFadeIn_0.2s_ease]">
          {searchError}
        </div>
      )}
    </>
  );
}
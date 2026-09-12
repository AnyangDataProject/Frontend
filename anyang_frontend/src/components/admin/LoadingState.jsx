export default function LoadingState({ label = '불러오는 중...', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-16 text-sm text-slate-400 ${className}`}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      {label}
    </div>
  );
}

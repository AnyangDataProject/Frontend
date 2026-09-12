import { useEffect } from 'react';

/**
 * 관리자 페이지 공통 레이아웃.
 * 상단 Header(공용 컴포넌트)는 App 레벨에서 렌더링되고, 이 컴포넌트는 그 아래 콘텐츠 영역을 담당한다.
 * body에 admin-mode 클래스를 붙여 시민 화면 전용 레이아웃 폭 제한(index.css의 #root 고정폭)을 해제한다.
 */
export default function AdminLayout({ title, description, actions, children }) {
  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => document.body.classList.remove('admin-mode');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-[72px]">
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        {(title || actions) && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && <h1 className="text-xl font-semibold text-slate-900">{title}</h1>}
              {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

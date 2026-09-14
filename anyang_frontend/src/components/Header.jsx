import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import MessageModal from './citizen/MessageModal';

const MENU_BASE =
  'relative px-3 py-2.5 text-sm font-medium transition-colors max-[1000px]:px-2 max-[1000px]:text-[13px] max-[768px]:px-1.5 max-[768px]:text-xs max-[560px]:px-[5px] max-[560px]:text-[11px]';

const ACTIVE_UNDERLINE =
  "after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-px after:h-0.5 after:bg-blue-600";

function menuClass(isActive) {
  return `${MENU_BASE} ${
    isActive ? `text-blue-600 font-bold ${ACTIVE_UNDERLINE}` : 'text-[#5B6472] hover:text-blue-600'
  }`;
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, sessionExpired, dismissSessionExpired } = useAuth();

  const isAdmin = location.pathname.startsWith('/admin');

  const [showLogoutNotice, setShowLogoutNotice] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutNotice(true);
    navigate('/');
  };

  return (
    <>
    <header className="fixed top-0 left-0 z-[1000] h-[72px] w-full border-b border-[#C9D0D9] bg-white max-[768px]:h-16">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-10 max-[1000px]:px-[25px] max-[768px]:px-5 max-[560px]:px-3.5">

        {/* 로고 */}
        <div
          className="flex shrink-0 cursor-pointer select-none items-center gap-2.5"
          onClick={() => navigate(isAdmin ? '/admin' : '/')}
        >
          <span className="text-xl font-extrabold tracking-[-0.5px] text-blue-600 max-[768px]:text-lg">
            ANYANG
          </span>

          <span className="border-l border-[#C9D0D9] pl-2.5 text-base font-semibold text-[#23262B] max-[768px]:text-sm max-[560px]:hidden">
            {isAdmin ? '시민안전 관리자' : '시민안전'}
          </span>
        </div>


        {/* =========================
            시민 메뉴
        ========================= */}

        {!isAdmin && (
          <nav className="flex items-center gap-1 max-[1000px]:gap-0 max-[768px]:gap-0.5">

            <button
              className={`${MENU_BASE} text-blue-600 font-bold hover:text-[#1D4ED8] ${
                location.pathname === '/report' ? ACTIVE_UNDERLINE : ''
              }`}
              onClick={() => navigate('/report')}
            >
              파손 신고하기
            </button>

            <button
              className={menuClass(location.pathname.startsWith('/my-reports'))}
              onClick={() => navigate('/my-reports')}
            >
              내 신고현황 보기
            </button>

            <button
              className={menuClass(location.pathname.startsWith('/inquiry'))}
              onClick={() => navigate('/inquiry')}
            >
              문의하기
            </button>

            {user ? (
              <>
                <span className="ml-2 px-3.5 py-2.5 text-sm font-medium text-[#23262B] max-[768px]:px-[7px] max-[560px]:hidden">
                  {user.name}님
                </span>

                <button
                  className="rounded-lg bg-gradient-to-br from-[#5B8DEF] to-blue-600 px-[18px] py-2.5 text-sm font-medium text-white transition-[filter] hover:brightness-105 max-[768px]:px-2.5 max-[768px]:py-2 max-[560px]:px-[9px] max-[560px]:py-[7px]"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  className="ml-2 px-3.5 py-2.5 text-sm font-medium text-[#5B6472] transition-colors hover:text-blue-600 max-[768px]:ml-1 max-[768px]:px-[7px] max-[560px]:hidden"
                  onClick={() => navigate('/login')}
                >
                  로그인
                </button>

                <button
                  className="rounded-lg bg-gradient-to-br from-[#5B8DEF] to-blue-600 px-[18px] py-2.5 text-sm font-medium text-white transition-[filter] hover:brightness-105 max-[768px]:px-2.5 max-[768px]:py-2 max-[560px]:px-[9px] max-[560px]:py-[7px]"
                  onClick={() => navigate('/signup')}
                >
                  회원가입
                </button>
              </>
            )}

          </nav>
        )}


        {/* =========================
            관리자 메뉴
        ========================= */}

        {isAdmin && (
          <nav className="flex items-center gap-1">

            <button
              className={menuClass(location.pathname === '/admin')}
              onClick={() => navigate('/admin')}
            >
              대시보드
            </button>

            <button
              className={menuClass(location.pathname.startsWith('/admin/reports'))}
              onClick={() => navigate('/admin/reports')}
            >
              신고 관리
            </button>

            <button
              className={menuClass(
                location.pathname.startsWith('/admin/priority') ||
                  location.pathname.startsWith('/admin/roads')
              )}
              onClick={() => navigate('/admin/priority')}
            >
              점검 우선순위
            </button>

            <button
              className={menuClass(location.pathname.startsWith('/admin/members'))}
              onClick={() => navigate('/admin/members')}
            >
              회원 관리
            </button>

            <button
              className={menuClass(location.pathname.startsWith('/admin/inquiries'))}
              onClick={() => navigate('/admin/inquiries')}
            >
              문의 관리
            </button>

            {user && (
              <span className="ml-2 px-1.5 text-sm font-medium text-[#23262B] max-[768px]:hidden">
                {user.name}님
              </span>
            )}

            <button
              className="h-9 rounded-md border border-[#C9D0D9] bg-white px-3.5 text-xs font-semibold text-[#5B6472] transition-colors hover:border-[#C1432D] hover:text-[#C1432D]"
              onClick={handleLogout}
            >
              로그아웃
            </button>

          </nav>
        )}

      </div>
    </header>

    <MessageModal
      open={sessionExpired}
      onClose={dismissSessionExpired}
      variant="error"
      message="로그인이 만료되었습니다. 다시 로그인해주세요."
    />

    <MessageModal
      open={showLogoutNotice}
      onClose={() => setShowLogoutNotice(false)}
      variant="info"
      message="로그아웃되었습니다."
    />
    </>
  );
}

export default Header;

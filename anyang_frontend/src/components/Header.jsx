import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className={`header ${isAdmin ? 'header-admin' : ''}`}>

      <div className="header-inner">

        {/* 로고 */}
        <div
          className="header-logo"
          onClick={() =>
            navigate(isAdmin ? '/admin' : '/')
          }
        >
          <span className="logo-city">
            ANYANG
          </span>

          <span className="logo-service">
            {isAdmin ? '시민안전 관리자' : '시민안전'}
          </span>
        </div>


        {/* =========================
            시민 메뉴
        ========================= */}

        {!isAdmin && (
          <nav className="header-nav">

            <button
              className="header-menu header-report"
              onClick={() => navigate('/report')}
            >
              파손 신고하기
            </button>

            <button
              className="header-menu"
              onClick={() => navigate('/my-reports')}
            >
              내 신고현황 보기
            </button>

            <button
              className="header-menu"
              onClick={() => navigate('/inquiry')}
            >
              문의하기
            </button>

            <button
              className="header-login"
              onClick={() => navigate('/login')}
            >
              로그인
            </button>

            <button
              className="header-signup"
              onClick={() => navigate('/signup')}
            >
              회원가입
            </button>

          </nav>
        )}


        {/* =========================
            관리자 메뉴
        ========================= */}

        {isAdmin && (
          <nav className="header-nav header-admin-nav">

            <button
              className={
                location.pathname === '/admin'
                  ? 'header-menu active'
                  : 'header-menu'
              }
              onClick={() => navigate('/admin')}
            >
              대시보드
            </button>

            <button
              className={
                location.pathname.startsWith('/admin/reports')
                  ? 'header-menu active'
                  : 'header-menu'
              }
              onClick={() => navigate('/admin/reports')}
            >
              신고 관리
            </button>

            <button
              className={
                location.pathname.startsWith('/admin/priority') ||
                location.pathname.startsWith('/admin/roads')
                  ? 'header-menu active'
                  : 'header-menu'
              }
              onClick={() =>
                navigate('/admin/priority')
              }
            >
              점검 우선순위
            </button>

            <button
              className={
                location.pathname.startsWith('/admin/members')
                  ? 'header-menu active'
                  : 'header-menu'
              }
              onClick={() => navigate('/admin/members')}
            >
              회원 관리
            </button>

            <button
              className={
                location.pathname.startsWith('/admin/inquiries')
                  ? 'header-menu active'
                  : 'header-menu'
              }
              onClick={() =>
                navigate('/admin/inquiries')
              }
            >
              문의 관리
            </button>

            <button
              className="header-logout"
              onClick={() => navigate('/login')}
            >
              로그아웃
            </button>

          </nav>
        )}

      </div>

    </header>
  );
}

export default Header;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: 추후 백엔드 일반 로그인 API 연결
    console.log('로그인 요청:', form);
  };

  // 소셜 로그인
  const handleSocialLogin = (provider) => {
    // TODO: 추후 Spring Boot OAuth2 로그인 API 연결
    console.log(`${provider} 로그인`);

    /*
      추후 예시

      window.location.href =
        `http://localhost:8080/oauth2/authorization/${provider}`;
    */
  };

  return (
    <div className="login-page">
      <Header />

      <main className="login-main">
        <section className="login-container">

          {/* 로그인 타이틀 */}
          <div className="login-title">
            <h1>로그인</h1>
            <p>
              안양시 시민안전 서비스에<br />
              로그인해주세요.
            </p>
          </div>

          {/* 로그인 카드 */}
          <div className="login-card">

            <form onSubmit={handleSubmit}>

              {/* 이메일 */}
              <div className="input-group">
                <label htmlFor="email">
                  이메일
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력해주세요"
                  autoComplete="email"
                />
              </div>

              {/* 비밀번호 */}
              <div className="input-group">
                <label htmlFor="password">
                  비밀번호
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력해주세요"
                  autoComplete="current-password"
                />
              </div>

              {/* 로그인 상태 유지 */}
              <div className="login-options">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />

                  <span className="custom-checkbox"></span>

                  <span>로그인 상태 유지</span>
                </label>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                className="login-button"
              >
                로그인
              </button>

            </form>

            {/* 소셜 로그인 */}
            <div className="social-login">

              <div className="social-divider">
                <span>또는</span>
              </div>

              <div className="social-buttons">

                {/* Google */}
                <button
                  type="button"
                  className="social-button google"
                  onClick={() => handleSocialLogin('google')}
                >
                  <span className="social-icon google-icon">
                    G
                  </span>

                  <span>Google로 로그인</span>
                </button>

                {/* Kakao */}
                <button
                  type="button"
                  className="social-button kakao"
                  onClick={() => handleSocialLogin('kakao')}
                >
                  <span className="social-icon kakao-icon">
                    K
                  </span>

                  <span>카카오로 로그인</span>
                </button>

                {/* Naver */}
                <button
                  type="button"
                  className="social-button naver"
                  onClick={() => handleSocialLogin('naver')}
                >
                  <span className="social-icon naver-icon">
                    N
                  </span>

                  <span>네이버로 로그인</span>
                </button>

              </div>
            </div>

            {/* 하단 메뉴 */}
            <div className="login-links">
              <button
                type="button"
                onClick={() => navigate('/find-id')}
                >
                아이디 찾기
                </button>

              <span></span>

              <button
                type="button"
                onClick={() => navigate('/find-password')}
                >
                비밀번호 찾기
                </button>

              <span></span>

              <button
                type="button"
                onClick={() => navigate('/signup')}
              >
                회원가입
              </button>
            </div>

          </div>

          {/* 안내 문구 */}
          <div className="login-info">
            <div className="info-icon">i</div>

            <p>
              안양시 시민안전 서비스는 시민 여러분의
              <br />
              안전하고 편리한 생활을 위해 운영됩니다.
            </p>
          </div>

        </section>
      </main>
    </div>
  );
}

export default Login;
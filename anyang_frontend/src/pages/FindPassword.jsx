import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './FindPassword.css';

function FindPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
  });

  const [result, setResult] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: 추후 백엔드 비밀번호 찾기 API 연결
    console.log('비밀번호 찾기 요청:', form);

    // 임시 결과
    setResult(true);
  };

  const handleReset = () => {
    setForm({
      email: '',
    });

    setResult(false);
  };

  return (
    <div className="find-password-page">
      <Header />

      <main className="find-password-main">
        <section className="find-password-container">

          {/* 타이틀 */}
          <div className="find-password-title">
            <h1>비밀번호 찾기</h1>
            <p>
              가입한 이메일을 입력하면<br />
              비밀번호를 재설정할 수 있습니다.
            </p>
          </div>

          {/* 카드 */}
          <div className="find-password-card">

            {!result ? (
              <>
                <form onSubmit={handleSubmit}>

                  {/* 이메일 */}
                  <div className="find-password-input-group">
                    <label htmlFor="password-email">
                      가입 이메일
                    </label>

                    <input
                      id="password-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="가입할 때 사용한 이메일을 입력해주세요"
                      autoComplete="email"
                      required
                    />
                  </div>

                  {/* 찾기 버튼 */}
                  <button
                    type="submit"
                    className="find-password-button"
                  >
                    비밀번호 찾기
                  </button>

                </form>

                {/* 안내 */}
                <div className="find-password-notice">
                  <div className="find-password-notice-icon">
                    i
                  </div>

                  <p>
                    가입한 이메일로 비밀번호 재설정 안내를<br />
                    보내드립니다.
                  </p>
                </div>
              </>
            ) : (
              /* 결과 */
              <div className="find-password-result">

                <div className="find-password-result-icon">
                  ✓
                </div>

                <h2>메일을 확인해주세요.</h2>

                <p>
                  입력하신 이메일로 비밀번호 재설정<br />
                  안내 메일을 보내드렸습니다.
                </p>

                <div className="find-password-result-box">
                  <span>전송된 이메일</span>
                  <strong>{form.email}</strong>
                </div>

                <div className="find-password-result-message">
                  <p>
                    이메일이 도착하지 않았다면<br />
                    스팸 메일함을 확인해주세요.
                  </p>
                </div>

                <div className="find-password-result-actions">

                  <button
                    type="button"
                    className="find-password-login-button"
                    onClick={() => navigate('/login')}
                  >
                    로그인하기
                  </button>

                  <button
                    type="button"
                    className="find-password-again-button"
                    onClick={handleReset}
                  >
                    다시 찾기
                  </button>

                </div>

              </div>
            )}

            {/* 하단 메뉴 */}
            <div className="find-password-links">

              <button
                type="button"
                onClick={() => navigate('/login')}
              >
                로그인
              </button>

              <span></span>

              <button
                type="button"
                onClick={() => navigate('/find-id')}
              >
                아이디 찾기
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

        </section>
      </main>
    </div>
  );
}

export default FindPassword;
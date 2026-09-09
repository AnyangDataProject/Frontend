import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './FindId.css';

function FindId() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: 추후 백엔드 아이디 찾기 API 연결
    console.log('아이디 찾기 요청:', form);

    // 임시 결과
    setResult({
      email: 'ho****@gmail.com',
    });
  };

  const handleReset = () => {
    setForm({
      name: '',
      email: '',
    });

    setResult(null);
  };

  return (
    <div className="find-id-page">
      <Header />

      <main className="find-id-main">
        <section className="find-id-container">

          {/* 타이틀 */}
          <div className="find-id-title">
            <h1>아이디 찾기</h1>
            <p>
              가입할 때 입력한 정보를 통해<br />
              아이디를 찾아보세요.
            </p>
          </div>

          {/* 카드 */}
          <div className="find-id-card">

            {!result ? (
              <>
                <form onSubmit={handleSubmit}>

                  {/* 이름 */}
                  <div className="find-id-input-group">
                    <label htmlFor="name">
                      이름
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="이름을 입력해주세요"
                      autoComplete="name"
                      required
                    />
                  </div>

                  {/* 이메일 */}
                  <div className="find-id-input-group">
                    <label htmlFor="email">
                      가입 이메일
                    </label>

                    <input
                      id="email"
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
                    className="find-id-button"
                  >
                    아이디 찾기
                  </button>

                </form>

                {/* 안내 */}
                <div className="find-id-notice">
                  <div className="find-id-notice-icon">
                    i
                  </div>

                  <p>
                    가입 시 입력한 이름과 이메일이<br />
                    회원정보와 일치해야 아이디를 찾을 수 있습니다.
                  </p>
                </div>
              </>
            ) : (
              /* 결과 */
              <div className="find-id-result">

                <div className="find-id-result-icon">
                  ✓
                </div>

                <h2>아이디를 찾았습니다.</h2>

                <p>
                  회원님의 아이디가 등록된 이메일로<br />
                  안내되었습니다.
                </p>

                <div className="find-id-result-box">
                  <span>가입 이메일</span>
                  <strong>{result.email}</strong>
                </div>

                <div className="find-id-result-actions">

                  <button
                    type="button"
                    className="find-id-login-button"
                    onClick={() => navigate('/login')}
                  >
                    로그인하기
                  </button>

                  <button
                    type="button"
                    className="find-id-again-button"
                    onClick={handleReset}
                  >
                    다시 찾기
                  </button>

                </div>

              </div>
            )}

            {/* 하단 메뉴 */}
            <div className="find-id-links">

              <button
                type="button"
                onClick={() => navigate('/login')}
              >
                로그인
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

        </section>
      </main>
    </div>
  );
}

export default FindId;
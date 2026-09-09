import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
  });

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgreementChange = (name) => {
    setAgreements((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleAgreeAll = (e) => {
    const checked = e.target.checked;

    setAgreeAll(checked);

    setAgreements({
      service: checked,
      privacy: checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (!form.email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    if (!form.password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!form.phone.trim()) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    if (!agreements.service || !agreements.privacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    // TODO: 추후 회원가입 API 연결
    console.log('회원가입 요청:', form);

    alert('회원가입이 완료되었습니다.');

    navigate('/login');
  };

  return (
    <div className="signup-page">
      <Header />

      <main className="signup-main">
        <section className="signup-container">

          {/* 타이틀 */}
          <div className="signup-title">
            <h1>회원가입</h1>
            <p>
              안양시 시민안전 서비스를 이용하기 위해<br />
              회원가입을 진행해주세요.
            </p>
          </div>

          {/* 회원가입 카드 */}
          <div className="signup-card">

            <form onSubmit={handleSubmit}>

              {/* 이름 */}
              <div className="signup-input-group">
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
                />
              </div>

              {/* 이메일 */}
              <div className="signup-input-group">
                <label htmlFor="email">
                  이메일
                </label>

                <div className="email-input-row">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력해주세요"
                    autoComplete="email"
                  />

                  <button
                    type="button"
                    className="duplicate-button"
                  >
                    중복확인
                  </button>
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="signup-input-group">
                <label htmlFor="password">
                  비밀번호
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="영문, 숫자를 포함하여 8자 이상 입력"
                  autoComplete="new-password"
                />

                <p className="input-help">
                  영문과 숫자를 포함하여 8자 이상 입력해주세요.
                </p>
              </div>

              {/* 비밀번호 확인 */}
              <div className="signup-input-group">
                <label htmlFor="passwordConfirm">
                  비밀번호 확인
                </label>

                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  placeholder="비밀번호를 다시 입력해주세요"
                  autoComplete="new-password"
                />

                {form.passwordConfirm &&
                  form.password !== form.passwordConfirm && (
                    <p className="input-error">
                      비밀번호가 일치하지 않습니다.
                    </p>
                  )}

                {form.passwordConfirm &&
                  form.password === form.passwordConfirm && (
                    <p className="input-success">
                      비밀번호가 일치합니다.
                    </p>
                  )}
              </div>

              {/* 휴대폰 번호 */}
              <div className="signup-input-group">
                <label htmlFor="phone">
                  휴대폰 번호
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  autoComplete="tel"
                />
              </div>

              {/* 약관 */}
              <div className="agreement-section">

                <label className="agreement-all">
                  <input
                    type="checkbox"
                    checked={agreeAll}
                    onChange={handleAgreeAll}
                  />

                  <span className="agreement-checkbox"></span>

                  <strong>전체 약관에 동의합니다.</strong>
                </label>

                <div className="agreement-divider"></div>

                <label className="agreement-item">
                  <input
                    type="checkbox"
                    checked={agreements.service}
                    onChange={() =>
                      handleAgreementChange('service')
                    }
                  />

                  <span className="agreement-checkbox"></span>

                  <span>
                    <b>[필수]</b> 서비스 이용약관에 동의합니다.
                  </span>

                  <button
                    type="button"
                    className="agreement-detail"
                  >
                    보기
                  </button>
                </label>

                <label className="agreement-item">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={() =>
                      handleAgreementChange('privacy')
                    }
                  />

                  <span className="agreement-checkbox"></span>

                  <span>
                    <b>[필수]</b> 개인정보 수집 및 이용에 동의합니다.
                  </span>

                  <button
                    type="button"
                    className="agreement-detail"
                  >
                    보기
                  </button>
                </label>

              </div>

              {/* 가입 버튼 */}
              <button
                type="submit"
                className="signup-button"
              >
                회원가입
              </button>

            </form>

            {/* 로그인으로 이동 */}
            <div className="already-member">
              <span>이미 회원이신가요?</span>

              <button
                type="button"
                onClick={() => navigate('/login')}
              >
                로그인
              </button>
            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default Signup;


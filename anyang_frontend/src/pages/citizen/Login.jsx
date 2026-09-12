import { useState } from 'react';
import AuthCardShell from '../../components/citizen/AuthCardShell';
import Checkbox from '../../components/citizen/Checkbox';
import InfoNotice from '../../components/citizen/InfoNotice';
import AuthLinksRow from '../../components/citizen/AuthLinksRow';

function Login() {
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
    <AuthCardShell
      title="로그인"
      description={
        <>
          안양시 시민안전 서비스에
          <br />
          로그인해주세요.
        </>
      }
      footer={
        <InfoNotice>
          안양시 시민안전 서비스는 시민 여러분의
          <br />
          안전하고 편리한 생활을 위해 운영됩니다.
        </InfoNotice>
      }
    >
      <form onSubmit={handleSubmit}>

        {/* 이메일 */}
        <div className="mb-[18px] text-left">
          <label htmlFor="email" className="block mb-2 text-xs font-medium text-slate-700">
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
            className="w-full h-12 px-[14px] box-border border border-slate-200 rounded-lg outline-none font-inherit text-sm text-slate-900 bg-white transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-[18px] text-left">
          <label htmlFor="password" className="block mb-2 text-xs font-medium text-slate-700">
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
            className="w-full h-12 px-[14px] box-border border border-slate-200 rounded-lg outline-none font-inherit text-sm text-slate-900 bg-white transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
          />
        </div>

        {/* 로그인 상태 유지 */}
        <div className="flex items-center my-1 mb-5">
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label="로그인 상태 유지"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full h-12 border-none rounded-lg bg-blue-600 text-white font-inherit text-sm font-semibold cursor-pointer transition-[background-color,transform] hover:bg-blue-700 active:translate-y-px"
        >
          로그인
        </button>

      </form>

      {/* 소셜 로그인 */}
      <div className="mt-6">

        <div className="flex items-center w-full mb-4">
          <span className="flex-1 h-px bg-slate-200" />
          <span className="mx-3 text-xs text-slate-400 whitespace-nowrap">또는</span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="flex flex-col gap-2">

          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="relative w-full h-12 flex items-center justify-center border border-slate-200 rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-transform bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 active:translate-y-0"
          >
            <span className="absolute left-4 w-[22px] h-[22px] flex items-center justify-center text-[15px] font-extrabold text-[#4285f4] font-[Arial,sans-serif]">
              G
            </span>

            <span>Google로 로그인</span>
          </button>

          {/* Naver */}
          <button
            type="button"
            onClick={() => handleSocialLogin('naver')}
            className="relative w-full h-12 flex items-center justify-center border border-[#03C75A] rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-colors bg-[#03C75A] text-white hover:bg-[#02b351] hover:border-[#02b351]"
          >
            <span className="absolute left-4 w-[22px] h-[22px] flex items-center justify-center text-[15px] font-extrabold text-white font-[Arial,sans-serif]">
              N
            </span>

            <span>네이버로 로그인</span>
          </button>

        </div>
      </div>

      {/* 하단 메뉴 */}
      <AuthLinksRow
        links={[
          { label: '아이디 찾기', to: '/find-id' },
          { label: '비밀번호 찾기', to: '/find-password' },
          { label: '회원가입', to: '/signup' },
        ]}
      />
    </AuthCardShell>
  );
}

export default Login;

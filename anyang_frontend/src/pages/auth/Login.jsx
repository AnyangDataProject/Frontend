import { useState } from 'react';
import AuthCardShell from '../../components/auth/AuthCardShell';
import Checkbox from '../../components/citizen/Checkbox';
import InfoNotice from '../../components/citizen/InfoNotice';
import AuthLinksRow from '../../components/auth/AuthLinksRow';

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
            <span className="absolute left-4 w-[22px] h-[22px] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M23.04 12.2613C23.04 11.4459 22.9668 10.6618 22.8309 9.90906H12V14.3575H18.1891C17.9225 15.795 17.1123 17.0129 15.8943 17.8284V20.7138H19.6109C21.7855 18.7118 23.04 15.7636 23.04 12.2613Z" fill="#4285F4" />
                <path fillRule="evenodd" clipRule="evenodd" d="M12 23.4998C15.105 23.4998 17.7081 22.47 19.6109 20.7137L15.8943 17.8282C14.8645 18.5182 13.5472 18.9259 12 18.9259C9.00474 18.9259 6.46951 16.903 5.56519 14.1848H1.72314V17.1644C3.61542 20.9228 7.50451 23.4998 12 23.4998Z" fill="#34A853" />
                <path fillRule="evenodd" clipRule="evenodd" d="M5.56523 14.1851C5.33523 13.4951 5.20455 12.7581 5.20455 12.0001C5.20455 11.2422 5.33523 10.5051 5.56523 9.81512V6.83557H1.72318C0.944318 8.38807 0.5 10.1444 0.5 12.0001C0.5 13.8558 0.944318 15.6122 1.72318 17.1647L5.56523 14.1851Z" fill="#FBBC05" />
                <path fillRule="evenodd" clipRule="evenodd" d="M12 5.07386C13.6884 5.07386 15.2043 5.65409 16.3961 6.79364L19.6945 3.49523C17.7029 1.63955 15.0997 0.5 12 0.5C7.50451 0.5 3.61542 3.07705 1.72314 6.83545L5.56519 9.815C6.46951 7.09682 9.00474 5.07386 12 5.07386Z" fill="#EA4335" />
              </svg>
            </span>

            <span>Google로 로그인</span>
          </button>

          {/* Naver */}
          <button
            type="button"
            onClick={() => handleSocialLogin('naver')}
            className="relative w-full h-12 flex items-center justify-center border border-[#03C75A] rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-colors bg-[#03C75A] text-white hover:bg-[#02b351] hover:border-[#02b351]"
          >
            <span className="absolute left-4 w-[22px] h-[22px] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.8491 8.56267L4.91687 0H0V16H5.15088V7.436L11.0831 16H16V0H10.8491V8.56267Z" fill="white" />
              </svg>
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

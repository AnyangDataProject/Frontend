import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 text-left">
      <Header />

      <main className="min-h-screen flex justify-center items-start pt-[120px] max-[768px]:pt-[60px] max-[480px]:pt-10 px-4 pb-10">
        <section className="w-full max-w-[440px]">

          {/* 로그인 타이틀 */}
          <div className="text-center mb-7">
            <h1 className="m-0 mb-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
              로그인
            </h1>
            <p className="m-0 text-sm leading-relaxed text-slate-500">
              안양시 시민안전 서비스에<br />
              로그인해주세요.
            </p>
          </div>

          {/* 로그인 카드 */}
          <div className="w-full box-border px-7 pt-8 pb-7 max-[768px]:px-5 max-[768px]:pt-[26px] max-[768px]:pb-6 max-[480px]:px-4 max-[480px]:pt-[22px] max-[480px]:pb-5 bg-white border border-slate-200 rounded-xl shadow-sm">

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
                <label className="relative flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="absolute opacity-0 pointer-events-none"
                  />

                  <span
                    className={`relative w-[18px] h-[18px] box-border rounded border transition-colors ${
                      rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'
                    }`}
                  >
                    {rememberMe && (
                      <span className="absolute left-[5px] top-[2px] h-2 w-1 rotate-45 border-b-2 border-r-2 border-white" />
                    )}
                  </span>

                  <span>로그인 상태 유지</span>
                </label>
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
            <div className="flex items-center justify-center mt-6">
              <button
                type="button"
                onClick={() => navigate('/find-id')}
                className="px-3 max-[480px]:px-2 border-none bg-transparent font-inherit text-xs max-[480px]:text-[11px] font-medium text-slate-500 cursor-pointer transition-colors hover:text-blue-600"
              >
                아이디 찾기
              </button>

              <span className="w-px h-[10px] bg-slate-200" />

              <button
                type="button"
                onClick={() => navigate('/find-password')}
                className="px-3 max-[480px]:px-2 border-none bg-transparent font-inherit text-xs max-[480px]:text-[11px] font-medium text-slate-500 cursor-pointer transition-colors hover:text-blue-600"
              >
                비밀번호 찾기
              </button>

              <span className="w-px h-[10px] bg-slate-200" />

              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="px-3 max-[480px]:px-2 border-none bg-transparent font-inherit text-xs max-[480px]:text-[11px] font-medium text-slate-500 cursor-pointer transition-colors hover:text-blue-600"
              >
                회원가입
              </button>
            </div>

          </div>

          {/* 안내 문구 */}
          <div className="flex items-start justify-center gap-2.5 mt-5 p-[14px] text-left bg-slate-50 border border-slate-200 rounded-lg">
            <div className="shrink-0 w-[18px] h-[18px] mt-px flex items-center justify-center border border-slate-300 rounded-full text-[10px] font-extrabold text-slate-400">
              i
            </div>

            <p className="m-0 text-xs leading-relaxed text-slate-400">
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

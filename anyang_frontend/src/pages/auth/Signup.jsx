import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCardShell from '../../components/auth/AuthCardShell';
import Checkbox from '../../components/citizen/Checkbox';

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
  });

  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
  });
  const agreeAll = agreements.service && agreements.privacy;

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

  // 소셜 회원가입
  const handleSocialSignup = (provider) => {
    // TODO: 추후 Spring Boot OAuth2 회원가입 API 연결
    console.log(`${provider} 회원가입`);

    /*
      추후 예시

      window.location.href =
        `http://localhost:8080/oauth2/authorization/${provider}`;
    */
  };

  const inputClass =
    'w-full h-12 px-[14px] box-border border border-slate-200 rounded-lg outline-none font-inherit text-sm text-slate-900 bg-white transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  return (
    <AuthCardShell
      title="회원가입"
      description={
        <>
          안양시 시민안전 서비스를 이용하기 위해
          <br />
          회원가입을 진행해주세요.
        </>
      }
      maxWidth={480}
    >
      <form onSubmit={handleSubmit}>

        {/* 이름 */}
        <div className="mb-[18px] text-left">
          <label htmlFor="name" className="block mb-2 text-xs font-medium text-slate-700">
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
            className={inputClass}
          />
        </div>

        {/* 이메일 */}
        <div className="mb-[18px] text-left">
          <label htmlFor="email" className="block mb-2 text-xs font-medium text-slate-700">
            이메일
          </label>

          <div className="flex gap-2">
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력해주세요"
              autoComplete="email"
              className={`flex-1 min-w-0 ${inputClass}`}
            />

            <button
              type="button"
              className="w-[88px] max-[480px]:w-20 h-12 shrink-0 border border-slate-200 rounded-lg bg-white font-inherit text-xs font-semibold text-slate-500 cursor-pointer transition-colors hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
            >
              중복확인
            </button>
          </div>
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
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-[18px] text-left">
          <label htmlFor="passwordConfirm" className="block mb-2 text-xs font-medium text-slate-700">
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
            className={inputClass}
          />

          {form.passwordConfirm &&
            form.password !== form.passwordConfirm && (
              <p className="mt-1.5 mb-0 text-xs text-red-600">
                비밀번호가 일치하지 않습니다.
              </p>
            )}

          {form.passwordConfirm &&
            form.password === form.passwordConfirm && (
              <p className="mt-1.5 mb-0 text-xs text-emerald-600">
                비밀번호가 일치합니다.
              </p>
            )}
        </div>

        {/* 휴대폰 번호 */}
        <div className="mb-[18px] text-left">
          <label htmlFor="phone" className="block mb-2 text-xs font-medium text-slate-700">
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
            className={inputClass}
          />
        </div>

        {/* 약관 */}
        <div className="mt-6 mb-6 p-[18px] max-[480px]:p-3.5 box-border border border-slate-200 rounded-lg bg-slate-50">

          <Checkbox checked={agreeAll} onChange={handleAgreeAll} label="전체 약관에 동의합니다." emphasized />

          <div className="h-px my-3.5 bg-slate-200" />

          <div className="flex items-center gap-2 mt-0">
            <div className="min-w-0 flex-1">
              <Checkbox
                checked={agreements.service}
                onChange={() => handleAgreementChange('service')}
                label={
                  <>
                    <b className="font-semibold text-blue-600">[필수]</b> 서비스 이용약관에 동의합니다.
                  </>
                }
              />
            </div>

            <button
              type="button"
              className="ml-auto shrink-0 whitespace-nowrap p-0 border-none bg-transparent font-inherit text-xs text-slate-400 cursor-pointer transition-colors hover:text-blue-600 hover:underline"
            >
              보기
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <div className="min-w-0 flex-1">
              <Checkbox
                checked={agreements.privacy}
                onChange={() => handleAgreementChange('privacy')}
                label={
                  <>
                    <b className="font-semibold text-blue-600">[필수]</b> 개인정보 수집 및 이용에 동의합니다.
                  </>
                }
              />
            </div>

            <button
              type="button"
              className="ml-auto shrink-0 whitespace-nowrap p-0 border-none bg-transparent font-inherit text-xs text-slate-400 cursor-pointer transition-colors hover:text-blue-600 hover:underline"
            >
              보기
            </button>
          </div>

        </div>

        {/* 가입 버튼 */}
        <button
          type="submit"
          className="w-full h-12 border-none rounded-lg bg-blue-600 text-white font-inherit text-sm font-semibold cursor-pointer transition-[background-color,transform] hover:bg-blue-700 active:translate-y-px"
        >
          회원가입
        </button>

      </form>

      {/* 소셜 회원가입 */}
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
            onClick={() => handleSocialSignup('google')}
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

            <span>Google로 회원가입</span>
          </button>

          {/* Naver */}
          <button
            type="button"
            onClick={() => handleSocialSignup('naver')}
            className="relative w-full h-12 flex items-center justify-center border border-[#03C75A] rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-colors bg-[#03C75A] text-white hover:bg-[#02b351] hover:border-[#02b351]"
          >
            <span className="absolute left-4 w-[22px] h-[22px] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.8491 8.56267L4.91687 0H0V16H5.15088V7.436L11.0831 16H16V0H10.8491V8.56267Z" fill="white" />
              </svg>
            </span>

            <span>네이버로 회원가입</span>
          </button>

        </div>
      </div>

      {/* 로그인으로 이동 */}
      <div className="flex justify-center items-center gap-1.5 mt-[22px] text-sm text-slate-500">
        <span>이미 회원이신가요?</span>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="p-0 border-none bg-transparent font-inherit text-sm font-semibold text-blue-600 cursor-pointer hover:underline"
        >
          로그인
        </button>
      </div>
    </AuthCardShell>
  );
}

export default Signup;

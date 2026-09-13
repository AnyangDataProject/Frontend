import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCardShell from '../../components/citizen/AuthCardShell';
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
            placeholder="영문, 숫자를 포함하여 8자 이상 입력해주세요"
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

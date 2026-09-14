import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCardShell from '../../components/auth/AuthCardShell';
import InfoNotice from '../../components/citizen/InfoNotice';
import AuthLinksRow from '../../components/auth/AuthLinksRow';
import SuccessScreen from '../../components/citizen/SuccessScreen';
import { AUTH_INPUT_CLASS } from '../../components/auth/authInputClass';
import { useFormFields } from '../../hooks/auth/useFormFields';

function FindPassword() {
  const navigate = useNavigate();

  const [form, handleChange, setForm] = useFormFields({
    email: '',
  });

  const [result, setResult] = useState(false);

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
    <AuthCardShell
      title="비밀번호 찾기"
      description={
        <>
          가입한 이메일을 입력하면
          <br />
          비밀번호를 재설정할 수 있습니다.
        </>
      }
      maxWidth={480}
    >
      {!result ? (
        <>
          <form onSubmit={handleSubmit}>

            {/* 이메일 */}
            <div className="mb-[18px] text-left">
              <label htmlFor="password-email" className="block mb-2 text-xs font-medium text-slate-700">
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
                className={AUTH_INPUT_CLASS}
              />
            </div>

            {/* 찾기 버튼 */}
            <button
              type="submit"
              className="w-full h-12 mt-2 border-none rounded-lg bg-blue-600 text-white font-inherit text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-700"
            >
              비밀번호 찾기
            </button>

          </form>

          <InfoNotice>
            가입한 이메일로 비밀번호 재설정 안내를
            <br />
            보내드립니다.
          </InfoNotice>
        </>
      ) : (
        <SuccessScreen
          title="메일을 확인해주세요."
          description={
            <>
              입력하신 이메일로 비밀번호 재설정
              <br />
              안내 메일을 보내드렸습니다.
            </>
          }
          summary={
            <>
              <div className="px-5 py-4 text-center border border-slate-200 rounded-lg bg-slate-50">
                <span className="block mb-1 text-xs text-slate-400">전송된 이메일</span>
                <strong className="text-base font-semibold text-slate-900">{form.email}</strong>
              </div>

              <p className="mt-3.5 mb-0 text-xs leading-relaxed text-slate-400">
                이메일이 도착하지 않았다면
                <br />
                스팸 메일함을 확인해주세요.
              </p>
            </>
          }
          primaryAction={
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex-1 h-12 border-none rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              로그인하기
            </button>
          }
          secondaryAction={
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 h-12 rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-colors border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            >
              다시 찾기
            </button>
          }
        />
      )}

      {/* 하단 메뉴 */}
      <AuthLinksRow
        links={[
          { label: '로그인', to: '/login' },
          { label: '아이디 찾기', to: '/find-id' },
          { label: '회원가입', to: '/signup' },
        ]}
      />
    </AuthCardShell>
  );
}

export default FindPassword;

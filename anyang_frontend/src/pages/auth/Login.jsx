import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthCardShell from '../../components/auth/AuthCardShell';
import Checkbox from '../../components/common/Checkbox';
import InfoNotice from '../../components/citizen/InfoNotice';
import AuthLinksRow from '../../components/auth/AuthLinksRow';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import { AUTH_INPUT_CLASS } from '../../components/auth/authInputClass';
import MessageModal from '../../components/common/MessageModal';
import { useMessageModal } from '../../hooks/useMessageModal';
import { useFormFields } from '../../hooks/auth/useFormFields';
import { login } from '../../api/auth';
import { useAuth } from '../../hooks/auth/useAuth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthUser } = useAuth();

  const [form, handleChange] = useFormFields({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);

  const { modal, showError, showInfo, close: closeModal } = useMessageModal();

  useEffect(() => {
    if (location.state?.signupSuccess) {
      showInfo('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, showInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      showError('이메일을 입력해주세요.');
      return;
    }

    if (!form.password) {
      showError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const data = await login(form);

      setAuthUser(data, { rememberMe });
      navigate(data?.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      showError(err.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <AuthCardShell
      title="로그인"
      description={
        <>
          안양시 알로드 서비스에
          <br />
          로그인해주세요.
        </>
      }
      footer={
        <InfoNotice>
          안양시 알로드 서비스는 시민 여러분의
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
            className={AUTH_INPUT_CLASS}
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
            className={AUTH_INPUT_CLASS}
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
      <SocialLoginButtons actionLabel="로그인" />

      {/* 하단 메뉴 */}
      <AuthLinksRow
        links={[
          { label: '아이디 찾기', to: '/find-id' },
          { label: '비밀번호 찾기', to: '/find-password' },
          { label: '회원가입', to: '/signup' },
        ]}
      />

      <MessageModal
        open={!!modal}
        onClose={closeModal}
        variant={modal?.variant}
        message={modal?.message}
      />
    </AuthCardShell>
  );
}

export default Login;

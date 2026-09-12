import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCardShell from '../components/citizen/AuthCardShell';
import InfoNotice from '../components/citizen/InfoNotice';
import AuthLinksRow from '../components/citizen/AuthLinksRow';
import SuccessScreen from '../components/citizen/SuccessScreen';

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

  const inputClass =
    'w-full h-12 px-[14px] box-border border border-slate-200 rounded-lg outline-none font-inherit text-sm text-slate-900 bg-white transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  return (
    <AuthCardShell
      title="아이디 찾기"
      description={
        <>
          가입할 때 입력한 정보를 통해
          <br />
          아이디를 찾아보세요.
        </>
      }
      maxWidth={480}
    >
      {!result ? (
        <>
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
                required
                className={inputClass}
              />
            </div>

            {/* 이메일 */}
            <div className="mb-[18px] text-left">
              <label htmlFor="email" className="block mb-2 text-xs font-medium text-slate-700">
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
                className={inputClass}
              />
            </div>

            {/* 찾기 버튼 */}
            <button
              type="submit"
              className="w-full h-12 mt-2 border-none rounded-lg bg-blue-600 text-white font-inherit text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-700"
            >
              아이디 찾기
            </button>

          </form>

          <InfoNotice>
            가입 시 입력한 이름과 이메일이
            <br />
            회원정보와 일치해야 아이디를 찾을 수 있습니다.
          </InfoNotice>
        </>
      ) : (
        <SuccessScreen
          title="아이디를 찾았습니다."
          description={
            <>
              회원님의 아이디가 등록된 이메일로
              <br />
              안내되었습니다.
            </>
          }
          summary={
            <div className="px-5 py-4 text-center border border-slate-200 rounded-lg bg-slate-50">
              <span className="block mb-1 text-xs text-slate-400">가입 이메일</span>
              <strong className="text-base font-semibold text-slate-900">{result.email}</strong>
            </div>
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
          { label: '비밀번호 찾기', to: '/find-password' },
          { label: '회원가입', to: '/signup' },
        ]}
      />
    </AuthCardShell>
  );
}

export default FindId;
